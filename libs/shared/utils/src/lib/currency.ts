export enum CurrencyPostfix {
  isk = 'kr.',
}

export const formatCurrency = (
  value: number | string,
  currencyPostfix: string = CurrencyPostfix.isk,
) => {
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return currencyPostfix
    ? `${formattedValue} ${currencyPostfix}`
    : formattedValue
}

export const formatCurrencyWithoutSuffix = (value: number | string) =>
  formatCurrency(value, '')
