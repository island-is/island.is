import {
  Accordion,
  AccordionItem,
  Box,
  DatePicker,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'

interface Props {
  title: string
  id: string
  locale: Locale
  placeholder: string
  valueFrom: Date
  valueTo: Date
  onChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  initiallyExpanded?: boolean
}

export const FilterDateAccordion = ({
  title,
  id,
  locale,
  valueFrom,
  valueTo,
  placeholder,
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
          <DatePicker
            name={id}
            backgroundColor="blue"
            label={''}
            placeholderText={placeholder}
            size="xs"
            locale={locale}
            range
            selectedRange={{ startDate: valueFrom, endDate: valueTo }}
            handleChange={onChange}
          />
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
