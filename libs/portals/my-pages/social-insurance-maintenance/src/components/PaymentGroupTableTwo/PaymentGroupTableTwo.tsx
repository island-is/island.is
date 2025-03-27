import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  MONTHS,
  ScrollableMiddleTableTwo,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import {
  ScrollableMiddleTable,
  amountFormat,
} from '@island.is/portals/my-pages/core'
import { useGetPaymentPlanQuery } from '../PaymentGroupTable/PaymentGroupTable.generated'

export const PaymentGroupTableTwo = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPaymentPlanQuery()

  if (error && !loading) {
    return <Problem noBorder={false} size="small" />
  }

  const paymentPlan = data?.socialInsurancePaymentPlan

  if (!paymentPlan) {
    return
  }

  return (
    <ScrollableMiddleTableTwo
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
        first: formatMessage(coreMessages.transactionType),
        scrollableMiddle: MONTHS.map((month) =>
          formatMessage(coreMessages[month as keyof typeof coreMessages]),
        ),
        last: formatMessage(coreMessages.theYear),
      }}
      footer={{
        first: formatMessage(coreMessages.total),
        scrollableMiddle: MONTHS.map((month) => {
          const monthlyAmount = paymentPlan.totalMonthlyPaymentHistory?.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month),
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: paymentPlan.totalPaymentsReceived
          ? amountFormat(paymentPlan.totalPaymentsReceived)
          : '-',
      }}
      rows={paymentPlan.paymentGroups?.map((p) => ({
        first: p.name,
        scrollableMiddle: MONTHS.map((month) => {
          const monthlyAmount = p.monthlyPaymentHistory.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: `${amountFormat(p.totalYearCumulativeAmount)}`,
      }))}
    />
  )
}
