export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' krónur'

export const parseDateString = (date: string) => {
  const [day, month, year] = date.split('.')
  return new Date(Number(year), Number(month) - 1, Number(day))
}
