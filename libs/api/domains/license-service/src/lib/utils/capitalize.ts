export const capitalizeEveryWord = (s?: string) => {
  if (typeof s !== 'string') return ''

  const arr = s.split(' ')

  const capitalized = arr.map(
    (item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
  )

  const word = capitalized.join(' ')
  return word
}

export const capitalize = (s?: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
