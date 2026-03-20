export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export const capitalizeEveryWord = (s: string) => {
  return s.split(' ').map(capitalize).join(' ')
}
