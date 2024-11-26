export const cropText = (text: string, length: number, suffix = '...') => {
  if (text.length > length + suffix.length) {
    return text.substring(0, length) + suffix
  }
  return text
}
