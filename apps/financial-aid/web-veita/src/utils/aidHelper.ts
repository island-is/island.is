import {
  calculateTaxOfAmount,
  calculatePersonalTaxAllowanceUsed,
  Amount,
  calculateAidFinalAmount,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

const currentYear = format(new Date(), 'yyyy')

export const aidFinalAmount = (aidAmount: number) => {
  return `${calculateAidFinalAmount(
    aidAmount,
    false,
    currentYear,
  ).toLocaleString('de-DE')} kr.`
}

export const aidCalculation = (
  aidAmount: number,
  usePersonalTaxCredit: boolean,
) => {
  return [
    {
      title: 'Grunnupphæð',
      calculation: `+ ${aidAmount?.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Skattur',
      calculation: `- ${calculateTaxOfAmount(
        aidAmount,
        currentYear,
      ).toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Persónuafsláttur',
      calculation: `${
        usePersonalTaxCredit ? '+ ' : ''
      }${calculatePersonalTaxAllowanceUsed(
        aidAmount,
        usePersonalTaxCredit,
        currentYear,
      ).toLocaleString('de-DE')} kr. `,
    },
  ]
}

export const amountCalculation = (amount?: Amount) => {
  if (!amount) {
    return []
  }

  const deductionFactors =
    amount?.deductionFactors?.map((deductionFactor) => {
      return {
        title: deductionFactor.description ?? '',
        calculation: `${deductionFactor?.amount?.toLocaleString('de-DE')} kr.`,
      }
    }) ?? []

  const basicCalc = [
    {
      title: 'Grunnupphæð',
      calculation: `+ ${amount?.aidAmount.toLocaleString('de-DE')} kr.`,
    },
    ...deductionFactors,
    {
      title: 'Skattur',
      calculation: `- ${amount?.tax.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Persónuafsláttur',
      calculation: `${amount?.personalTaxCredit.toLocaleString('de-DE')} kr. `,
    },
  ]

  return basicCalc
}
