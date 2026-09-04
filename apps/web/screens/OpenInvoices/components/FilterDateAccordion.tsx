import { useIntl } from 'react-intl'
import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'

import {
  Accordion,
  AccordionItem,
  Box,
  DatePicker,
  Inline,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'

import { m } from '../messages'

interface Props {
  title: string
  id: string
  locale: Locale
  valueFrom: Date
  valueTo: Date
  isActive?: boolean
  onChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  initiallyExpanded?: boolean
  /** Maximum allowed span, in days, between valueFrom and valueTo. */
  maxRangeDays?: number
}

export const FilterDateAccordion = ({
  title,
  id,
  locale,
  valueFrom,
  valueTo,
  isActive,
  onChange,
  initiallyExpanded = false,
  maxRangeDays,
}: Props) => {
  const { formatMessage } = useIntl()

  const fromMinDate =
    maxRangeDays != null && valueTo ? subDays(valueTo, maxRangeDays) : undefined
  const toMaxDate =
    maxRangeDays != null && valueFrom
      ? addDays(valueFrom, maxRangeDays)
      : undefined

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
          labelColor={isActive ? 'blue400' : 'currentColor'}
          iconVariant="small"
          startExpanded={initiallyExpanded}
        >
          <Inline space={2}>
            <DatePicker
              name={`${id}-from`}
              backgroundColor="blue"
              label={formatMessage(m.search.dateFrom)}
              size="xs"
              locale={locale}
              selected={valueFrom}
              minDate={fromMinDate}
              maxDate={valueTo}
              handleChange={(date) => onChange(date, valueTo)}
            />
            <DatePicker
              name={`${id}-to`}
              backgroundColor="blue"
              label={formatMessage(m.search.dateTo)}
              size="xs"
              locale={locale}
              selected={valueTo}
              minDate={valueFrom}
              maxDate={toMaxDate}
              handleChange={(date) => onChange(valueFrom, date)}
            />
          </Inline>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
