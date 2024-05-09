import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  inProgressTitle: {
    id: 'judicial.system.core:indictment_overview.in_progress_title',
    defaultMessage: 'Yfirlit ákæru',
    description:
      'Notaður sem titill á yfirliti ákæru þegar máli er ekki lokið.',
  },
  completedTitle: {
    id: 'judicial.system.core:indictment_overview.completed_title',
    defaultMessage: 'Máli lokið',
    description: 'Notaður sem titill á yfirliti ákæru þegar máli er lokið.',
  },
  completeReview: {
    id: 'judicial.system.core:indictment_overview.complete_review',
    defaultMessage: 'Ljúka yfirlestri',
    description: 'Notaður sem texti á takka til að loka yfirliti ákæru.',
  },
  reviewModalTitle: {
    id: 'judicial.system.core:indictment_overview.review_title',
    defaultMessage: 'Staðfesta ákvörðun',
    description: 'Notaður sem titill á yfirliti ákæru.',
  },
  reviewModalText: {
    id: 'judicial.system.core:indictment_overview.review_modal_text',
    defaultMessage:
      'Ertu viss um að þú viljir {reviewerAcceptsIndictment, select, true {una héraðsdómi} other {áfrýja héraðsdómi til Landsréttar}?',
    description: 'Notaður sem texti í yfirlitsglugga um yfirlit ákæru.',
  },
  reviewModalPrimaryButtonText: {
    id: 'judicial.system.core:indictment_overview.review_modal_primary_button_text',
    defaultMessage: 'Staðfesta',
    description:
      'Notaður sem texti á aðal takka í yfirlitsglugga um yfirlit ákæru.',
  },
  reviewModalSecondaryButtonText: {
    id: 'judicial.system.core:indictment_overview.review_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á aukatakka í yfirlitsglugga um yfirlit ákæru.',
  },
})
