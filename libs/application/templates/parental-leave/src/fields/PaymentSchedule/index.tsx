import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import PaymentsTable from './PaymentsTable'
import { useQuery } from '@apollo/client'
import { getExpectedDateOfBirthOrAdoptionDate } from '../../lib/parentalLeaveUtils'
import { getEstimatedPayments } from './estimatedPaymentsQuery'

import * as styles from './PaymentSchedule.css'

const PaymentSchedule: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { description } = field
  const { formatMessage } = useLocale()

  const dob = getExpectedDateOfBirthOrAdoptionDate(application)

  const { data, error, loading } = useQuery(getEstimatedPayments, {
    variables: {
      input: {
        dateOfBirth: dob,
        period: [
          {
            from: '2021-01-01',
            to: '2021-01-01',
            ratio: 100,
            approved: true,
            paid: true,
          },
        ],
      },
    },
  })

  return (
    <Box>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}
      {!loading && !error && (
        <Box marginY={3} className={styles.tableContainer}>
          <PaymentsTable
            application={application}
            payments={data.getParentalLeavesEstimatedPaymentPlan}
          />
        </Box>
      )}
    </Box>
  )
}

export default PaymentSchedule
