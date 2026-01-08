/**
 * Uso:
 *   cd backend
 *   node scripts/seed-items.js
 *
 * Requer:
 *   Strapi em http://localhost:1337
 *   Public -> Item -> create/find/findOne habilitados
 */

console.log("=== EXECUTANDO SEED ITEMS ===");

const API_URL = process.env.API_URL || "http://localhost:1337";
const ENDPOINT = `${API_URL}/api/items`;

async function getTotal() {
  const res = await fetch(`${ENDPOINT}?pagination[pageSize]=1`);
  const json = await res.json();
  return json?.meta?.pagination?.total ?? 0;
}

async function existsByCode(code) {
  const url = `${ENDPOINT}?filters[code][$eq]=${encodeURIComponent(code)}&pagination[pageSize]=1`;
  const res = await fetch(url);
  const json = await res.json();
  return Array.isArray(json?.data) && json.data.length > 0;
}

async function createItem(data) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
}

function buildItems() {
  const cities = [
    { name: "Düsseldorf", prefix: "DUS" },
    { name: "Köln", prefix: "KOL" },
  ];

  const priceMap = {
    S: { basic: { tier: "p100", value: 100 }, premium: { tier: "p150", value: 150 } },
    M: { basic: { tier: "p150", value: 150 }, premium: { tier: "p200", value: 200 } },
    L: { basic: { tier: "p200", value: 200 }, premium: { tier: "p250", value: 250 } },
  };

  const items = [];

  cities.forEach(({ name, prefix }, cityIdx) => {
    ["S", "M", "L"].forEach((size, sizeIdx) => {
      for (let i = 0; i < 10; i++) {
        const hasCamera = i < 5; // 5 premium (com câmera) + 5 basic (sem câmera)
        const tier = hasCamera ? "premium" : "basic";

        const seq = sizeIdx * 10 + i + 1; // 1..30 por cidade
        const code = `${prefix}-${String(seq).padStart(2, "0")}`;

        const priceInfo = priceMap[size][tier];

        const title = `Container ${size} ${tier === "premium" ? "Premium" : "Basic"} – ${name}`;
        const description = hasCamera
          ? `Container ${size} em ${name}. Acesso por PIN e câmera interna 24/7.`
          : `Container ${size} em ${name}. Acesso por PIN.`;

        items.push({
          code,
          city: name,
          size,
          hasCamera,
          tier,
          priceTier: priceInfo.tier,
          title,
          description,
          status: "available",
          priceMonthly: priceInfo.value,
        });
      }
    });
  });

  return items;
}

async function main() {
  console.log(`API_URL: ${API_URL}`);
  console.log(`ENDPOINT: ${ENDPOINT}`);

  const totalBefore = await getTotal();
  console.log(`Total antes: ${totalBefore}`);

  const items = buildItems();
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of items) {
    const { code } = item;

    try {
      if (await existsByCode(code)) {
        skipped++;
        console.log(`↷ Já existe ${code}`);
        continue;
      }

      await createItem(item);
      created++;
      console.log(`✔ Criado ${code} (${item.status})`);
    } catch (err) {
      failed++;
      console.error(`✖ Falhou ${code}: ${err.message}`);
      // se começar a falhar demais, é enum/validação. Você pode abortar aqui se quiser.
      if (failed >= 3) {
        console.error("Abortando após 3 falhas. Verifique enums/validações do Strapi.");
        break;
      }
    }
  }

  const totalAfter = await getTotal();
  console.log(`Total depois: ${totalAfter}`);
  console.log("---");
  console.log(`Criados: ${created}`);
  console.log(`Pulados: ${skipped}`);
  console.log(`Falhas: ${failed}`);
}

main().catch((err) => {
  console.error("Erro geral no seed:", err);
  process.exit(1);
});
