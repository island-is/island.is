import format from 'date-fns/format'

export const formatDate = (date: number) => {
  try {
    return format(new Date(date), 'MMM yy')
  } catch {
    return ''
  }
}

export const formatValueForPresentation = (value?: number | string) => {
  if (value === undefined) {
    return null
  }

  try {
    if (typeof value === 'number' || !Number.isNaN(value)) {
      const isGreaterOrEqualToMillion = (value as number) >= 1e6

      const postfix = isGreaterOrEqualToMillion ? 'm' : ''

      const v = isGreaterOrEqualToMillion
        ? Math.round(Number(value) / 1e4) / 100
        : value

      return `${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${postfix}`
    }
  } catch {
    // pass
  }

  return value
}
