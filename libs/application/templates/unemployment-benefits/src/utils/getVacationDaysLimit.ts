//Compare today to setember 15th of the current year for maxDate validation on date picker
export const getVacationDaysLimit = () => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const sept15 = new Date(currentYear, 8, 15)

  return today <= sept15
}
