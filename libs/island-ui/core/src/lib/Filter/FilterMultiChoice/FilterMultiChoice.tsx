import React, { FC, ReactNode, useContext, ChangeEvent } from 'react'
import { Accordion } from '../../Accordion/Accordion'
import {
  AccordionCard,
  AccordionItem,
} from '../../Accordion/AccordionItem/AccordionItem'
import { Box } from '../../Box/Box'
import { Button } from '../../Button/Button'
import { Checkbox } from '../../Checkbox/Checkbox'
import { RadioButton } from '../../RadioButton/RadioButton'
import { Inline } from '../../Inline/Inline'
import { Stack } from '../../Stack/Stack'
import { FilterContext } from '../Filter'

type FilterCategory = {
  /** Id for the category. */
  id: string
  /** The category label to display on screen. */
  label: string | ReactNode
  /** The array of currently selected active filters. */
  selected: Array<string>
  /** Array of available filters in this category. */
  filters: Array<FilterItem>
  /** Display checkboxes inline */
  inline?: boolean
  /** Allow only one option at a time */
  singleOption?: boolean
}

type FilterItem = {
  value: string
  label: string | ReactNode
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
  /** Only expand one accordion item at a time */
  singleExpand?: boolean
  /** OnChange event handler when user checks/unchecks a value */
  onChange: (event: FilterMultiChoiceChangeEvent) => void
  /** OnClear event handler to clear selected values for specific category */
  onClear: (categoryId: string) => void
}

export const FilterMultiChoice: FC<
  React.PropsWithChildren<FilterMultiChoiceProps>
> = ({
  labelClear,
  categories,
  singleExpand,
  onChange,
  onClear,
}: FilterMultiChoiceProps) => {
  const { variant } = useContext(FilterContext)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    category: FilterCategory,
    singleOption = false,
  ) => {
    if (event.target.checked) {
      singleOption
        ? (category.selected = [event.target.value])
        : category.selected.push(event.target.value)
    } else {
      category.selected.splice(category.selected.indexOf(event.target.value), 1)
    }

    onChange({
      categoryId: category.id,
      selected: category.selected,
    })
  }

  const renderCategoryFilters = (category: FilterCategory) =>
    category.filters.map((filter, index) =>
      category.singleOption ? (
        <RadioButton
          key={`${category.id}-${filter.value}-${index}`}
          name={`${category.id}-${filter.value}-${index}`}
          label={filter.label}
          value={filter.value}
          checked={category.selected.includes(filter.value)}
          onChange={(event) => handleChange(event, category, true)}
        />
      ) : (
        <Checkbox
          key={`${category.id}-${filter.value}-${index}`}
          name={`${category.id}-${filter.value}-${index}`}
          label={filter.label}
          value={filter.value}
          checked={category.selected.includes(filter.value)}
          onChange={(event) => handleChange(event, category)}
        />
      ),
    )

  return variant === 'dialog' ? (
    <Stack space={2}>
      {categories.map((category) => (
        <AccordionCard
          key={category.id}
          id={category.id}
          label={category.label}
          iconVariant="small"
        >
          <Stack space={2}>
            <CheckboxWrapper inline={category.inline}>
              {renderCategoryFilters(category)}
            </CheckboxWrapper>
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
        singleExpand={singleExpand}
      >
        {categories.map((category, index) => (
          <AccordionItem
            key={`${category.id}-${index}}`}
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
              <CheckboxWrapper inline={category.inline}>
                {renderCategoryFilters(category)}
              </CheckboxWrapper>
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
  )
}

interface CheckboxWrapperProps {
  inline?: boolean
  children: ReactNode
}

const CheckboxWrapper = ({ inline = false, children }: CheckboxWrapperProps) =>
  inline ? (
    <Inline space={1} justifyContent="spaceBetween">
      {children}
    </Inline>
  ) : (
    <Stack space={2}>{children}</Stack>
  )
