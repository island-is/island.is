import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import PaymentsTable from './PaymentsTable'

const PaymentSchedule: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { formatMessage } = useLocale()

  return (
    <Box>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginY={3}>
        <PaymentsTable application={application} />
      </Box>
    </Box>
  )
}

export default PaymentSchedule
