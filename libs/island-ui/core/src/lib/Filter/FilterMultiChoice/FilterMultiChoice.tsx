import React from 'react'
import { Accordion } from '../../Accordion/Accordion'
import { AccordionItem } from '../../Accordion/AccordionItem/AccordionItem'
import { Box } from '../../Box/Box'
import { Button } from '../../Button/Button'
import { Checkbox } from '../../Checkbox/Checkbox'
import { Stack } from '../../Stack/Stack'

type FilterCategory = {
  id: string
  label: string
  selected: Array<string>
  filters: Array<FilterItem>
}

type FilterItem = {
  value: string
  label: string
}

type FilterMultiChoiceChangeEvent = {
  // Name of the category the selected values belongs to
  categoryId: string
  // Array of selected items in the corresponding category
  selected: Array<string>
}

export interface FilterMultiChoiceProps {
  categories: Array<FilterCategory>
  labelClear: string
  onChange: (event: FilterMultiChoiceChangeEvent) => void
  onClear: (categoryId: string) => void
}

export const FilterMultiChoice: React.FC<FilterMultiChoiceProps> = ({
  labelClear,
  categories,
  onChange,
  onClear,
}: FilterMultiChoiceProps) => {
  return (
    <Box paddingX={3} paddingY={1} borderRadius="large" background="white">
      <Accordion
        dividerOnBottom={false}
        dividerOnTop={false}
        singleExpand={false}
      >
        {categories.map((category) => (
          <AccordionItem
            id={category.id}
            label={category.label}
            labelUse="h5"
            labelVariant="h5"
            iconVariant="small"
          >
            <Stack space={1}>
              {category.filters.map((filter) => (
                <Checkbox
                  label={filter.label}
                  value={filter.value}
                  checked={category.selected.includes(filter.value)}
                  onChange={({ target }) => {
                    let selected = category.selected
                    if (target.checked) {
                      selected.push(target.value)
                    } else {
                      selected.splice(
                        category.selected.indexOf(target.value),
                        1,
                      )
                    }

                    onChange({ categoryId: category.id, selected: selected })
                  }}
                />
              ))}

              <Box textAlign="right">
                <Button
                  icon="reload"
                  size="small"
                  variant="text"
                  onClick={(event) => {
                    onClear(category.id)
                  }}
                >
                  {labelClear}
                </Button>
              </Box>
            </Stack>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}
