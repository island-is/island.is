import React, { FC } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import {
  ExpandRow,
  formSubmit,
  amountFormat,
} from '@island.is/service-portal/core'
import FinanceScheduleDetailTable from '../FinanceScheduleDetailTable/FinanceScheduleDetailTable'
import { DetailedSchedule, PaymentSchedule } from '@island.is/api/schema'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

const GET_FINANCE_PAYMENT_SCHEDULE_BY_ID = gql`
  query getPaymentScheduleByIdQuery($input: GetFinancePaymentScheduleInput!) {
    getPaymentScheduleById(input: $input) {
      myDetailedSchedules {
        myDetailedSchedule {
          paidDate
          paidAmount
          paidAmountAccumulated
          paymentNumber
          payments {
            payAmount
            payAmountAccumulated
            payDate
            payExplanation
          }
          plannedAmount
          plannedAmountAccumulated
          plannedDate
        }
      }
    }
  }
`

interface Props {
  paymentSchedule: PaymentSchedule
}

const FinanceScheduleTableRow: FC<Props> = ({ paymentSchedule }) => {
  const [
    getPaymentScheduleById,
    { loading, error, ...detailsQuery },
  ] = useLazyQuery(GET_FINANCE_PAYMENT_SCHEDULE_BY_ID)
  useNamespaces('sp.finance-schedule')
  const { formatMessage } = useLocale()

  const paymentDetailData: Array<DetailedSchedule> =
    detailsQuery?.data?.getPaymentScheduleById.myDetailedSchedules
      .myDetailedSchedule || []

  const getType = (type: string) => {
    switch (type) {
      case 'S':
        return formatMessage({
          id: 'sp.finance-schedule:status-valid',
          defaultMessage: 'Í gildi',
        })
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
    <ExpandRow
      key={paymentSchedule.scheduleNumber}
      onExpandCallback={() =>
        getPaymentScheduleById({
          variables: {
            input: { scheduleNumber: paymentSchedule.scheduleNumber },
          },
        })
      }
      data={[
        { value: paymentSchedule.approvalDate },
        { value: paymentSchedule.scheduleName },
        { value: amountFormat(paymentSchedule.totalAmount) },
        { value: amountFormat(paymentSchedule.unpaidAmount) },
        {
          value: `${paymentSchedule.unpaidCount} af ${paymentSchedule.paymentCount}`,
        },
        { value: getType(paymentSchedule.scheduleStatus) },
        {
          value: (
            <Box display="flex" flexDirection="row" alignItems="center">
              <Button
                size="small"
                variant="text"
                icon="document"
                iconType="outline"
                disabled={paymentSchedule.documentID ? false : true}
                onClick={() =>
                  formSubmit(`${paymentSchedule.downloadServiceURL}`)
                }
              >
                PDF
              </Button>
            </Box>
          ),
          align: 'right',
        },
      ]}
      loading={loading}
    >
      {!loading && !error && (
        <FinanceScheduleDetailTable data={paymentDetailData} />
      )}
    </ExpandRow>
  )
}

export default FinanceScheduleTableRow
