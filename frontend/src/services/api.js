const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const CONTAINERS_ENDPOINT = `${BASE_URL}/api/containers`;
const CONTACT_ENDPOINT = `${BASE_URL}/api/contacts`;

function normalizeContainer(entry) {
  if (!entry) return null;
  const raw = entry.attributes || entry.data || entry;

  const hasCamera = raw.has_camera ?? raw.hasCamera ?? false;
  const availabilityStatus = raw.availability_status || raw.availabilityStatus || 'available';
  const sizeValue = raw.size ?? raw.sizeM2 ?? null;
  const city = raw.city || raw.location || 'N/A';
  const plan = hasCamera ? 'premium' : 'basic';
  const priceMonthly = sizeValue === 'S' ? 100 : sizeValue === 'M' ? 150 : sizeValue === 'L' ? 200 : 0;

  return {
    id: entry.id || raw.id,
    code: raw.code,
    size: sizeValue,
    sizeM2: sizeValue, // compat com código existente
    city,
    location: city, // compat com código existente
    hasCamera,
    plan,
    availabilityStatus,
    status: availabilityStatus, // compat com código existente
    priceMonthly,
  };
}

export async function getContainers() {
  const res = await fetch(CONTAINERS_ENDPOINT);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GET /containers failed: ${res.status} - ${errorText}`);
  }
  const json = await res.json();
  const rawItems = json?.data ?? [];
  return rawItems.map(normalizeContainer).filter(Boolean);
}

export async function sendContactMessage(payload) {
  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { ...payload, status: 'new' } }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST /contacts failed: ${res.status} - ${text}`);
    }

    const json = await res.json();
    return { ok: true, data: json?.data };
  } catch (err) {
    console.error('sendContactMessage error', err);
    throw err;
  }
}
