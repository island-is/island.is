import { defineMessages } from 'react-intl'

export const states = defineMessages({
  inReviewTitle: {
    id: 'ghb.application:states.inReview.title',
    defaultMessage: 'Beðið eftir Þórkötlu',
    description: 'Title that displays on action card when in review',
  },
  inReviewDescription: {
    id: 'ghb.application:states.inReview.description',
    defaultMessage:
      'Umsókn þín um kaup ríkisins á íbúðarhúsnæði þínu er móttekin og er í vinnslu hjá fasteignafélaginu Þórkötlu.',
    description: 'Description that displays on action card when in review',
  },
  approvedTitle: {
    id: 'ghb.application:states.approved.title',
    defaultMessage: 'Umsókn samþykkt',
    description:
      'Title that displays on action card when application is approved',
  },
  approvedText: {
    id: 'ghb.application:states.approved.text',
    defaultMessage: 'Umsókn þín hefur verið samþykkt.',
    description: 'Text that displays when application is approved',
  },
  rejectedTitle: {
    id: 'ghb.application:states.rejected.title',
    defaultMessage: 'Umsókn hafnað',
    description:
      'Title that displays on action card when application is rejected',
  },
  rejectedText: {
    id: 'ghb.application:states.rejected.text',
    defaultMessage: 'Umsókn þinni hefur verið hafnað.',
    description: 'Text that displays when application is rejected',
  },
})
