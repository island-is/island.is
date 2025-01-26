export const currencyStringToNumber = (str: string) => {
  if (!str) {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}

export const formatCurrency = (answer?: string) => {
  if (!answer) return '0. kr'
  return answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
}

export const isPositiveNumberInString = (input: string) => {
  return Number(input) >= 0
}
