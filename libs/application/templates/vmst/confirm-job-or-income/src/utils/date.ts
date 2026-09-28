export const getCurrentMonthStartDate = (): Date => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), 1)
}

export const getCurrentMonthEndDate = (): Date => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0)
}
