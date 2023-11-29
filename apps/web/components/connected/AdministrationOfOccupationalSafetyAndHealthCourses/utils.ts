export const getCurrencyString = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' krónur'

export const getDateFormat = (date: string) => {
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'maí',
    'jún',
    'júl',
    'ágú',
    'sep',
    'okt',
    'nóv',
    'des',
  ]
  const arr = date.split('.')
  return arr[0] + '.' + months[parseInt(arr[1]) - 1]
}
