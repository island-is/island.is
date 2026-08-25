import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  title: {
    id: 'web.rsk.calculatorSlice:title',
    defaultMessage: '',
    description: 'Titill reiknivélar',
  },
  disclaimer: {
    id: 'web.rsk.calculatorSlice:disclaimer',
    defaultMessage: '',
    description: 'Fyrirvari undir reiknivél',
  },
  calculate: {
    id: 'web.rsk.calculatorSlice:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti á takka til að reikna',
  },
  recalculate: {
    id: 'web.rsk.calculatorSlice:recalculate',
    defaultMessage: 'Endurreikna',
    description:
      'Texti á takka til að endurreikna eftir að niðurstöður birtast',
  },
  results: {
    id: 'web.rsk.calculatorSlice:results',
    defaultMessage: 'Niðurstöður',
    description: 'Titill á niðurstöðum',
  },
  groupTaxBaseCalculationTitle: {
    id: 'web.rsk.calculatorSlice:groupTaxBaseCalculationTitle',
    defaultMessage: 'Útreikningar skattstofns',
    description: 'Titill á niðurstöðuflokki fyrir skattstofn',
  },
  groupWithholdingAndPersonalCreditTitle: {
    id: 'web.rsk.calculatorSlice:groupWithholdingAndPersonalCreditTitle',
    defaultMessage: 'Staðgreiðsla og persónuafsláttur',
    description:
      'Titill á niðurstöðuflokki fyrir staðgreiðslu og persónuafslátt',
  },
  groupEmployerCostsTitle: {
    id: 'web.rsk.calculatorSlice:groupEmployerCostsTitle',
    defaultMessage: 'Önnur gjöld launagreiðanda',
    description: 'Titill á niðurstöðuflokki fyrir gjöld launagreiðanda',
  },
  groupFyrraTimabilTitle: {
    id: 'web.rsk.calculatorSlice:groupFyrraTimabilTitle',
    defaultMessage: 'Fyrra tímabil',
    description:
      'Titill á niðurstöðuflokki fyrir fyrra tímabil við skiptingu bifreiðagjalds',
  },
  groupSeinnaTimabilTitle: {
    id: 'web.rsk.calculatorSlice:groupSeinnaTimabilTitle',
    defaultMessage: 'Seinna tímabil',
    description:
      'Titill á niðurstöðuflokki fyrir seinna tímabil við skiptingu bifreiðagjalds',
  },
  selectPlaceholder: {
    id: 'web.rsk.calculatorSlice:selectPlaceholder',
    defaultMessage: 'Veldu',
    description: 'Placeholder fyrir val-reiti',
  },
  fieldRequiredError: {
    id: 'web.rsk.calculatorSlice:fieldRequiredError',
    defaultMessage: 'Þennan reit þarf að fylla út',
    description: 'Villuskilaboð þegar nauðsynlegur reitur er ekki fylltur út',
  },
  fieldRangeError: {
    id: 'web.rsk.calculatorSlice:fieldRangeError',
    defaultMessage: 'Gildið er utan gilds bils',
    description: 'Villuskilaboð þegar tölugildi er utan leyfilegs bils',
  },
  errorOccurredTitle: {
    id: 'web.rsk.calculatorSlice:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill þegar villa kemur upp',
  },
  errorOccurredMessage: {
    id: 'web.rsk.calculatorSlice:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja niðurstöður',
    description: 'Skilaboð þegar villa kemur upp',
  },
  fieldsErrorMessage: {
    id: 'web.rsk.calculatorSlice:fieldsErrorMessage',
    defaultMessage: 'Ekki tókst að sækja reiknivél',
    description: 'Skilaboð þegar ekki tekst að sækja form reiknivélar',
  },
})
