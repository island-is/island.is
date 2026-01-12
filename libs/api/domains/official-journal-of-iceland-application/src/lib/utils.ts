export const getIcelandicDative = (days: number) => {
  // Check if the number ends in 1 but is not 11
  if (days % 10 === 1 && days % 100 !== 11) {
    return 'degi'
  }
  return 'dögum'
}

export const convertDateToDaysAgo = (dateIso: string): string => {
  try {
    const date = new Date(dateIso)

    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.floor(diff / (1000 * 3600 * 24))

    if (diffDays === 0) {
      return 'Í dag'
    }

    if (diffDays === 1) {
      return 'í gær'
    }

    return `f. ${diffDays} ${getIcelandicDative(diffDays)}`
  } catch (error) {
    return 'Ekki vitað'
  }
}
