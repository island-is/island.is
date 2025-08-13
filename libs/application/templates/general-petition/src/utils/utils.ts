export const isWorkday = (date: Date): boolean => {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

export const adjustToNextWorkday = (date: Date): Date => {
  while (!isWorkday(date)) {
    date.setDate(date.getDate() + 1)
  }
  return date
}
