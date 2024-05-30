export const getOrganizationPageUrlPrefix = (locale: string) => {
  if (locale && !locale.includes('is')) {
    return `${locale}/o`
  }
  return 's'
}

export const getProjectPageUrlPrefix = (locale: string) => {
  if (locale && !locale.includes('is')) {
    return `${locale}/p`
  }
  return 'v'
}
