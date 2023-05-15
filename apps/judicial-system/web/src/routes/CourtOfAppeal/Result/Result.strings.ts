import { defineMessages } from 'react-intl'

export const courtOfAppealResult = defineMessages({
  title: {
    id: 'judicial.system.core:court_of_appeal_result.title',
    defaultMessage: 'Niðurstaða Landsréttar {appealedDate}',
    description: 'Titill á niðurstöðu landsréttar á niðurstöðuskjá',
  },
  conclusionCourtOfAppealTitle: {
    id:
      'judicial.system.core:court_of_appeal_result.conclusion_court_of_appeal_title',
    defaultMessage: 'Landsréttar',
    description: 'Titill á Úrskurðarorðum landsréttar',
  },
  conclusionTitle: {
    id: 'judicial.system.core:court_of_appeal_result.conclusion_title',
    defaultMessage: 'héraðsdóm',
    description: 'Titill á Úrskurðarorðum héraðsdóms',
  },
})
