import React from 'react'
import { Box, Button, DatePicker } from '@island.is/island-ui/core'
import { impactMsgs } from '../../messages'
import { DraftImpactForm } from '../../state/types'
import { useLocale } from '@island.is/localization'

const today = new Date()

// ---------------------------------------------------------------------------

export type ImpactDateProps = {
  impact: DraftImpactForm
  onChange: (newValue: Date | undefined) => void
}

export const ImpactDate = (props: ImpactDateProps) => {
  const { impact, onChange } = props

  const date = impact.date

  const t = useLocale().formatMessage

  return (
    <Box marginBottom={4} width="half">
      <DatePicker
        size="sm"
        locale="is"
        label={t(impactMsgs.effectiveDate)}
        placeholderText={t(impactMsgs.effectiveDate_default)}
        minDate={date.min || today}
        maxDate={date.max}
        selected={date.value || today}
        handleChange={onChange}
        hasError={!!date.error}
        errorMessage={date.error && t(date.error)}
        backgroundColor="blue"
      />
      {!!date.value && (
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
