import React from 'react'
import { Accordion } from '../../Accordion/Accordion'
import { AccordionItem } from '../../Accordion/AccordionItem/AccordionItem'
import { Box } from '../../Box/Box'
import { Checkbox } from '../../Checkbox/Checkbox'

type FilterCategories = {
  id: string,
  label: string,
  selected: Array<string>,
  filters: Array<FilterItem>
}

type FilterItem = {
  value: string,
  label: string,
}

type FilterChangeEvent = {
  // Name of the category the selected values belongs to
  category: string,
  // Array of selected items in the corresponding category
  selected: Array<string>
}

export interface FilterMultiChoiceCProps {
  categories: Array<FilterCategories>,
  onChange: (event: FilterChangeEvent) => void
}

export const FilterMultiChoice: React.FC<FilterMultiChoiceCProps> = ({
  categories,
  onChange
} : FilterMultiChoiceCProps) => {
  return (
    <Box padding={3} borderRadius="large" background="white">
      <Accordion dividerOnBottom={false} dividerOnTop={false} singleExpand={false}>
        {categories.map((category) => (
          <AccordionItem id={category.id} label={category.label}>
            {category.filters.map((filter) => (
              <Box padding={1}>
                <Checkbox 
                  label={filter.label}
                  value={filter.value}
                  checked={category.selected.includes(filter.value)}
                  name={category.id}
                  onChange={({target}) => {
                    let selected = category.selected
                    if (target.checked) {
                      selected.push(target.value)
                    }
                    else {
                      selected.splice(category.selected.indexOf(target.value), 1)
                    }
                    
                    onChange({category: target.name, selected: selected})
                  }}
                />
              </Box>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}