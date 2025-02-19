export const numberFormat = (value: number): string =>
  value
    .toString()
    .split('.')[0] // remove decimals
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
