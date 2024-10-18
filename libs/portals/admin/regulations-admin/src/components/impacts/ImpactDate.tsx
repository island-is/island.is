import { Box, Button, DatePicker, Checkbox } from '@island.is/island-ui/core'
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
        <Checkbox
          label={t(impactMsgs.specificDateApply)}
          labelVariant="default"
          checked={hasCustomDate}
          onChange={() => setHasCustomDate(!hasCustomDate)}
        />
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
              onClick={() => onChange(undefined)}
            >
              {t(impactMsgs.effectiveDate_default)}
            </Button>
          )}
        </>
      ) : undefined}
    </Box>
  )
}
