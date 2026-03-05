/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ImpactDate.tsx
 *
 * Date picker for impact effective dates, with option for immediate or specific date.
 * Adapted to work with RegulationImpactSchema instead of DraftImpactForm.
 */
import {
  Box,
  Button,
  DatePicker,
  RadioButton,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { regulation } from '../../lib/messages'

// ---------------------------------------------------------------------------

export type ImpactDateProps = {
  date?: string // ISODate string
  size?: 'full' | 'half'
  minDate?: Date
  onChange: (newDate: Date | undefined) => void
  readOnly?: boolean
}

export const ImpactDate = (props: ImpactDateProps) => {
  const { date, onChange, size = 'half', minDate, readOnly } = props
  const [hasCustomDate, setHasCustomDate] = useState(!!date)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? new Date(date) : undefined,
  )

  const { formatMessage: f } = useLocale()

  useEffect(() => {
    if (hasCustomDate && !selectedDate && minDate) {
      setSelectedDate(minDate)
    }
  }, [hasCustomDate, selectedDate, minDate])

  return (
    <Box marginBottom={4} width={size}>
      <Box marginBottom={3}>
        <GridRow rowGap={1}>
          <GridColumn span="1/1">
            <RadioButton
              name="set-no-custom-date"
              checked={!hasCustomDate}
              onChange={() => {
                onChange(undefined)
                setHasCustomDate(false)
                setSelectedDate(undefined)
              }}
              backgroundColor="white"
              label="Breyting tekur gildi þegar í stað, daginn eftir útgáfudag."
            />
          </GridColumn>
          <GridColumn span="1/1">
            <RadioButton
              name="select-custom-date"
              checked={hasCustomDate}
              onChange={() => {
                setHasCustomDate(true)
              }}
              backgroundColor="white"
              label="Breyting tekur gildi á ákveðinni dagsetningu"
            />
          </GridColumn>
        </GridRow>
      </Box>
      {hasCustomDate ? (
        <>
          <DatePicker
            size="sm"
            locale="is"
            label="Gildistaka breytinga"
            placeholderText="Tekur þegar gildi"
            minDate={minDate}
            selected={selectedDate}
            handleChange={(newDate) => {
              setSelectedDate(newDate)
              onChange(newDate)
            }}
            backgroundColor="blue"
            disabled={readOnly}
          />
          {!readOnly && selectedDate && (
            <Button
              size="small"
              variant="text"
              preTextIcon="close"
              onClick={() => {
                onChange(undefined)
                setHasCustomDate(false)
                setSelectedDate(undefined)
              }}
            >
              Tekur þegar gildi
            </Button>
          )}
        </>
      ) : undefined}
    </Box>
  )
}
