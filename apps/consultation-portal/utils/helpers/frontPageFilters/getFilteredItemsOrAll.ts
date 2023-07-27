import { FilterInputItem } from '../../../types/interfaces'

interface Props {
  items: Array<FilterInputItem>
  defaultItems: Array<FilterInputItem>
}

const getArrayOfIds = (items: Array<FilterInputItem>) => {
  if (items) {
    return items.map((item) => parseInt(item.value))
  }
  return []
}

export const getFilteredItemsOrAll = ({ items, defaultItems }: Props) => {
  if (items) {
    const checkedItems = items.filter((item: FilterInputItem) => item.checked)
    const arrOfIds = getArrayOfIds(checkedItems)
    if (arrOfIds.length !== 0) {
      return arrOfIds
    }
  }
  return getArrayOfIds(defaultItems)
}

export default getFilteredItemsOrAll
