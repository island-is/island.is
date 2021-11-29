import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React, { useState } from 'react'
import { employer, error } from '../../lib/messages'
import { PublicDebtPaymentPlan } from '../../types'

export const EmployerIdField = ({ application, errors }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as PublicDebtPaymentPlan
  const [nationalId, setNationalId] = useState<string>(
    answers.employer?.correctedNationalId?.id || '',
  )

  return (
    <Box marginTop={5}>
      <InputController
        id="employer.correctedNationalId.id"
        name="employer.correctedNationalId.id"
        label={formatText(
          employer.labels.employerNationalId,
          application,
          formatMessage,
        )}
        placeholder={formatText(
          employer.labels.employerNationalIdPlaceholder,
          application,
          formatMessage,
        )}
        error={
          errors &&
          getErrorViaPath(errors, 'employer.correctedNationalId') &&
          formatMessage(error.nationalId)
        }
        backgroundColor="blue"
        required
        format="######-####"
        defaultValue={nationalId}
        onChange={(value) => setNationalId(value.target.value)}
      />
    </Box>
  )
}
