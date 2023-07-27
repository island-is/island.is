import { Box, Button, DatePicker } from '@island.is/island-ui/core'
import { impactMsgs } from '../../lib/messages'
import { DraftImpactForm } from '../../state/types'
import { useLocale } from '@island.is/localization'

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

  const date = impact.date

  const t = useLocale().formatMessage

  return (
    <Box marginBottom={4} width={size}>
      <DatePicker
        size="sm"
        locale="is"
        label={t(impactMsgs.effectiveDate)}
        placeholderText={t(impactMsgs.effectiveDate_default)}
        minDate={minDate ?? date.min}
        maxDate={date.max}
        selected={date.value || minDate}
        handleChange={onChange}
        hasError={!!date.error}
        errorMessage={date.error && t(date.error)}
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
    </Box>
  )
}
