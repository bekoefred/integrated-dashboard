export function formatNumber(number: string | number) {
  return new Intl.NumberFormat("en-US").format(Number(number));
}
