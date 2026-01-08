/**
 * Lifecycles for api::container.container
 * Setzt priceMonthly automatisch anhand der Größe.
 */

const PRICE_MAP = {
  S: 100,
  M: 150,
  L: 200,
};

function applyPrice(data = {}) {
  if (!data.size) return;
  const price = PRICE_MAP[data.size];
  if (price !== undefined) {
    data.priceMonthly = price;
  }
}

module.exports = {
  async beforeCreate(event) {
    applyPrice(event.params?.data);
  },
  async beforeUpdate(event) {
    applyPrice(event.params?.data);
  },
};
