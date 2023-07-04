import { FilterInputItem } from '../../../types/interfaces'

const getFilterItemWithCount = (items: Array<FilterInputItem>) => {
  return items?.map((item) => {
    return {
      ...item,
      label: item?.count ? `${item.label} (${item.count})` : item.label,
    }
  })
}

export default getFilterItemWithCount
