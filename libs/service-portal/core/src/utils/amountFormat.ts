export const amountFormat = (value: number): string => {
  if (value === 0) return '0 kr.'
  return `${Number(value.toFixed(1).replace(/\.0$/, '')).toLocaleString(
    'de-DE',
  )} kr.`
}
