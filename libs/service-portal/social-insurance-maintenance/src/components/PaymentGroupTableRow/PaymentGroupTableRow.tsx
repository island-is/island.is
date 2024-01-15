import {
  ExpandRow,
  ScrollableMiddleTable,
  amountFormat,
} from '@island.is/service-portal/core'
import { MONTHS } from '../../lib/constants'
import { SocialInsurancePaymentGroup } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { m as coreMessages } from '@island.is/service-portal/core'

type Props = {
  data: SocialInsurancePaymentGroup
  formatMessage: FormatMessage
  onScroll?: (scrollPos: number) => void
  scrollPos?: number
}

export const PaymentGroupTableRow = ({
  data,
  formatMessage,
  onScroll,
  scrollPos,
}: Props) => (
  <ExpandRow
    data={[
      { value: formatMessage(data.type) },
      { value: amountFormat(data.totalYearCumulativeAmount) },
    ]}
  >
    <ScrollableMiddleTable
      nested
      header={{
        first: formatMessage(coreMessages.transactionType),
        scrollableMiddle: MONTHS.map((month) =>
          formatMessage(coreMessages[month as keyof typeof coreMessages]),
        ),
        last: formatMessage(coreMessages.theYear),
      }}
      footer={{
        first: formatMessage(coreMessages.transactionType),
        scrollableMiddle: MONTHS.map((month) =>
          formatMessage(coreMessages[month as keyof typeof coreMessages]),
        ),
        last: formatMessage(coreMessages.theYear),
      }}
      rows={data.payments.map((p) => ({
        first: p.type,
        scrollableMiddle: MONTHS.map((month) => {
          const monthlyAmount = p.monthlyPaymentHistory.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: amountFormat(p.totalYearCumulativeAmount),
      }))}
      onScroll={onScroll}
      scrollPos={scrollPos}
    />
  </ExpandRow>
)
