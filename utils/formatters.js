export function getFormattedPrice(price) {
  return `$${(price / 100).toFixed(2)}`;
}
