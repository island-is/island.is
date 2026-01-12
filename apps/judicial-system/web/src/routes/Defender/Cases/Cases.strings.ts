import { defineMessages } from 'react-intl'

export const defenderCases = defineMessages({
  activeCasesTabLabel: {
    id: 'judicial.system.core:defender_cases.active_cases_tab_label',
    defaultMessage: 'Mál í vinnslu',
    description: 'Notaður sem titill á flipa sem sýnir mál í vinnslu',
  },
  completedCasesTabLabel: {
    id: 'judicial.system.core:defender_cases.completed_cases_tab_label',
    defaultMessage: 'Afgreidd mál',
    description: 'Notaður sem titill á flipa sem sýnir afgreidd mál',
  },
  noActiveCases: {
    id: 'judicial.system.core:defender_cases.no_active_cases',
    defaultMessage: 'Engin mál í vinnslu',
    description: 'Notaður sem texti þegar engin mál eru í vinnslu hjá verjanda',
  },
  noCompletedCases: {
    id: 'judicial.system.core:defender_cases.no_completed_cases',
    defaultMessage: 'Engin afgreidd mál',
    description: 'Notaður sem texti þegar engin mál eru afgreidd hjá verjanda',
  },
})
