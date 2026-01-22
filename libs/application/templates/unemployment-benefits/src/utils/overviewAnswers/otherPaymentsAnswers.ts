import { getValueViaPath, YES } from '@island.is/application/core'
import { ExternalData, FormText, FormValue } from '@island.is/application/types'
import { overview as overviewMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { GaldurDomainModelsSettingsIncomeTypesIncomeTypeCategoryDTO } from '@island.is/clients/vmst-unemployment'

import {
  getPensionString,
  getPrivatePensionString,
  getUnionString,
} from '../stringMappers'
import { CapitalIncomeInAnswers, OtherBenefitsInAnswers } from '../../shared'
import { formatCurrency } from '@island.is/shared/utils'

export const useOtherPaymentsAnswers = (
  answers: FormValue,
  externalData: ExternalData,
  locale: string,
): Array<FormText> => {
  const { formatMessage } = useLocale()
  const incomeTypes =
    getValueViaPath<
      GaldurDomainModelsSettingsIncomeTypesIncomeTypeCategoryDTO[]
    >(
      externalData,
      'unemploymentApplication.data.supportData.incomeTypeCategories',
    ) ?? []
  const otherBenefits = getValueViaPath<OtherBenefitsInAnswers>(
    answers,
    'otherBenefits',
  )

  if (otherBenefits?.receivingBenefits === 'no') {
    return []
  }

  const paymentsList: Array<string> = []

  otherBenefits?.payments?.forEach((payment) => {
    const topCategory = incomeTypes.find((x) => x.id === payment.typeOfPayment) // don't show unless there is no subCategory
    const subCategory = topCategory?.incomeTypes?.find(
      (x) => x.id === payment.subType,
    )
    const paymentAmount = payment.paymentAmount || ''
    const privatePensionString = getPrivatePensionString(
      payment.privatePensionFund || '',
      externalData,
    )
    const unionString = getUnionString(payment.union || '', externalData)
    const pensionFundString = getPensionString(
      payment.pensionFund || '',
      externalData,
    )

    const categoryNameStringValue =
      (locale === 'is' ? subCategory?.name : subCategory?.english) ??
      (locale === 'is' ? topCategory?.name : topCategory?.english) ??
      ''
    const privatePensionStringValue = privatePensionString
      ? ` - ${privatePensionString}`
      : ''
    const unionStringValue = unionString ? ` - ${unionString}` : ''
    const pensionFundStringValue = pensionFundString
      ? ` - ${pensionFundString}`
      : ''
    const paymentAmountStringValue = paymentAmount
      ? `: ${formatCurrency(parseInt(paymentAmount))} ${formatMessage(
          overviewMessages.labels.payout.paymentPerMonth,
        )}`
      : ''

    paymentsList.push(
      categoryNameStringValue +
        privatePensionStringValue +
        unionStringValue +
        pensionFundStringValue +
        paymentAmountStringValue,
    )
  })

  //Fjármagnstekjur
  const capitalIncome = getValueViaPath<CapitalIncomeInAnswers>(
    answers,
    'capitalIncome',
  )
  const capitalIncomeTotalAmount =
    capitalIncome?.otherIncome === YES
      ? capitalIncome?.capitalIncomeAmount
          ?.map((x) => parseInt(x?.amount || '0'))
          .reduce((a, b) => a + b, 0)
      : null

  return [
    ...paymentsList,
    capitalIncomeTotalAmount
      ? `${formatMessage(
          overviewMessages.labels.payout.capitalIncome,
        )}${`: ${formatCurrency(capitalIncomeTotalAmount)} ${formatMessage(
          overviewMessages.labels.payout.paymentPerMonth,
        )}`}`
      : '',
  ]
}
