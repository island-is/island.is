import { SortOptions } from '../../types/enums'
import { sortLocale } from './sortLocale'

export const sorting = (data, sortTitle) => {
  if (data && data.length > 0) {
    const dataCopy = [...data]
    if (sortTitle === SortOptions.aToZ) {
      return sortLocale({ list: dataCopy, sortOption: 'name' })
    } else if (sortTitle === SortOptions.latest) {
      dataCopy.sort((a, b) => (a.id > b.id ? -1 : 1))
    } else if (sortTitle === SortOptions.oldest) {
      dataCopy.sort((a, b) => (a.id < b.id ? -1 : 1))
    }
    return dataCopy
  }
  return data
}

export default sorting
