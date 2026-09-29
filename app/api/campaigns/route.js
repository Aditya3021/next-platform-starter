const tableUrl = () => {
    const base = process.env.SUPABASE_URL;
    return base ? base.replace(/\/$/, '') + '/rest/v1/campaigns' : null;
};

function headers() {
    return {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        Authorization: 'Bearer ' + (process.env.SUPABASE_SERVICE_ROLE_KEY || ''),
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
    };
}

export async function POST(request) {
    const payload = await request.json().catch(() => ({}));
    const url = tableUrl();
    if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return Response.json({ mode: 'local', message: 'Supabase is not configured.' });
    }

    const id = payload.id || crypto.randomUUID();
    const record = {
        id,
        name: payload.name || payload.topic || 'Untitled campaign',
        topic: payload.topic || '',
        audience: payload.audience || '',
        goal: payload.goal || '',
        brand_tone: payload.brandTone || '',
        avoid: payload.avoid || '',
        platforms: payload.selectedPlatforms || [],
        assets: payload.assets || [],
        updated_at: new Date().toISOString(),
    };

    const response = await fetch(url + '?on_conflict=id', {
        method: 'POST',
        headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(record),
        cache: 'no-store',
    });

    if (!response.ok) {
        return Response.json({ error: 'Could not save campaign', details: await response.text() }, { status: 502 });
    }

    const rows = await response.json();
    return Response.json({ mode: 'supabase', campaign: rows[0] || record });
}

export async function GET(request) {
    const url = tableUrl();
    if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return Response.json({ mode: 'local', campaigns: [] });
    }

    const response = await fetch(url + '?select=*&order=updated_at.desc&limit=20', {
        headers: headers(),
        cache: 'no-store',
    });

    if (!response.ok) {
        return Response.json({ error: 'Could not load campaigns' }, { status: 502 });
    }

    return Response.json({ mode: 'supabase', campaigns: await response.json() });
}
