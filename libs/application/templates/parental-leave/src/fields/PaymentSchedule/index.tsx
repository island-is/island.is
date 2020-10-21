import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

const PaymentSchedule: FC<FieldBaseProps> = ({ error, field, application }) => {
  const { description } = field
  const { formatMessage } = useLocale()

  return (
    <Box>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginTop={3}>The payment table will appear here</Box>
    </Box>
  )
}

export default PaymentSchedule
