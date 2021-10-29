import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React from 'react'
import { employer, error } from '../../lib/messages'

export const EmployerIdField = ({ application, errors }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

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
      />
    </Box>
  )
}
