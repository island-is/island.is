const amountFormat = (value: number): string => {
  return `${Number(value.toFixed(1).replace(/\.0$/, '')).toLocaleString(
    'de-DE',
  )} kr.`
}

export default amountFormat
