export const currencyStringToNumber = (str: string) => {
  console.log('str', str)
  if (!str || str === '') {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}
