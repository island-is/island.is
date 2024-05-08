import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.indictments.appeal_decision.title',
    defaultMessage: 'Ákvörðun um áfrýjun',
    description: 'Notaður sem titill á ákvörðum um áfrýjun boxi fyrir ákæru.',
  },
  subtitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.appeal_decision.subtitle',
    defaultMessage:
      'Frestur til að áfrýja dómi rennur út {indictmentAppealDeadline}',
    description:
      'Notaður sem undirtitill á ákvörðum um áfrýjun boxi fyrir ákæru.',
  },
  appealToCourtOfAppeals: {
    id: 'judicial.system.core:public_prosecutor.indictments.appeal_decision.appeal_to_court_of_appeals',
    defaultMessage: 'Áfrýja héraðsdómi til Landsréttar',
    description:
      'Notaður sem texti fyrir "Áfrýja héraðsdómi til Landsréttar" radio takka.',
  },
  acceptDecision: {
    id: 'judicial.system.core:public_prosecutor.indictments.appeal_decision.accept_decision',
    defaultMessage: 'Una héraðsdómi',
    description: 'Notaður sem texti fyrir "Una héraðsdómi" radio takka.',
  },
})
