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
import { formatDate } from '../../utils/formatAmendingUtils'

// ---------------------------------------------------------------------------

export type ImpactDateProps = {
  date?: string // ISODate string
  /**
   * The regulation's effective date, when the impact can take it. Saved when
   * no specific date is picked.
   */
  defaultDate?: string // ISODate string
  size?: 'full' | 'half'
  minDate?: Date
  onChange: (newDate: Date | undefined) => void
  readOnly?: boolean
}

/** A saved date is only a specific choice if it isn't the default */
const isCustomDate = (date?: string, defaultDate?: string) =>
  !!date && date.slice(0, 10) !== defaultDate

export const ImpactDate = (props: ImpactDateProps) => {
  const {
    date,
    defaultDate,
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

  useEffect(() => {
    if (hasCustomDate && !selectedDate) {
      const initial = defaultDate ? parseISO(defaultDate) : minDate
      if (initial) {
        setSelectedDate(initial)
        onChange(initial)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomDate, selectedDate, minDate, defaultDate])

  // Without an effective date, the earliest allowed date is saved
  const defaultLabel = defaultDate
    ? `Breyting tekur gildi á gildistökudegi reglugerðarinnar (${formatDate(
        parseISO(defaultDate),
      )})`
    : `Breyting tekur gildi ${
        minDate ? formatDate(minDate) : 'þegar í stað'
      }. Gildistökudagur reglugerðarinnar hefur ekki verið valinn.`

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
          minDate={minDate}
          selected={selectedDate}
          handleChange={(newDate) => {
            userChoseRef.current = true
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
