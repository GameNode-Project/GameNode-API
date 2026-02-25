/**
 * Calcula el precio total añadiendo el impuesto del IVA.
 * @param {number} price - El precio base.
 * @param {number} taxPercentage - El porcentaje de impuesto (por defecto 21%).
 * @returns {number|null} - El precio final redondeado a 2 decimales, o null si los datos son inválidos.
 */
function calculatePriceWithTax(price, taxPercentage = 21) {
  if (price < 0 || taxPercentage < 0) {
    return null;
  }

  const taxAmount = price * (taxPercentage / 100);
  const finalPrice = price + taxAmount;

  return Number(finalPrice.toFixed(2));
}

module.exports = {
  calculatePriceWithTax,
};
