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

export async function DELETE(_request, { params }) {
    const url = tableUrl();
    if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return Response.json({ mode: 'local', message: 'Supabase is not configured.' });
    }

    const id = params?.id;
    if (!id) return Response.json({ error: 'Campaign id is required' }, { status: 400 });

    const response = await fetch(url + '?id=eq.' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: { ...headers(), Prefer: 'return=representation' },
        cache: 'no-store',
    });

    if (!response.ok) {
        return Response.json({ error: 'Could not delete campaign', details: await response.text() }, { status: 502 });
    }

    return Response.json({ mode: 'supabase', deleted: true, id });
}
