import { SortOptions } from '../../types/enums'

export const sorting = (data, sortTitle) => {
  const dataCopy = [...data]
  if (sortTitle === SortOptions.aToZ) {
    dataCopy.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortTitle === SortOptions.latest) {
    dataCopy.sort((a, b) => (a.id > b.id ? -1 : 1))
  } else if (sortTitle === SortOptions.oldest) {
    dataCopy.sort((a, b) => (a.id < b.id ? -1 : 1))
  }
  return dataCopy
}

export default sorting
