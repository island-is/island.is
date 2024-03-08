import { defineMessages } from 'react-intl'

export const location = {
  general: defineMessages({
    title: {
      id: 'aosh.rifm.application:location.general.title',
      defaultMessage: 'Staðsetning skoðunar',
      description: 'Title of location screen',
    },
    description: {
      id: 'aosh.rifm.application:location.general.description',
      defaultMessage:
        'Hér getur þú skráð upplýsingar um staðsetningu tækis sem þarf að skoða.',
      description: 'Description of location screen',
    },
  }),
  labels: defineMessages({
    addressTitle: {
      id: 'aosh.rifm.application:location.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Location select title',
    },
    addressLabel: {
      id: 'aosh.rifm.application:location.labels.addressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosh.rifm.application:location.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    commentTitle: {
      id: 'aosh.rifm.application:location.labels.commentTitle',
      defaultMessage: 'Athugasemdir um skoðun',
      description: 'Location comment title',
    },
    commentPlaceholder: {
      id: 'aosh.rifm.application:location.labels.commentPlaceholder',
      defaultMessage: 'Staðsetning, fjöldi tækja sem þarf að skoða o.s.frv.',
      description: 'Location comment placeholder',
    },
    city: {
      id: 'aosh.rifm.application:location.labels.city',
      defaultMessage: 'Staður',
      description: 'Location city label',
    },
  }),
}
