export const isValidCountry = (previousCountry: string) => {
  switch (previousCountry) {
    case 'USA':
      return false
    default:
      return true
  }
}
