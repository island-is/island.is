import { defineMessages } from 'react-intl'

export const location = {
  general: defineMessages({
    title: {
      id: 'aosh.drm.application:location.general.title',
      defaultMessage: 'Staðsetning tækis',
      description: 'Title of location screen',
    },
    description: {
      id: 'aosh.drm.application:location.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of location screen',
    },
  }),
  labels: defineMessages({
    addressTitle: {
      id: 'aosh.drm.application:location.labels.addressTitle',
      defaultMessage: 'Staðsetning',
      description: 'Location select title',
    },
    addressLabel: {
      id: 'aosh.drm.application:location.labels.addressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Location address label',
    },
    postCodeLabel: {
      id: 'aosh.drm.application:location.labels.postCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Cocation postcode label',
    },
    moreInfoLabel: {
      id: 'aosh.drm.application:location.labels.moreInfoLabel',
      defaultMessage: 'Nánari lýsing',
      description: 'Location more info label',
    },
    approveButton: {
      id: 'aosh.drm.application:location.labels.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Location approve button text',
    },
  }),
}
