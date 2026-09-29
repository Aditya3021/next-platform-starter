const tableUrl = () => {
    const base = process.env.SUPABASE_URL;
    return base ? base.replace(/\/$/, '') + '/rest/v1/campaigns' : null;
};

function headers() {
    return {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        Authorization: 'Bearer ' + (process.env.SUPABASE_SERVICE_ROLE_KEY || ''),
        'Content-Type': 'application/json',
    };
}

function accessToken(request) {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|;\s*)contentforge_access_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

async function currentUser(request) {
    const token = accessToken(request);
    if (!token || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return null;
    const response = await fetch(process.env.SUPABASE_URL.replace(/\/$/, '') + '/auth/v1/user', {
        headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
        cache: 'no-store',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function POST(request) {
    const payload = await request.json().catch(() => ({}));
    const url = tableUrl();
    if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return Response.json({ mode: 'local', message: 'Supabase is not configured.' });
    }

    const user = await currentUser(request);
    if (!user?.id) return Response.json({ error: 'Sign in to save cloud campaigns.' }, { status: 401 });

    const id = payload.id || crypto.randomUUID();
    const record = {
        id, user_id: user.id,
        name: payload.name || payload.topic || 'Untitled campaign',
        topic: payload.topic || '', audience: payload.audience || '', goal: payload.goal || '',
        brand_tone: payload.brandTone || '', avoid: payload.avoid || '',
        platforms: payload.selectedPlatforms || [], assets: payload.assets || [],
        updated_at: new Date().toISOString(),
    };

    const response = await fetch(url + '?on_conflict=id', {
        method: 'POST',
        headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(record), cache: 'no-store',
    });
    if (!response.ok) return Response.json({ error: 'Could not save campaign', details: await response.text() }, { status: 502 });
    const rows = await response.json();
    return Response.json({ mode: 'supabase', campaign: rows[0] || record });
}

export async function GET(request) {
    const url = tableUrl();
    if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) return Response.json({ mode: 'local', campaigns: [] });

    const user = await currentUser(request);
    if (!user?.id) return Response.json({ mode: 'supabase', campaigns: [], authenticated: false });

    const response = await fetch(url + '?select=*&user_id=eq.' + encodeURIComponent(user.id) + '&order=updated_at.desc&limit=20', {
        headers: headers(), cache: 'no-store',
    });
    if (!response.ok) return Response.json({ error: 'Could not load campaigns' }, { status: 502 });
    return Response.json({ mode: 'supabase', campaigns: await response.json(), authenticated: true });
}
