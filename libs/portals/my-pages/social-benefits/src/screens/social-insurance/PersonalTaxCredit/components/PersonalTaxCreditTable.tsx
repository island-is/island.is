import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import type { GetPersonalTaxCreditQuery } from '../PersonalTaxCredit.generated'
import { Fragment, ReactNode } from 'react'
import AnimateHeight from 'react-animate-height'

type TaxCards = NonNullable<
  NonNullable<
    GetPersonalTaxCreditQuery['socialInsurancePersonalTaxCredit']
  >['taxCards']
>

type PersonalTaxCreditTableProps = {
  taxCards: TaxCards
  onEdit?: () => void
  inlineContent?: ReactNode
}

const taxCardTypeMessageMap: Record<string, typeof m[keyof typeof m]> = {
  PERSONAL_TAX_ALLOWANCE: m.taxCardTypePersonalTaxAllowance,
  SPOUSE_TAX_ALLOWANCE: m.taxCardTypeSpouseTaxAllowance,
  REGARDING_THE_ESTATE: m.taxCardTypeRegardingTheEstate,
  TAX_EXEMPTION: m.taxCardTypeTaxExemption,
  UNKNOWN_TAX_CARD: m.taxCardTypeUnknown,
}

// Returns the index of the "active" own card: no validTo wins, otherwise latest validTo
const getActiveOwnCardIndex = (
  taxCards: PersonalTaxCreditTableProps['taxCards'],
): number | null =>
  taxCards.reduce<number | null>((activeIdx, card, index) => {
    if (card.type !== 'PERSONAL_TAX_ALLOWANCE') return activeIdx
    if (activeIdx === null) return index
    const activeCard = taxCards[activeIdx]
    if (!card.validTo) return index
    if (!activeCard.validTo) return activeIdx
    return card.validTo > activeCard.validTo ? index : activeIdx
  }, null)

export const PersonalTaxCreditTable = ({
  taxCards,
  onEdit,
  inlineContent,
}: PersonalTaxCreditTableProps) => {
  const { formatMessage, formatDate } = useLocale()
  const activeOwnCardIndex = getActiveOwnCardIndex(taxCards)

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
            {onEdit && <T.HeadData box={{ background: 'blue100' }} scope="col" />}
          </T.Row>
        </T.Head>
        <T.Body>
          {taxCards.map((card, index) => {
            const showEdit = index === activeOwnCardIndex
            const showInline = !!inlineContent && showEdit
            return (
              <Fragment
                key={`${card.type ?? ''}-${card.validFrom ?? ''}-${index}`}
              >
                <T.Row>
                  <T.Data
                    box={{
                      background: showInline ? 'blue100' : undefined,
                      borderColor: showInline ? 'blue100' : 'blue200',
                    }}
                  >
                    {card.type && taxCardTypeMessageMap[card.type]
                      ? formatMessage(taxCardTypeMessageMap[card.type])
                      : '-'}
                  </T.Data>
                  <T.Data
                    box={{
                      background: showInline ? 'blue100' : undefined,
                      borderColor: showInline ? 'blue100' : 'blue200',
                    }}
                  >
                    {card.validFrom
                      ? formatDate(card.validFrom, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                      : '-'}
                  </T.Data>
                  <T.Data
                    box={{
                      background: showInline ? 'blue100' : undefined,
                      borderColor: showInline ? 'blue100' : 'blue200',
                    }}
                  >
                    {card.validTo
                      ? formatDate(card.validTo, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                      : '-'}
                  </T.Data>
                  <T.Data
                    box={{
                      background: showInline ? 'blue100' : undefined,
                      borderColor: showInline ? 'blue100' : 'blue200',
                    }}
                  >
                    {card.percentage != null ? `${card.percentage}%` : '-'}
                  </T.Data>
                  {onEdit && (
                    <T.Data
                      box={{
                        background: showInline ? 'blue100' : undefined,
                        borderColor: showInline ? 'blue100' : 'blue200',
                      }}
                    >
                      {showEdit && (
                        <Button
                          variant="text"
                          size="small"
                          icon="pencil"
                          iconType="outline"
                          onClick={onEdit}
                        >
                          {formatMessage(m.edit)}
                        </Button>
                      )}
                    </T.Data>
                  )}
                </T.Row>
                <T.Row>
                  <T.Data
                    colSpan={onEdit ? 5 : 4}
                    style={{ padding: 0, width: '100%' }}
                    borderColor={showInline ? 'blue200' : 'blue100'}
                  >
                    <AnimateHeight duration={300} height={showInline ? 'auto' : 0}>
                      {inlineContent}
                    </AnimateHeight>
                  </T.Data>
                </T.Row>
              </Fragment>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}
