import {
  Accordion,
  AccordionItem,
  Box,
  Select,
} from '@island.is/island-ui/core'

interface Props {
  title: string
  id: string
  placeholder: string
  items: Array<{
    value: string
    label: string
  }>
  value?: string
  onChange: (value: string | undefined) => void
  initiallyExpanded?: boolean
}

export const FilterSelectAccordion = ({
  title,
  id,
  placeholder,
  items,
  value,
  onChange,
  initiallyExpanded = false,
}: Props) => {
  return (
    <Box paddingTop={1} paddingX={3}>
      <Accordion
        space={3}
        dividerOnBottom={false}
        dividerOnTop={false}
        singleExpand
      >
        <AccordionItem
          key={id}
          id={id}
          label={title}
          labelUse="h5"
          labelVariant="h5"
          iconVariant="small"
          startExpanded={initiallyExpanded}
        >
          <Select
            name={id}
            placeholder={placeholder}
            size="xs"
            backgroundColor="blue"
            options={items.map((item) => ({
              value: item.value,
              label: item.label,
            }))}
            value={
              value !== undefined
                ? items.find((item) => item.value === value) ?? null
                : null
            }
            filterOption={(option, inputValue) =>
              inputValue.length > 0 &&
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            onChange={(option) => onChange(option?.value ?? undefined)}
          />
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
