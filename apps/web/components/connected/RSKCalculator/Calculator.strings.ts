import { defineMessages } from 'react-intl'

export const m = defineMessages({
  calculate: {
    id: 'web.rsk.calculator:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti á takka til að reikna',
  },
  results: {
    id: 'web.rsk.calculator:results',
    defaultMessage: 'Niðurstöður',
    description: 'Titill á niðurstöðum',
  },
  yes: {
    id: 'web.rsk.calculator:yes',
    defaultMessage: 'Já',
    description: 'Já valkostur fyrir já/nei reit',
  },
  no: {
    id: 'web.rsk.calculator:no',
    defaultMessage: 'Nei',
    description: 'Nei valkostur fyrir já/nei reit',
  },
  selectPlaceholder: {
    id: 'web.rsk.calculator:selectPlaceholder',
    defaultMessage: 'Veldu',
    description: 'Placeholder fyrir val-reiti',
  },
  errorOccurredTitle: {
    id: 'web.rsk.calculator:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill þegar villa kemur upp',
  },
  errorOccurredMessage: {
    id: 'web.rsk.calculator:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja niðurstöður',
    description: 'Skilaboð þegar villa kemur upp',
  },
  fieldsErrorMessage: {
    id: 'web.rsk.calculator:fieldsErrorMessage',
    defaultMessage: 'Ekki tókst að sækja reiknivél',
    description: 'Skilaboð þegar ekki tekst að sækja form reiknivélar',
  },
})
