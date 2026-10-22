import { useIntl } from 'react-intl'
import addDays from 'date-fns/addDays'

import {
  Accordion,
  AccordionItem,
  Box,
  DatePicker,
  Inline,
  Text,
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
  /** Latest date selectable in either picker, typically today. */
  maxSelectableDate?: Date
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
  maxSelectableDate,
}: Props) => {
  const { formatMessage } = useIntl()

  /* The two pickers may land on the same day — an empty span is allowed. */
  const latestAllowedTo = (from: Date) => {
    const rangeEnd =
      maxRangeDays != null ? addDays(from, maxRangeDays) : undefined
    if (!rangeEnd) return maxSelectableDate
    if (!maxSelectableDate) return rangeEnd
    return rangeEnd < maxSelectableDate ? rangeEnd : maxSelectableDate
  }

  const toMaxDate = valueFrom ? latestAllowedTo(valueFrom) : maxSelectableDate

  /*
    The "from" picker is bounded only by maxSelectableDate — the picked date is
    always kept. It is "to" that follows: forward to meet "from" when it would
    otherwise end up behind it, and back to the end of the allowed range when
    the span grew too wide.
  */
  const handleFromChange = (date: Date | undefined) => {
    if (!date || !valueTo) {
      onChange(date, valueTo)
      return
    }

    const latestTo = latestAllowedTo(date)
    let nextTo = valueTo

    if (nextTo < date) {
      nextTo = date
    } else if (latestTo && nextTo > latestTo) {
      nextTo = latestTo
    }

    onChange(date, nextTo)
  }

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
              placeholderText=""
              size="xs"
              locale={locale}
              selected={valueFrom}
              maxDate={maxSelectableDate}
              handleChange={handleFromChange}
            />
            <DatePicker
              name={`${id}-to`}
              backgroundColor="blue"
              placeholderText=""
              label={formatMessage(m.search.dateTo)}
              size="xs"
              locale={locale}
              selected={valueTo}
              minDate={valueFrom}
              maxDate={toMaxDate}
              handleChange={(date) => onChange(valueFrom, date)}
            />
          </Inline>
          {maxRangeDays != null && (
            <Box paddingTop={1}>
              <Text variant="small">
                {formatMessage(m.search.maxDateSpan, { days: maxRangeDays })}
              </Text>
            </Box>
          )}
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
