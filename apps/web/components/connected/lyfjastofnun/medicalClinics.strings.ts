import { defineMessages } from 'react-intl'

export const m = defineMessages({
  search: {
    id: 'web.lyfjastofnunHealthProviders:search',
    defaultMessage: 'Leit',
    description: 'Label for medical clinic search input',
  },
  searchPlaceholder: {
    id: 'web.lyfjastofnunHealthProviders:clinicSearchPlaceholder',
    defaultMessage: 'Leita að læknastöð',
    description: 'Placeholder for medical clinic search input',
  },
  noResults: {
    id: 'web.lyfjastofnunHealthProviders:noResults',
    defaultMessage: 'Engar niðurstöður fundust',
    description:
      'Message shown when no medical clinics match the current filters',
  },
})
