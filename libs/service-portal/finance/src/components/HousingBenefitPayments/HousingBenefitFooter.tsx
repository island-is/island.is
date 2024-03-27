import { Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, amountFormat, tableStyles } from '@island.is/service-portal/core'
import { m as messages } from '../../lib/messages'
import { HousingBenefitPayment } from '@island.is/api/schema'
import sumBy from 'lodash/sumBy'

interface Props {
  paymentArray: HousingBenefitPayment[]
}

const myKeys = [
  'paymentBeforeDebt',
  'paidOfDebt',
  'paymentActual',
  'remainDebt',
]

export const getTotalFooter = (paymentArray: Props['paymentArray']) => {
  return myKeys.map((item) =>
    sumBy(paymentArray, (o) => o[item as keyof HousingBenefitPayment] ?? 0),
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
            <T.Data
              key={myKeys[i]}
              style={tableStyles}
              box={
                i + 1 === totalFooter.length
                  ? { textAlign: 'right' }
                  : undefined
              }
              borderColor="white"
            >
              <Text fontWeight="semiBold">{amountFormat(item)}</Text>
            </T.Data>
          )
        })}
      </T.Row>
    </T.Foot>
  )
}
