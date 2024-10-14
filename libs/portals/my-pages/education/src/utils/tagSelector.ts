type ColorValue = 'mint' | 'purple' | 'blue' | 'red'

export const tagSelector = (str: string): ColorValue => {
  switch (str) {
    case 'Lokið':
      return 'mint'
    case 'Ólokið':
      return 'purple'
    case 'Metið':
    case 'M':
      return 'blue'
    case 'Féll':
    case 'Féll á önn':
      return 'red'
    default:
      return 'blue'
  }
}
