import {
  ExpandRow,
  MONTHS,
  ScrollableMiddleTable,
  amountFormat,
} from '@island.is/portals/my-pages/core'
import { SocialInsurancePaymentGroup } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/my-pages/core'

type Props = {
  data: SocialInsurancePaymentGroup
  formatMessage: FormatMessage
}

export const PaymentGroupTableRow = ({ data, formatMessage }: Props) => (
  <ExpandRow
    data={[
      { value: formatMessage(data.name) },
      { value: amountFormat(data.totalYearCumulativeAmount) },
    ]}
  >
    <ScrollableMiddleTable
      nested
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
          const monthlyAmount = data.monthlyPaymentHistory.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: data.totalYearCumulativeAmount
          ? amountFormat(data.totalYearCumulativeAmount)
          : '-',
      }}
      rows={data.payments.map((p) => ({
        first: p.name,
        scrollableMiddle: MONTHS.map((month) => {
          const monthlyAmount = p.monthlyPaymentHistory.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: amountFormat(p.totalYearCumulativeAmount),
      }))}
    />
  </ExpandRow>
)
