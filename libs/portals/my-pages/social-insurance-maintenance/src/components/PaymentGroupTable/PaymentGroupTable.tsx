import {
  ScrollableMiddleTable,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  EmptyTable,
  MONTHS,
  amountFormat,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { useGetPaymentPlanQuery } from '../PaymentGroupTable/PaymentGroupTable.generated'

export const PaymentGroupTable = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPaymentPlanQuery()

  if (error && !loading) {
    return <Problem noBorder={false} size="small" />
  }

  const paymentPlan = data?.socialInsurancePaymentPlan

  if (!error && !paymentPlan) {
    return (
      <EmptyTable
        loading={loading}
        message={formatMessage(m.noPaymentsFound)}
      />
    )
  }

  return (
    <ScrollableMiddleTable
      options={{
        firstColumn: {
          shadow: true,
          sticky: true,
        },
        lastColumn: {
          shadow: true,
          sticky: true,
        },
      }}
      header={{
        first: formatMessage(m.type),
        scrollableMiddle: MONTHS.map((month) =>
          formatMessage(coreMessages[month as keyof typeof coreMessages]),
        ),
        last: formatMessage(m.year),
      }}
      rows={paymentPlan?.paymentGroups?.map((p) => ({
        first: p.name,
        scrollableMiddle: MONTHS.map((month) => {
          const monthlyAmount = p.monthlyPaymentHistory.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: `${amountFormat(p.totalYearCumulativeAmount)}`,
      }))}
      footer={{
        first: formatMessage(m.totalPaymentsReceived),
        scrollableMiddle: MONTHS.map((month) => {
          const monthlyAmount = paymentPlan?.totalMonthlyPaymentHistory?.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month),
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: paymentPlan?.totalPaymentsReceived
          ? amountFormat(paymentPlan?.totalPaymentsReceived)
          : '-',
      }}
    />
  )
}
