import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  title: {
    id: 'web.rsk.calculator:title',
    defaultMessage: '',
    description: 'Titill reiknivélar',
  },
  disclaimer: {
    id: 'web.rsk.calculator:disclaimer',
    defaultMessage: '',
    description: 'Fyrirvari undir reiknivél',
  },
  calculate: {
    id: 'web.rsk.calculator:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti á takka til að reikna',
  },
  recalculate: {
    id: 'web.rsk.calculator:recalculate',
    defaultMessage: 'Endurreikna',
    description:
      'Texti á takka til að endurreikna eftir að niðurstöður birtast',
  },
  results: {
    id: 'web.rsk.calculator:results',
    defaultMessage: 'Niðurstöður',
    description: 'Titill á niðurstöðum',
  },
  groupTaxBaseCalculationTitle: {
    id: 'web.rsk.calculator:groupTaxBaseCalculationTitle',
    defaultMessage: 'Útreikningar skattstofns',
    description: 'Titill á niðurstöðuflokki fyrir skattstofn',
  },
  groupWithholdingAndPersonalCreditTitle: {
    id: 'web.rsk.calculator:groupWithholdingAndPersonalCreditTitle',
    defaultMessage: 'Staðgreiðsla og persónuafsláttur',
    description:
      'Titill á niðurstöðuflokki fyrir staðgreiðslu og persónuafslátt',
  },
  groupEmployerCostsTitle: {
    id: 'web.rsk.calculator:groupEmployerCostsTitle',
    defaultMessage: 'Önnur gjöld launagreiðanda',
    description: 'Titill á niðurstöðuflokki fyrir gjöld launagreiðanda',
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
