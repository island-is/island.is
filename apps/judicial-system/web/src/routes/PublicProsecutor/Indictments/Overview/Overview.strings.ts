import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.title',
    defaultMessage: 'Máli lokið',
    description: 'Notaður sem titill á yfirliti ákæru.',
  },
  reviewerPlaceholder: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_placeholder',
    defaultMessage: 'Velja saksóknara',
    description: 'Notaður sem skýritexti í dropdown til að velja dómara.',
  },
  reviewerTitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.dropdown_title',
    defaultMessage: 'Úthlutun til yfirlestrar',
    description: 'Notaður sem titill á yfirliti ákæru.',
  },
  reviewerSubtitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_subtitle_v2',
    defaultMessage:
      'Frestur til að {isFine, select, true {kæra viðurlagaákvörðun} other {áfrýja dómi}} {appealDeadlineIsInThePast, select, true {rann} other {rennur}} út {indictmentAppealDeadline}',
    description: 'Notaður sem undirtitill á yfirliti ákæru.',
  },
  reviewerAssignedModalTitle: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_assigned_modal_title',
    defaultMessage: 'Úthlutun tókst',
    description: 'Notaður sem titill á tilkynningaglugga um yfirlesara.',
  },
  reviewerAssignedModalText: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.reviewer_assigned_modal_text',
    defaultMessage:
      'Máli {caseNumber} hefur verið úthlutað til yfirlestrar á {reviewer}.',
    description: 'Notaður sem texti í tilkynningaglugga um yfirlesara.',
  },
  changeReviewedDecisionButtonText: {
    id: 'judicial.system.core:public_prosecutor.indictments.overview.change_reviewed_decision_button_text',
    defaultMessage: 'Breyta ákvörðun',
    description:
      'Notaður sem texti fyrir staðfestingartakka þegar ákvörðun ríkissaksóknara er breytt.',
  },
})
