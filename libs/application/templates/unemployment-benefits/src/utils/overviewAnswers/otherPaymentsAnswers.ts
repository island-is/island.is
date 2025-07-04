import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormText, FormValue } from '@island.is/application/types'
import { overview, overview as overviewMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  getPrivatePensionString,
  getTypeOfIncomeString,
  getUnionString,
} from '../stringMappers'
import {
  CapitalIncomeInAnswers,
  PaymentsFromPensionInAnswers,
  PaymentsFromPrivatePensionInAnswers,
  PaymentsFromSicknessAllowanceInAnswers,
} from '../../shared'
import { formatIsk } from '..'

export const useOtherPaymentsAnswers = (
  answers: FormValue,
  externalData: ExternalData,
  locale: string,
): Array<FormText> => {
  const { formatMessage } = useLocale()
  const paymentsFromInsurace =
    getValueViaPath<string>(answers, 'otherBenefits.paymentsFromInsurace') ?? ''

  //Lífeyrissjóðir
  const paymentsFromPension =
    getValueViaPath<Array<PaymentsFromPensionInAnswers>>(
      answers,
      'otherBenefits.paymentsFromPension',
      [],
    ) ?? []

  const paymentsFromPensionStrings = paymentsFromPension.map((payment) => {
    return getTypeOfIncomeString(payment, externalData, locale)
  })

  //Sjúkradagpeningar
  const paymentsFromSicknessAllowance =
    getValueViaPath<PaymentsFromSicknessAllowanceInAnswers>(
      answers,
      'otherBenefits.paymentsFromSicknessAllowance',
      undefined,
    ) ?? undefined

  const SicknessAllowanceUnionString = getUnionString(
    paymentsFromSicknessAllowance?.union ?? '',
    externalData,
  )

  //Séreignasjóður
  const paymentsFromPrivatePension =
    getValueViaPath<Array<PaymentsFromPrivatePensionInAnswers>>(
      answers,
      'otherBenefits.payedFromPrivatePensionFundDetails',
      [],
    ) ?? []

  const paymentsFromPrivatePensionStrings = paymentsFromPrivatePension.map(
    (payment) => {
      const privatePension = getPrivatePensionString(
        payment.privatePensionFund,
        externalData,
      )
      return {
        privatePensionFund: privatePension,
        paymentAmount: payment.paymentAmount,
      }
    },
  )

  //Fjármagnstekjur
  const capitalIncome =
    getValueViaPath<Array<CapitalIncomeInAnswers>>(
      answers,
      'capitalIncome.capitalIncomeAmount',
      [],
    ) ?? []

  return [
    `${formatMessage(
      overviewMessages.labels.payout.otherPayoutsTR,
    )}: ${formatIsk(parseInt(paymentsFromInsurace))} ${formatMessage(
      overviewMessages.labels.payout.paymentPerMonth,
    )}`,
    paymentsFromPensionStrings.map((paymentString) => {
      return `${paymentString.typeOfPayment}: ${formatIsk(
        parseInt(paymentString.paymentAmount),
      )} ${formatMessage(overviewMessages.labels.payout.paymentPerMonth)}`
    }),
    `${formatMessage(
      overviewMessages.labels.payout.otherPayoutSicknessAllowance,
    )}: ${SicknessAllowanceUnionString}`,
    paymentsFromPrivatePensionStrings.map((paymentString) => {
      return `${paymentString.privatePensionFund}: ${formatIsk(
        parseInt(paymentString.paymentAmount),
      )} ${formatMessage(overviewMessages.labels.payout.paymentPerMonth)}`
    }),
    //TODO add capital income together for one value
    capitalIncome.map(
      (income) =>
        `${formatMessage(
          overviewMessages.labels.payout.capitalIncome,
        )}: ${formatIsk(parseInt(income.amount))} ${formatMessage(
          overviewMessages.labels.payout.paymentPerMonth,
        )}`,
    ),
  ]
}
