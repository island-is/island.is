import { FilterInputItem } from '../../types/interfaces'

export const getFilterItemWithCount = (items: Array<FilterInputItem>) => {
  return items?.map((item) => {
    return {
      ...item,
      label: item?.count ? `${item.label} (${item.count})` : item.label,
    }
  })
}
