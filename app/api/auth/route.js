const supabaseUrl = () => process.env.SUPABASE_URL?.replace(/\/$/, '');
const anonKey = () => process.env.SUPABASE_ANON_KEY || '';

function authHeaders() {
    return {
        apikey: anonKey(),
        'Content-Type': 'application/json',
    };
}

export async function POST(request) {
    const payload = await request.json().catch(() => ({}));
    const action = payload.action;
    const email = String(payload.email || '').trim();
    const password = String(payload.password || '');

    if (!supabaseUrl() || !anonKey()) {
        return Response.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
    }
    if (!email || !password) {
        return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const endpoint = action === 'signup' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
    const response = await fetch(supabaseUrl() + endpoint, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return Response.json({ error: data.msg || data.error_description || data.message || 'Authentication failed.' }, { status: response.status });
    }

    const token = data.access_token;
    const result = Response.json({
        authenticated: Boolean(token),
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        needsConfirmation: !token,
    });
    if (token) {
        result.headers.set('Set-Cookie', `contentforge_access_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}Max-Age=3600`);
    }
    return result;
}

export async function GET(request) {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|;\s*)contentforge_access_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (!token || !supabaseUrl() || !anonKey()) return Response.json({ authenticated: false });

    const response = await fetch(supabaseUrl() + '/auth/v1/user', {
        headers: { ...authHeaders(), Authorization: 'Bearer ' + token },
        cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return Response.json({ authenticated: false });
    return Response.json({ authenticated: true, user: { id: data.id, email: data.email } });
}

export async function DELETE() {
    const response = Response.json({ authenticated: false });
    response.headers.set('Set-Cookie', `contentforge_access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`);
    return response;
}
