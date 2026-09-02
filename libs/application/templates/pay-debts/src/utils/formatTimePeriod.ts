export const formatTimePeriod = (timePeriod: string): string => {
  if (!timePeriod) {
    return ''
  }

  if (!/^\d{6}$/.test(timePeriod)) {
    return timePeriod
  }

  return `${timePeriod.slice(0, 4)}/${timePeriod.slice(4)}`
}
