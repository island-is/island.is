export enum CurrencyPostfix {
  isk = 'kr.',
}

export const formatCurrency = (
  value: number,
  currencyPostfix = CurrencyPostfix.isk,
) => {
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return currencyPostfix
    ? `${formattedValue} ${currencyPostfix}`
    : formattedValue
}
