import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  connectedCaseLabel: {
    id: 'judicial.system.core:court.indictments.conclusion.select_connected_case.label',
    defaultMessage: 'Opin mál ákærða',
    description:
      'Notaður sem label texti í tengd mál dropdown á Niðurstaða skrefi.',
  },
  connectedCasePlaceholder: {
    id: 'judicial.system.core:court.indictments.conclusion.select_connected_case.placeholder',
    defaultMessage: 'Hvaða máli sameinast þetta mál?',
    description:
      'Notaður sem skýritexti í tengd mál dropdown á Niðurstaða skrefi.',
  },
  noConnectedCasesTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.select_connected_case.no_connected_cases_title',
    defaultMessage: 'Engin opin mál',
    description:
      'Notaður sem titill á upplýsingabox þegar engin opin mál eru fyrir hendi.',
  },
  noConnectedCasesMessage: {
    id: 'judicial.system.core:court.indictments.conclusion.select_connected_case.no_connected_cases_text',
    defaultMessage: 'Engin opin mál ákærða fundust',
    description:
      'Notaður sem texti í upplýsingabox þegar engin opin mál eru fyrir hendi.',
  },
})
