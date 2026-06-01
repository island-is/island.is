import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  priceWithShippingDescription: {
    id: 'web.customsCalculator:priceWithShippingDescription',
    defaultMessage: 'Verð vöru komin til Íslands',
    description: 'Description for the price with shipping input',
  },
  searchForCategory: {
    id: 'web.customsCalculator:searchForCategory',
    defaultMessage: 'Leita eftir vöruflokki',
    description: 'Button label for searching for a category',
  },
  shortcutsTitle: {
    id: 'web.customsCalculator:shortcutsTitle',
    defaultMessage: 'Algengar vörur',
    description: 'Title for the shortcuts section',
  },
  tariffNumberLabel: {
    id: 'web.customsCalculator:tariffNumberLabel',
    defaultMessage: 'Tollnúmer',
    description: 'Tariff number input label',
  },
  referenceDateLabel: {
    id: 'web.customsCalculator:referenceDateLabel',
    defaultMessage: 'Viðmiðunardagsetning (ISO)',
    description: 'Reference date input label',
  },
  fetchUnits: {
    id: 'web.customsCalculator:fetchUnits',
    defaultMessage: 'Sækja einingar',
    description: 'Button label for fetching units',
  },
  runCalculation: {
    id: 'web.customsCalculator:runCalculation',
    defaultMessage: 'Reikna',
    description: 'Button label for running customs calculation',
  },
  otherCategory: {
    id: 'web.customsCalculator:otherCategory',
    defaultMessage: 'Annað',
    description: 'Fallback category label when category is missing',
  },
  unitsResponse: {
    id: 'web.customsCalculator:unitsResponse',
    defaultMessage: 'Svar með einingum',
    description: 'Heading for units response output',
  },
  calculationResponse: {
    id: 'web.customsCalculator:calculationResponse',
    defaultMessage: 'Svar við útreikningi',
    description: 'Heading for calculation response output',
  },
  priceWithShippingLabel: {
    id: 'web.customsCalculator:priceWithShippingLabel',
    defaultMessage: 'Verð með flutningi (tollverð)',
    description: 'Label for price with shipping input',
  },
  currencyLabel: {
    id: 'web.customsCalculator:currencyLabel',
    defaultMessage: 'Gjaldmiðill',
    description: 'Label for currency input',
  },
})
