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
  noConnectedCasesMessage: {
    id: 'judicial.system.core:court.indictments.conclusion.select_connected_case.no_connected_cases_message',
    defaultMessage: 'Engin opin mál fundust á ákærða',
    description:
      'Notaður sem texti í upplýsingabox þegar engin opin mál eru fyrir hendi.',
  },
  cannotBeMergedTitle: {
    id: 'judicial.system.core:court.indictments.conclusion.select_connected_case.cant_be_merged_title',
    defaultMessage: 'Ekki hægt að sameina mál',
    description: 'Notaður sem titill þegar ekki er hægt að sameina mál',
  },
  cannotBeMergedMessage: {
    id: 'judicial.system.core:court.indictments.conclusion.select_connected_case.cant_be_merged_message',
    defaultMessage: 'Einungis er hægt að sameina mál með einum varnaraðila',
    description: 'Notaður sem titill þegar ekki er hægt að sameina mál',
  },
})
