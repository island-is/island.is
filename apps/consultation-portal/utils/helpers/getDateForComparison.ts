export const getDateForComparison = (date: Date | string) => {
  try {
    return new Date(date).getTime()
  } catch (e) {
    console.error(e)
    return null
  }
}
