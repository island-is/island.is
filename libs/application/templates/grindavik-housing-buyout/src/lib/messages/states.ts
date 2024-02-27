import { defineMessages } from 'react-intl'

export const states = defineMessages({
  inReviewTitle: {
    id: 'ghb.application:states.inReview.title',
    defaultMessage: 'Beðið eftir sýslumanni',
    description: 'Title that displays on action card when in review',
  },
  inReviewDescription: {
    id: 'ghb.application:states.inReview.description',
    defaultMessage:
      'Umsókn er í afgreiðsluferli hjá sýslumanni. Ef sýslumaður telur þörf á frekari upplýsingum mun hann hafa samband.',
    description: 'Description that displays on action card when in review',
  },
  approvedText: {
    id: 'ghb.application:states.approved.text',
    defaultMessage: 'Umsókn samþykkt',
    description: 'Text that displays when application is approved',
  },
  rejectedText: {
    id: 'ghb.application:states.rejected.text',
    defaultMessage: 'Umsókn hafnað',
    description: 'Text that displays when application is rejected',
  },
})
