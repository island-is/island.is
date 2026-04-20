import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { ExternalData, FormText, FormValue } from '@island.is/application/types'
import { overview as overviewMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  getPrivatePensionString,
  getPensionString,
  getUnionString,
} from '../stringMappers'

export const usePayoutAnswers = (
  answers: FormValue,
  externalData: ExternalData,
): Array<FormText> => {
  const { formatMessage } = useLocale()
  const bankAccountNumber =
    getValueViaPath<string>(answers, 'payout.bankAccount.accountNumber') ?? ''

  const bankNumber =
    getValueViaPath<string>(answers, 'payout.bankAccount.bankNumber') ?? ''

  const ledger =
    getValueViaPath<string>(answers, 'payout.bankAccount.ledger') ?? ''

  const payToUnion = getValueViaPath<YesOrNo>(answers, 'payout.payToUnion')
  const union = getUnionString(
    getValueViaPath<string>(answers, 'payout.union', '') ?? '',
    externalData,
  )

  const pensionFund = getPensionString(
    getValueViaPath<string>(answers, 'payout.pensionFund', '') ?? '',
    externalData,
  )

  const payToPrivatePensionFund = getValueViaPath<YesOrNo>(
    answers,
    'payout.payPrivatePensionFund',
  )
  const privatePensionFund = getPrivatePensionString(
    getValueViaPath<string>(answers, 'payout.privatePensionFund', '') ?? '',
    externalData,
  )

  const privatePensionFundPercentage =
    getValueViaPath<string>(
      answers,
      'payout.privatePensionFundPercentage',
      '',
    ) ?? ''

  const valueItems = [
    `${formatMessage(
      overviewMessages.labels.payout.bank,
    )}: ${bankNumber}-${ledger}-${bankAccountNumber}`,
    `${formatMessage(
      overviewMessages.labels.payout.pensionFund,
    )}: ${pensionFund}`,
  ]

  if (payToUnion === YES) {
    valueItems.push(
      `${formatMessage(overviewMessages.labels.payout.union)}: ${union}`,
    )
  }

  if (payToPrivatePensionFund === YES) {
    valueItems.push(
      `${formatMessage(
        overviewMessages.labels.payout.privatePensionFund,
      )}: ${privatePensionFund} ${privatePensionFundPercentage}%`,
    )
  }
  return valueItems
}
