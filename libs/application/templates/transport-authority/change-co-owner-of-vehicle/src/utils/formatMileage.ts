export const formatMileage = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
