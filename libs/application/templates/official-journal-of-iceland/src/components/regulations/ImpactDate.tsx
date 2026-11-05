/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ImpactDate.tsx
 *
 * Date picker for impact effective dates: the regulation's own effective date,
 * or a specific date.
 * Adapted to work with RegulationImpactSchema instead of DraftImpactForm.
 */
import {
  Box,
  DatePicker,
  RadioButton,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useEffect, useRef, useState } from 'react'
import parseISO from 'date-fns/parseISO'
import { toISODate } from '@island.is/regulations'
import { formatDate } from '../../utils/formatAmendingUtils'
import { parseLocalISODate, toLocalISODate } from '../../lib/utils'

// ---------------------------------------------------------------------------

export type ImpactDateProps = {
  date?: string // ISODate string
  /**
   * The regulation's effective date, when the impact can take it. Saved when
   * no specific date is picked.
   */
  defaultDate?: string // ISODate string
  /**
   * The regulation's effective date. Set without a defaultDate when it falls
   * before minDate, so the impact can't take it.
   */
  regulationEffectiveDate?: string // ISODate string
  size?: 'full' | 'half'
  minDate?: Date
  onChange: (newDate: Date | undefined) => void
  readOnly?: boolean
}

// The impact dates here are UTC midnight (new Date(isoDate)), which toISODate
// reads back as the same day. The date picker works in local midnight, so
// convert on the way in and out, or the day shifts outside UTC+0.
const toPickerDate = (date?: Date) =>
  date ? parseLocalISODate(toISODate(date)) : undefined

const fromPickerDate = (date: Date) => new Date(toLocalISODate(date))

/** A saved date is only a specific choice if it isn't the default */
const isCustomDate = (date?: string, defaultDate?: string) =>
  !!date && date.slice(0, 10) !== defaultDate

export const ImpactDate = (props: ImpactDateProps) => {
  const {
    date,
    defaultDate,
    regulationEffectiveDate,
    onChange,
    size = 'half',
    minDate,
    readOnly,
  } = props
  const [hasCustomDate, setHasCustomDate] = useState(
    isCustomDate(date, defaultDate),
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? new Date(date) : undefined,
  )

  // The default date can change while the modal is open, e.g. when the
  // regulation's scheduled changes load. Follow it until the user picks an
  // option, then keep their choice, which is what the modal saves.
  const userChoseRef = useRef(false)

  useEffect(() => {
    if (userChoseRef.current) return
    setHasCustomDate(isCustomDate(date, defaultDate))
    setSelectedDate(date ? new Date(date) : undefined)
  }, [date, defaultDate])

  // Scheduled changes can raise minDate past the picked date while the modal
  // is open. The modal then saves minDate, so show that instead.
  useEffect(() => {
    if (
      hasCustomDate &&
      selectedDate &&
      minDate &&
      toISODate(selectedDate) < toISODate(minDate)
    ) {
      setSelectedDate(minDate)
      onChange(minDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomDate, selectedDate, minDate])

  useEffect(() => {
    if (hasCustomDate && !selectedDate) {
      const initial = defaultDate ? new Date(defaultDate) : minDate
      if (initial) {
        setSelectedDate(initial)
        onChange(initial)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomDate, selectedDate, minDate, defaultDate])

  // Without a usable effective date, the earliest allowed date is saved
  const minDateLabel = minDate ? formatDate(minDate) : 'þegar í stað'
  const defaultLabel = defaultDate
    ? `Breyting tekur gildi á gildistökudegi reglugerðarinnar (${formatDate(
        parseISO(defaultDate),
      )})`
    : regulationEffectiveDate
    ? `Breyting tekur gildi ${minDateLabel}, sem er fyrsti mögulegi dagur. Gildistökudagur reglugerðarinnar (${formatDate(
        parseISO(regulationEffectiveDate.slice(0, 10)),
      )}) er of snemma fyrir þessa breytingu.`
    : `Breyting tekur gildi ${minDateLabel}. Gildistökudagur reglugerðarinnar hefur ekki verið valinn.`

  return (
    <Box marginBottom={4} width={size}>
      <Box marginBottom={3}>
        <GridRow rowGap={1}>
          <GridColumn span="1/1">
            <RadioButton
              name="set-no-custom-date"
              checked={!hasCustomDate}
              disabled={readOnly}
              onChange={() => {
                userChoseRef.current = true
                onChange(undefined)
                setHasCustomDate(false)
                setSelectedDate(undefined)
              }}
              backgroundColor="white"
              label={defaultLabel}
            />
          </GridColumn>
          <GridColumn span="1/1">
            <RadioButton
              name="select-custom-date"
              checked={hasCustomDate}
              disabled={readOnly}
              onChange={() => {
                userChoseRef.current = true
                setHasCustomDate(true)
              }}
              backgroundColor="white"
              label="Breyting tekur gildi á ákveðinni dagsetningu"
            />
          </GridColumn>
        </GridRow>
      </Box>
      {hasCustomDate ? (
        <DatePicker
          size="sm"
          locale="is"
          label="Gildistaka breytinga"
          placeholderText="Veldu dagsetningu"
          minDate={toPickerDate(minDate)}
          selected={toPickerDate(selectedDate)}
          handleChange={(pickedDate) => {
            userChoseRef.current = true
            const newDate = fromPickerDate(pickedDate)
            setSelectedDate(newDate)
            onChange(newDate)
          }}
          backgroundColor="blue"
          disabled={readOnly}
        />
      ) : undefined}
    </Box>
  )
}
