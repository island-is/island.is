import {
  calculateTaxOfAmount,
  calculatePersonalTaxAllowanceUsed,
  Amount,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'

const currentYear = format(new Date(), 'yyyy')

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

export const amountCalculation = (amount: Amount) => {
  if (!amount) {
    return []
  }

  return [
    {
      title: 'Grunnupphæð',
      calculation: `+ ${amount?.aidAmount.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Skattur',
      calculation: `- ${amount?.tax.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Persónuafsláttur',
      calculation: `${amount?.personalTaxCredit.toLocaleString('de-DE')} kr. `,
    },
  ]
}
