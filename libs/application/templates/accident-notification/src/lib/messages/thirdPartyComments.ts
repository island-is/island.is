import { defineMessages } from 'react-intl'

export const thirdPartyComment = {
  general: defineMessages({
    title: {
      id: 'an.application:thirdPartyComment.general.title',
      defaultMessage: 'Bæta við athugasemd',
      description: 'Third party comment title',
    },
    description: {
      id: 'an.application:thirdPartyComment.general.description',
      defaultMessage:
        'Ef það eru einhverjar upplýsingar varðandi tilkynninguna sem þú vilt setja útá eða auka upplýsingar varðandi slysið sem þú vilt koma á framfæri þá er hægt að gera það hér að neðan.',
      description: 'Third party comment description',
    },
  }),
  labels: defineMessages({
    comment: {
      id: 'an.application:thirdPartyComment.labels.comments',
      defaultMessage: 'Athugasemd',
      description: `Label for comment`,
    },
    commentPlaceholder: {
      id: 'an.application:thirdPartyComment.labels.commentPlaceholder',
      defaultMessage: 'Hér er hægt að setja inn athugasemd',
      description: `Label for comment placeholder`,
    },
  }),
  buttons: defineMessages({
    reject: {
      id: 'an.application:thirdPartyComment.buttons.reject',
      defaultMessage: 'Andmæla tilkynningu',
      description: `Reject button`,
    },
    approve: {
      id: 'an.application:thirdPartyComment.buttons.approve',
      defaultMessage: 'Staðfesta tilkynningu',
      description: `Approve button`,
    },
  }),
}
