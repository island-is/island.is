import { defineMessages } from 'react-intl'

export const m = defineMessages({
  search: {
    id: 'web.lyfjastofnunHealthProviders:search',
    defaultMessage: 'Leit',
    description: 'Label for wholesaler search input',
  },
  searchPlaceholder: {
    id: 'web.lyfjastofnunHealthProviders:wholesalerSearchPlaceholder',
    defaultMessage: 'Leita að lyfjaheildsölu',
    description: 'Placeholder for wholesaler search input',
  },
  noResults: {
    id: 'web.lyfjastofnunHealthProviders:noResults',
    defaultMessage: 'Engar niðurstöður fundust',
    description: 'Message shown when no wholesalers match the search',
  },
})
