import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import type { GetPersonalTaxCreditQuery } from '../PersonalTaxCredit.generated'

type TaxCards = NonNullable<
  NonNullable<GetPersonalTaxCreditQuery['socialInsurancePersonalTaxCredit']>['taxCards']
>

type PersonalTaxCreditTableProps = {
  taxCards: TaxCards
}

export const PersonalTaxCreditTable = ({
  taxCards,
}: PersonalTaxCreditTableProps) => {
  const { formatMessage, formatDate } = useLocale()

  return (
    <Box>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData box={{ background: 'blue100' }} scope="col">
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.type)}
              </Text>
            </T.HeadData>
            <T.HeadData box={{ background: 'blue100' }} scope="col">
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.dateFrom)}
              </Text>
            </T.HeadData>
            <T.HeadData box={{ background: 'blue100' }} scope="col">
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.dateTo)}
              </Text>
            </T.HeadData>
            <T.HeadData box={{ background: 'blue100' }} scope="col">
              <Text variant="medium" fontWeight="medium">
                {formatMessage(m.percentage)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {taxCards.map((card) => (
            <T.Row key={`${card.taxCardType}-${card.validFrom}`}>
              <T.Data>{card.taxCardType ?? '-'}</T.Data>
              <T.Data>
                {card.validFrom
                  ? formatDate(card.validFrom, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : '-'}
              </T.Data>
              <T.Data>
                {card.validTo
                  ? formatDate(card.validTo, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : '-'}
              </T.Data>
              <T.Data>{card.percentage != null ? `${card.percentage}%` : '-'}</T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
