import isObjectEmpty from '../isObjectEmpty'

export const mapObjectToValueCountObject = (obj) => {
  if (!isObjectEmpty(obj)) {
    return Object.entries(obj).map(([value, count]) => ({
      value,
      count,
    }))
  }
  return []
}

export default mapObjectToValueCountObject
