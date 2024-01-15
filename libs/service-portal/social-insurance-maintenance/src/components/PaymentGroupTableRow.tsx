import { Table } from '@island.is/island-ui/core'
import { ExpandRow, amountFormat } from '@island.is/service-portal/core'
import { MONTHS } from '../lib/constants'
import { SocialInsurancePaymentGroup } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { m as coreMessages } from '@island.is/service-portal/core'
type Props = {
  data: SocialInsurancePaymentGroup
  formatMessage: FormatMessage
}

export const PaymentGroupTableRow = ({ data, formatMessage }: Props) => (
  <ExpandRow
    data={[
      { value: formatMessage(data.type) },
      { value: amountFormat(data.totalYearCumulativeAmount) },
    ]}
  >
    <Table.Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadData>
            {formatMessage(coreMessages.transactionType)}
          </Table.HeadData>
          {MONTHS.map((month) => (
            <Table.HeadData>
              {formatMessage(coreMessages[month as keyof typeof coreMessages])}
            </Table.HeadData>
          ))}
          <Table.HeadData>{formatMessage(coreMessages.theYear)}</Table.HeadData>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.payments.map((p) => (
          <Table.Row>
            <Table.Data>{p.type}</Table.Data>
            {MONTHS.map((month) => {
              const monthlyAmount = p.monthlyPaymentHistory.find(
                (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
              )?.amount

              return (
                <Table.Data>
                  {monthlyAmount ? amountFormat(monthlyAmount) : '-'}
                </Table.Data>
              )
            })}
            <Table.Data>{amountFormat(p.totalYearCumulativeAmount)}</Table.Data>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Table>
  </ExpandRow>
)
