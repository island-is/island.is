import { Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, amountFormat, tableStyles } from '@island.is/service-portal/core'
import { m as messages } from '../../lib/messages'
import { HousingBenefitsPayment } from '@island.is/api/schema'
import sumBy from 'lodash/sumBy'

interface Props {
  paymentArray: HousingBenefitsPayment[]
}

const sumKeys = ['paymentBeforeDebt', 'paidOfDebt', 'paymentActual']

export const getTotalFooter = (paymentArray: Props['paymentArray']) => {
  return sumKeys.map((item) =>
    sumBy(paymentArray, (o) => o[item as keyof HousingBenefitsPayment] ?? 0),
  )
}

export const HousingBenefitsFooter = ({ paymentArray }: Props) => {
  const { formatMessage } = useLocale()
  const totalFooter = getTotalFooter(paymentArray) ?? []
  return (
    <T.Foot>
      <T.Row>
        <T.Data style={tableStyles} borderColor="white" colSpan={3}>
          <Text fontWeight="semiBold">{formatMessage(m.total)}</Text>
        </T.Data>
        {totalFooter.map((item, i) => {
          return (
            <T.Data key={sumKeys[i]} style={tableStyles} borderColor="white">
              <Text fontWeight="semiBold">{amountFormat(item)}</Text>
            </T.Data>
          )
        })}
      </T.Row>
    </T.Foot>
  )
}
