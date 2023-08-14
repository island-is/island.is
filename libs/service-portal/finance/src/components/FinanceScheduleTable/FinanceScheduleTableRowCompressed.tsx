import React, { FC } from 'react'
import { formSubmit, amountFormat } from '@island.is/service-portal/core'
import { PaymentSchedule } from '@island.is/api/schema'
import { Box, Table as T, Text, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'

interface Props {
  paymentSchedule: PaymentSchedule
}

const FinanceScheduleTableRow: FC<React.PropsWithChildren<Props>> = ({
  paymentSchedule,
}) => {
  useNamespaces('sp.finance-schedule')
  const { formatMessage } = useLocale()

  const getType = (type: string) => {
    switch (type) {
      case 'S':
        return formatMessage(m.financeStatusValid)
      case 'E':
        return formatMessage({
          id: 'sp.finance-schedule:status-invalid',
          defaultMessage: 'Ógild',
        })
      case 'L':
        return formatMessage({
          id: 'sp.finance-schedule:status-closed',
          defaultMessage: 'Lokið',
        })
      default:
        return formatMessage({
          id: 'sp.finance-schedule:status-empty',
          defaultMessage: 'Engin staða',
        })
    }
  }

  return (
    <T.Row>
      <T.Data>
        <Text variant="medium" as="span">
          {paymentSchedule.approvalDate || ''}
        </Text>
      </T.Data>
      <T.Data>
        <Text variant="medium" as="span">
          {paymentSchedule.scheduleName || ''}
        </Text>
      </T.Data>
      <T.Data>
        <Text variant="medium" as="span">
          {paymentSchedule.totalAmount
            ? amountFormat(paymentSchedule.totalAmount)
            : ''}
        </Text>
      </T.Data>
      <T.Data>
        <Text variant="medium" as="span">
          {paymentSchedule.unpaidAmount
            ? amountFormat(paymentSchedule.unpaidAmount)
            : ''}
        </Text>
      </T.Data>
      <T.Data>
        <Text variant="medium" as="span">
          {getType(paymentSchedule.scheduleStatus)}
        </Text>
      </T.Data>
      <T.Data>
        <Text variant="medium" as="span">
          {paymentSchedule.documentID ? (
            <Box display="flex" flexDirection="row" alignItems="center">
              <Button
                size="small"
                variant="text"
                icon="document"
                iconType="outline"
                onClick={() =>
                  formSubmit(`${paymentSchedule.downloadServiceURL}`)
                }
              >
                PDF
              </Button>
            </Box>
          ) : (
            ''
          )}
        </Text>
      </T.Data>
    </T.Row>
  )
}

export default FinanceScheduleTableRow
