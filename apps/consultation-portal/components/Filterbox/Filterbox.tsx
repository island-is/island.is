import { setItem } from '../../utils/helpers/localStorage'
import { CaseFilter, FilterInputItem } from '../../types/interfaces'
import {
  Box,
  Button,
  Checkbox,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { FILTERS_FRONT_PAGE_KEY } from '../../utils/consts/consts'

interface FilterBoxProps {
  title: string
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
  type: string
  loading?: boolean
}

const FilterBox = ({
  title,
  filters,
  setFilters,
  type,
  loading,
}: FilterBoxProps) => {
  const thisFilters = filters[type]

  const onChangeIsOpen = () => {
    const filtersCopy = { ...filters }
    const updatedInstance = { ...thisFilters, isOpen: !thisFilters.isOpen }
    filtersCopy[type] = updatedInstance
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const onChangeCheckbox = (value: string) => {
    const filtersCopy = { ...filters }
    const index = filtersCopy[type].items.findIndex((x) => x.value === value)
    const instance = filtersCopy[type].items[index]
    instance.checked = !instance.checked
    filtersCopy[type].items[index] = instance
    filtersCopy.pageNumber = 0
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const onChangeRadio = (value: string) => {
    const filtersCopy = { ...filters }
    const prevIndex = filtersCopy[type].items.findIndex(
      (x) => x.checked === true,
    )
    const nextIndex = filtersCopy[type].items.findIndex(
      (x) => x.value === value,
    )
    if (prevIndex !== nextIndex) {
      filtersCopy.sorting.items[prevIndex].checked = false
      filtersCopy.sorting.items[nextIndex].checked = true
      filtersCopy.pageNumber = 0
      setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
      setFilters(filtersCopy)
    }
  }

  const onClear = () => {
    const filtersCopy = { ...filters }
    if (type === 'sorting') {
      onChangeRadio('0')
    } else {
      filtersCopy[type].items.map((item: FilterInputItem) => {
        item.checked = false
      })
    }
    filtersCopy.pageNumber = 0
    setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
    setFilters(filtersCopy)
  }

  const renderLabel = (item) => {
    const renderCount = item?.count !== 0 ? ` (${item.count})` : ``
    return `${item.label}${renderCount}`
  }

  const checkedItems = thisFilters.items.filter(
    (item: FilterInputItem) => item.checked,
  )

  const clearCategoryCheck = (thisFilters) => {
    if (type === 'sorting') {
      if (!thisFilters?.items[0].checked) {
        return true
      }
    } else {
      if (checkedItems.length !== 0) {
        return true
      }
    }
    return false
  }

  return (
    <Box
      borderColor="blue200"
      borderRadius="standard"
      borderWidth="standard"
      padding={2}
    >
      <Stack space={2}>
        <Inline justifyContent={'spaceBetween'}>
          <Text variant={'h3'}>{title}</Text>
          <Button
            colorScheme="light"
            circle
            icon={thisFilters?.isOpen ? 'remove' : 'add'}
            title={thisFilters?.isOpen ? 'Loka' : 'Opna'}
            onClick={onChangeIsOpen}
          />
        </Inline>
        {thisFilters?.isOpen && (
          <>
            {thisFilters?.items?.map((item: FilterInputItem, index: number) =>
              type === 'sorting' ? (
                <Checkbox
                  key={index}
                  checked={item.checked}
                  label={item?.label}
                  onChange={() => onChangeRadio(item?.value)}
                />
              ) : (
                <Checkbox
                  key={index}
                  checked={item.checked}
                  label={renderLabel(item)}
                  onChange={() => onChangeCheckbox(item?.value)}
                />
              ),
            )}
            {clearCategoryCheck(thisFilters) && (
              <Box textAlign="right">
                <Button
                  size="small"
                  icon="arrowForward"
                  variant="text"
                  onClick={onClear}
                  loading={loading}
                >
                  Hreinsa síu
                </Button>
              </Box>
            )}
          </>
        )}
      </Stack>
    </Box>
  )
}

export default FilterBox
