import format from 'date-fns/format'

export const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

export const getBaseUrl = () => {
  const baseUrl =
    window.location.origin === 'http://localhost:4200'
      ? 'http://localhost:4242'
      : window.location.origin

  return `${baseUrl}/umsoknir/undirskriftalisti`
}

export const pageSize = 10
