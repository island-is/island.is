export const formatNumberToString = (item?: number) => {
  if (item === undefined) {
    return ''
  }
  return item === 0 ? '0' : item.toString()
}
