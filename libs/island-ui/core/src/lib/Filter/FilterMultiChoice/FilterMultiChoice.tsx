import React, { useContext } from 'react'
import { Accordion } from '../../Accordion/Accordion'
import {
  AccordionCard,
  AccordionItem,
} from '../../Accordion/AccordionItem/AccordionItem'
import { Box } from '../../Box/Box'
import { Button } from '../../Button/Button'
import { Checkbox } from '../../Checkbox/Checkbox'
import { Stack } from '../../Stack/Stack'
import { FilterContext } from '../Filter'

type FilterCategory = {
  /** Id for the category. */
  id: string
  /** The category label to display on screen. */
  label: string
  /** The array of currently selected active filters. */
  selected: Array<string>
  /** Array of available filters in this category. */
  filters: Array<FilterItem>
}

type FilterItem = {
  value: string
  label: string
}

type FilterMultiChoiceChangeEvent = {
  /** Id of the category the selected values belongs to. */
  categoryId: string
  /** Array of selected items in the corresponding category. */
  selected: Array<string>
}

export interface FilterMultiChoiceProps {
  /** Array of different categories grouping different filter values */
  categories: ReadonlyArray<FilterCategory>
  /** Label for clear button for localization */
  labelClear: string
  /** OnChange event handler when user checks/unchecks a value */
  onChange: (event: FilterMultiChoiceChangeEvent) => void
  /** OnClear event handler to clear selected values for specific category */
  onClear: (categoryId: string) => void
}

export const FilterMultiChoice: React.FC<FilterMultiChoiceProps> = ({
  labelClear,
  categories,
  onChange,
  onClear,
}: FilterMultiChoiceProps) => {
  const { isDialog } = useContext(FilterContext)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: FilterCategory,
  ) => {
    if (event.target.checked) {
      category.selected.push(event.target.value)
    } else {
      category.selected.splice(category.selected.indexOf(event.target.value), 1)
    }

    onChange({
      categoryId: category.id,
      selected: category.selected,
    })
  }

  return (
    <>
      {isDialog ? (
        <Stack space={2}>
          {categories.map((category) => (
            <AccordionCard
              key={category.id}
              id={category.id}
              label={category.label}
              iconVariant="small"
            >
              <Stack space={2}>
                {category.filters.map((filter) => (
                  <Checkbox
                    key={`${category.id}-${filter.value}`}
                    name={`${category.id}-${filter.value}`}
                    label={filter.label}
                    value={filter.value}
                    checked={category.selected.includes(filter.value)}
                    onChange={(event) => handleChange(event, category)}
                  />
                ))}

                {category.selected.length > 0 && (
                  <Box textAlign="right">
                    <Button
                      icon="reload"
                      size="small"
                      variant="text"
                      onClick={() => onClear(category.id)}
                    >
                      {labelClear}
                    </Button>
                  </Box>
                )}
              </Stack>
            </AccordionCard>
          ))}
        </Stack>
      ) : (
        <Box paddingX={3} paddingY={1} borderRadius="large" background="white">
          <Accordion
            space={3}
            dividerOnBottom={false}
            dividerOnTop={false}
            singleExpand={false}
          >
            {categories.map((category) => (
              <AccordionItem
                key={category.id}
                id={category.id}
                label={category.label}
                labelUse="h5"
                labelVariant="h5"
                labelColor={
                  category.selected.length > 0 ? 'blue400' : 'currentColor'
                }
                iconVariant="small"
              >
                <Stack space={2}>
                  {category.filters.map((filter) => (
                    <Checkbox
                      key={`${category.id}-${filter.value}`}
                      name={`${category.id}-${filter.value}`}
                      label={filter.label}
                      value={filter.value}
                      checked={category.selected.includes(filter.value)}
                      onChange={(event) => handleChange(event, category)}
                    />
                  ))}

                  {category.selected.length > 0 && (
                    <Box textAlign="right">
                      <Button
                        icon="reload"
                        size="small"
                        variant="text"
                        onClick={() => onClear(category.id)}
                      >
                        {labelClear}
                      </Button>
                    </Box>
                  )}
                </Stack>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}
    </>
  )
}
