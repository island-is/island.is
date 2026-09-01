import { defineMessages } from 'react-intl'

export const messages = defineMessages({
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
  fieldsErrorMessage: {
    id: 'web.rsk.calculatorSlice:fieldsErrorMessage',
    defaultMessage: 'Ekki tókst að sækja reiknivél',
    description: 'Skilaboð þegar ekki tekst að sækja form reiknivélar',
  },
})
