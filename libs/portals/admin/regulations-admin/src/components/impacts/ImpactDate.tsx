import {
  Box,
  Button,
  DatePicker,
  Checkbox,
  Text,
  RadioButton,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { impactMsgs } from '../../lib/messages'
import { DraftImpactForm } from '../../state/types'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { MessageDescriptor } from 'react-intl'

// ---------------------------------------------------------------------------

export type ImpactDateProps = {
  impact: DraftImpactForm
  size?: 'full' | 'half'
  minDate?: Date
  onChange: (newValue: Date | undefined) => void
  readOnly?: boolean
}

export const ImpactDate = (props: ImpactDateProps) => {
  const { impact, onChange, size = 'half', minDate, readOnly } = props
  const [hasCustomDate, setHasCustomDate] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [errorMessage, setErrorMessage] = useState<MessageDescriptor>()
  const date = impact.date

  useEffect(() => {
    if (hasCustomDate) {
      setSelectedDate(date.value || minDate)
    }
  }, [hasCustomDate, date.value, minDate])

  useEffect(() => {
    setErrorMessage(date.error)
  }, [impact.date])

  const t = useLocale().formatMessage

  return (
    <Box marginBottom={4} width={size}>
      <Box marginBottom={3}>
        <GridRow rowGap={1}>
          <GridColumn span="1/1">
            <RadioButton
              name={`set-no-custom-date`}
              checked={!hasCustomDate}
              onChange={() => {
                onChange(undefined)
                setHasCustomDate(false)
              }}
              backgroundColor="white"
              label={t(impactMsgs.specificDateApplyTextDetails)}
            />
          </GridColumn>
          <GridColumn span="1/1">
            <RadioButton
              name={`select-custom-date`}
              checked={hasCustomDate}
              onChange={() => {
                setHasCustomDate(true)
              }}
              backgroundColor="white"
              label={t(impactMsgs.specificDateApply)}
            />
          </GridColumn>
        </GridRow>
      </Box>
      {hasCustomDate ? (
        <>
          <DatePicker
            size="sm"
            locale="is"
            label={t(impactMsgs.effectiveDate)}
            placeholderText={t(impactMsgs.effectiveDate_default)}
            minDate={minDate ?? date.min}
            maxDate={date.max}
            selected={selectedDate}
            handleChange={onChange}
            hasError={!!errorMessage}
            errorMessage={errorMessage && t(errorMessage)}
            backgroundColor="blue"
            disabled={readOnly}
          />
          {!readOnly && !!date.value && (
            <Button
              size="small"
              variant="text"
              preTextIcon="close"
              onClick={() => {
                onChange(undefined)
                setHasCustomDate(false)
              }}
            >
              {t(impactMsgs.effectiveDate_default)}
            </Button>
          )}
        </>
      ) : undefined}
    </Box>
  )
}
