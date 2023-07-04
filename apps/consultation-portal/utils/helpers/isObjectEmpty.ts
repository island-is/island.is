export const isObjectEmpty = (obj) => {
  if (obj) {
    return Object.keys(obj).length === 0
  }
  return true
}

export default isObjectEmpty
