import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.indictments.review_decision.title_v1',
    defaultMessage: 'Ákvörðun um {isFine, select, true {kæru} other {áfrýjun}}',
    description: 'Notaður sem titill á ákvörðum um áfrýjun boxi fyrir ákæru.',
  },
  subtitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.review_decision.subtitle_v1',
    defaultMessage:
      'Frestur til að {isFine, select, true {kæra viðurlagaákvörðun} other {áfrýja dómi}} {appealDeadlineIsInThePast, select, true {rann} other {rennur}} út {indictmentAppealDeadline}',
    description:
      'Notaður sem undirtitill á ákvörðum um áfrýjun boxi fyrir ákæru.',
  },
  appealToCourtOfAppeals: {
    id: 'judicial.system.core:public_prosecutor.indictments.review_decision.appeal_to_court_of_appeals',
    defaultMessage: 'Áfrýja héraðsdómi til Landsréttar',
    description:
      'Notaður sem texti fyrir "Áfrýja héraðsdómi til Landsréttar" radio takka.',
  },
  acceptDecision: {
    id: 'judicial.system.core:public_prosecutor.indictments.review_decision.accept_decision',
    defaultMessage: 'Una héraðsdómi',
    description: 'Notaður sem texti fyrir "Una héraðsdómi" radio takka.',
  },
  appealFineToCourtOfAppeals: {
    id: 'judicial.system.core:public_prosecutor.indictments.review_decision.appeal_fine_to_court_of_appeals',
    defaultMessage: 'Kæra viðurlagaákvörðun til Landsréttar',
    description:
      'Notaður sem texti fyrir "Kæra viðurlagaákvörðun til Landsréttar" radio takka.',
  },
  acceptFineDecision: {
    id: 'judicial.system.core:public_prosecutor.indictments.review_decision.accept_fine_decision',
    defaultMessage: 'Una viðurlagaákvörðun',
    description:
      'Notaður sem texti fyrir "Kæra viðurlagaákvörðun" radio takka.',
  },
  reviewModalTitle: {
    id: 'judicial.system.core:indictments_review.title',
    defaultMessage: 'Staðfesta ákvörðun',
    description: 'Notaður sem titill á yfirliti ákæru.',
  },
  reviewModalText: {
    id: 'judicial.system.core:indictments_review.modal_text',
    defaultMessage:
      'Ertu viss um að þú viljir {reviewerDecision, select, ACCEPT {una héraðsdómi} APPEAL {áfrýja héraðsdómi til Landsréttar} other {halda áfram}}?',
    description: 'Notaður sem texti í yfirlitsglugga um yfirlit ákæru.',
  },
  reviewModalTextFine: {
    id: 'judicial.system.core:indictments_review.modal_text_fine',
    defaultMessage:
      'Ertu viss um að þú viljir {reviewerDecision, select, ACCEPT {una viðurlagaákvörðun} APPEAL {kæra viðurlagaákvörðun til Landsréttar} other {halda áfram}}?',
    description: 'Notaður sem texti í yfirlitsglugga um yfirlit ákæru.',
  },
  reviewModalPrimaryButtonText: {
    id: 'judicial.system.core:indictments_review.modal_primary_button_text',
    defaultMessage: 'Staðfesta',
    description:
      'Notaður sem texti á aðal takka í yfirlitsglugga um yfirlit ákæru.',
  },
  reviewModalSecondaryButtonText: {
    id: 'judicial.system.core:indictments_review.modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á aukatakka í yfirlitsglugga um yfirlit ákæru.',
  },
})
