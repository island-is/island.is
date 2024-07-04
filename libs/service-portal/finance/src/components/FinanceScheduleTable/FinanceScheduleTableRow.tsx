import {
  ExpandRow,
  formSubmit,
  amountFormat,
} from '@island.is/service-portal/core'
import FinanceScheduleDetailTable from '../FinanceScheduleDetailTable/FinanceScheduleDetailTable'
import { DetailedSchedule } from '@island.is/api/schema'
import { m as messages } from '../../lib/messages'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useGetPaymentScheduleByIdLazyQuery } from './FinanceScheduleTable.generated'
import { PaymentSchedule } from '@island.is/service-portal/graphql'

interface Props {
  paymentSchedule: PaymentSchedule
}

const FinanceScheduleTableRow = ({ paymentSchedule }: Props) => {
  const [getPaymentScheduleById, { loading, error, ...detailsQuery }] =
    useGetPaymentScheduleByIdLazyQuery()
  useNamespaces('sp.finance-schedule')
  const { formatMessage } = useLocale()

  const paymentDetailData: Array<DetailedSchedule> =
    detailsQuery?.data?.getPaymentScheduleById.myDetailedSchedules
      .myDetailedSchedule || []

  const getType = (type: string) => {
    switch (type) {
      case 'S':
        return formatMessage(messages.financeStatusValid)
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
      backgroundColor="white"
      showLine={false}
      extraChildrenPadding
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
        {
          value: amountFormat(paymentSchedule.totalAmount),
          align: 'right',
        },
        {
          value: amountFormat(paymentSchedule.unpaidAmount),
          align: 'right',
        },
        {
          value: amountFormat(paymentSchedule.unpaidWithInterest),
          align: 'right',
        },

        { value: getType(paymentSchedule.scheduleStatus) },
        {
          value: paymentSchedule.documentID ? (
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
          ),
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
