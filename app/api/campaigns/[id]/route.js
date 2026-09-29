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

function token(request) {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|;\s*)contentforge_access_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

async function userId(request) {
    const accessToken = token(request);
    if (!accessToken || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return null;
    const response = await fetch(process.env.SUPABASE_URL.replace(/\/$/, '') + '/auth/v1/user', {
        headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + accessToken },
        cache: 'no-store',
    });
    if (!response.ok) return null;
    return (await response.json()).id;
}

export async function DELETE(request, { params }) {
    const url = tableUrl();
    if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) return Response.json({ mode: 'local', message: 'Supabase is not configured.' });
    const uid = await userId(request);
    if (!uid) return Response.json({ error: 'Sign in to manage cloud campaigns.' }, { status: 401 });
    const id = params?.id;
    if (!id) return Response.json({ error: 'Campaign id is required' }, { status: 400 });

    const response = await fetch(url + '?id=eq.' + encodeURIComponent(id) + '&user_id=eq.' + encodeURIComponent(uid), {
        method: 'DELETE', headers: { ...headers(), Prefer: 'return=representation' }, cache: 'no-store',
    });
    if (!response.ok) return Response.json({ error: 'Could not delete campaign', details: await response.text() }, { status: 502 });
    return Response.json({ mode: 'supabase', deleted: true, id });
}
