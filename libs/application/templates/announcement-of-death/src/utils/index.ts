export const formatPhoneNumber = (value: string) => {
  const splitAt = (index: number) => (x: string) => [
    x.slice(0, index),
    x.slice(index),
  ]
  if (value.length > 3) return splitAt(3)(value).join('-')
  return value
}
