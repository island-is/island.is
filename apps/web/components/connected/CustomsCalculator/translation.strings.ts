import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  title: {
    id: 'web.customsCalculator:title',
    defaultMessage: 'Tollreiknivél',
    description: 'Title for the customs calculator connected component',
  },
  description: {
    id: 'web.customsCalculator:description',
    defaultMessage:
      'Einfalt prufusvæði tengt GraphQL virkni tollreiknivélarinnar.',
    description: 'Description text for the customs calculator component',
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
    defaultMessage: 'Keyra útreikning',
    description: 'Button label for running customs calculation',
  },
  filterClear: {
    id: 'web.customsCalculator:filterClear',
    defaultMessage: 'Hreinsa síu',
    description: 'Clear filter label',
  },
  filterClearAll: {
    id: 'web.customsCalculator:filterClearAll',
    defaultMessage: 'Hreinsa allar síur',
    description: 'Clear all filters label',
  },
  filterOpen: {
    id: 'web.customsCalculator:filterOpen',
    defaultMessage: 'Leita eftir vöruflokki',
    description: 'Open category filter menu label',
  },
  filterClose: {
    id: 'web.customsCalculator:filterClose',
    defaultMessage: 'Loka flokkasíu',
    description: 'Close category filter menu label',
  },
  filterTitle: {
    id: 'web.customsCalculator:filterTitle',
    defaultMessage: 'Leita eftir vöruflokki',
    description: 'Category filter menu title',
  },
  filterApply: {
    id: 'web.customsCalculator:filterApply',
    defaultMessage: 'Nota',
    description: 'Apply filter label',
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
})
