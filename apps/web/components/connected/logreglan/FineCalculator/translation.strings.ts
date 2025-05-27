import { defineMessages } from 'react-intl'

export const m = {
  fines: defineMessages({
    total: {
      id: 'web.logreglan.fineCalculator:fines.total',
      defaultMessage: 'Samtals',
      description: 'Samtals',
    },
    inputPlaceholder: {
      id: 'web.logreglan.fineCalculator:fines.inputPlaceholder',
      defaultMessage: 'Leitaðu að sekt',
      description: 'Placeholder fyrir inntak',
    },
    pointsPrefix: {
      id: 'web.logreglan.fineCalculator:fines.pointsPrefix',
      defaultMessage: 'Punktar: ',
      description: 'Punktar: ',
    },
    pointsPostfix: {
      id: 'web.logreglan.fineCalculator:fines.pointsPostfix',
      defaultMessage: ' punktar',
      description: ' punktar',
    },
    countPostfix: {
      id: 'web.logreglan.fineCalculator:fines.countPostfix',
      defaultMessage: ' brot',
      description: ' brot',
    },
    calculate: {
      id: 'web.logreglan.fineCalculator:fines.calculate',
      defaultMessage: 'Sjá sundurliðun',
      description: 'Reikna',
    },
  }),
  results: defineMessages({
    goBack: {
      id: 'web.logreglan.fineCalculator:results.goBack',
      defaultMessage: 'Sjá sektir',
      description: 'Sjá sektir',
    },
    itemHeading: {
      id: 'web.logreglan.fineCalculator:results.itemHeading',
      defaultMessage: 'Atriði',
      description: 'Atriði',
    },
    fineHeading: {
      id: 'web.logreglan.fineCalculator:results.fineHeading',
      defaultMessage: 'Sekt',
      description: 'Sekt',
    },
    quarterOfHeading: {
      id: 'web.logreglan.fineCalculator:results.quarterOfHeading',
      defaultMessage: '25% af',
      description: '25% af',
    },
    pointsHeading: {
      id: 'web.logreglan.fineCalculator:results.pointsHeading',
      defaultMessage: 'Punktar',
      description: 'Punktar',
    },
    total: {
      id: 'web.logreglan.fineCalculator:results.total',
      defaultMessage: 'Samtals',
      description: 'Samtals',
    },
    jailTime: {
      id: 'web.logreglan.fineCalculator:results.jailTime',
      defaultMessage: 'Vararefsing: {days} dagar',
      description: 'Vararefsing: {days} dagar',
    },
  }),
}
