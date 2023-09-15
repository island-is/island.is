import { defineMessages } from 'react-intl'

export const m = {
  progressTag: defineMessages({
    draft: {
      id: 'application.application-ui-shell:progress-tag.draft',
      defaultMessage: 'Staða: Í vinnslu hjá þér',
      description: 'Progress tag for draft applications',
    },
    inProgress: {
      id: 'application.application-ui-shell:progress-tag.inProgress',
      defaultMessage: 'Staða: Í vinnslu',
      description: 'Some description',
    },
    completed: {
      id: 'application.application-ui-shell:progress-tag.completed',
      defaultMessage: 'Staða: Lokið',
      description: 'Some description',
    },
    approved: {
      id: 'application.application-ui-shell:progress-tag.approved',
      defaultMessage: 'Staða: Samþykkt',
      description: 'Some description',
    },
    rejected: {
      id: 'application.application-ui-shell:progress-tag.rejected',
      defaultMessage: 'Staða: Hafnað',
      description: 'Some description',
    },
  }),
}
