const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const CONTAINERS_ENDPOINT = `${BASE_URL}/api/containers`;
const CONTACT_ENDPOINT = `${BASE_URL}/api/contacts`;
const RESERVATION_REQUESTS_ENDPOINT = `${BASE_URL}/api/reservation-requests`;

function normalizeContainer(entry) {
  if (!entry) return null;
  const attrs = entry.attributes || entry.data || entry;
  const hasCamera = attrs.has_camera ?? attrs.hasCamera ?? false;
  const status = attrs.availability_status ?? attrs.availabilityStatus ?? attrs.status ?? 'available';
  const size = attrs.size ?? attrs.sizeM2;
  const city = attrs.city ?? attrs.location;
  const code = attrs.code;
  const priceRaw = attrs.price ?? attrs.priceMonthly ?? attrs.price_monthly;
  const price = priceRaw !== undefined ? Number(priceRaw) : 0;
  const priceMonthly = priceRaw !== undefined ? Number(priceRaw) : 0;

  return {
    id: entry.id ?? attrs.id,
    ...attrs,
    code,
    size,
    city,
    hasCamera,
    availabilityStatus: status,
    status,
    price,
    priceMonthly,
  };
}

export async function getContainers() {
  const res = await fetch(`${CONTAINERS_ENDPOINT}?pagination[pageSize]=200`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET /containers failed: ${res.status} - ${text}`);
  }
  const json = await res.json();
  const data = Array.isArray(json?.data) ? json.data : [];
  return data.map(normalizeContainer).filter(Boolean);
}

export async function getContainerById(id) {
  const res = await fetch(`${CONTAINERS_ENDPOINT}/${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET /containers/${id} failed: ${res.status} - ${text}`);
  }
  const json = await res.json();
  const entry = json?.data;
  return normalizeContainer(entry);
}

export async function sendContactMessage(payload) {
  const res = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { ...payload, status: 'new' } }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /contacts failed: ${res.status} - ${text}`);
  }
  return res.json();
}

export async function createReservationRequest(payload) {
  const res = await fetch(RESERVATION_REQUESTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: payload }),
  });

  if (!res.ok) throw new Error('Erro ao criar reserva');
  return res.json();
}
