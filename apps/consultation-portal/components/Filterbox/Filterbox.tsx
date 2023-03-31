import { CaseFilter, FilterInputItems } from '../../types/interfaces'
import {
  Box,
  Button,
  Checkbox,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'

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
    setFilters(filtersCopy)
  }

  const onChangeCheckbox = (value: number) => {
    const filtersCopy = { ...filters }
    const index = filtersCopy[type].items.findIndex((x) => x.value === value)
    const instance = filtersCopy[type].items[index]
    instance.checked = !instance.checked
    filtersCopy[type].items[index] = instance
    setFilters(filtersCopy)
  }

  const onChangeRadio = (value: number) => {
    const filtersCopy = { ...filters }
    const prevIndex = filtersCopy[type].items.findIndex(
      (x) => x.checked === true,
    )
    const thisIndex = filtersCopy[type].items.findIndex(
      (x) => x.value === value,
    )
    if (prevIndex !== thisIndex) {
      filtersCopy[type].items[prevIndex].checked = false
      filtersCopy[type].items[thisIndex].checked = true
      setFilters(filtersCopy)
    }
  }

  const onClean = () => {
    const filtersCopy = { ...filters }
    if (type === 'sorting') {
      onChangeRadio(0)
    } else {
      filtersCopy[type].items.map((item: FilterInputItems) => {
        item.checked = true
      })
    }
    setFilters(filtersCopy)
  }

  const renderLabel = (item) => {
    return `${item.label} (${item.count})`
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
            {thisFilters?.items.map((item, index) =>
              type === 'sorting' ? (
                <Checkbox
                  key={index}
                  checked={item?.checked}
                  label={item?.label}
                  onChange={() => onChangeRadio(item?.value)}
                />
              ) : (
                <Checkbox
                  key={index}
                  checked={item?.checked}
                  label={renderLabel(item)}
                  onChange={() => onChangeCheckbox(item?.value)}
                />
              ),
            )}
            <Box textAlign="right">
              <Button
                size="small"
                icon="arrowForward"
                variant="text"
                onClick={onClean}
                loading={loading}
              >
                Hreinsa síu
              </Button>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default FilterBox
