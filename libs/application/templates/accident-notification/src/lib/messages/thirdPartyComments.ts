import { defineMessages } from 'react-intl'

export const thirdPartyComment = {
  general: defineMessages({
    name: {
      id: 'an.application:thirdPartyComment.general.name',
      defaultMessage: 'Lýsing á slysi frá tilkynnanda ',
      description: 'Accident description from applicant',
    },
  }),
  labels: defineMessages({
    comment: {
      id: 'an.application:thirdPartyComment.labels.comments',
      defaultMessage: 'Athugasemd',
      description: `Label for comment`,
    },
    descriptionInput: {
      id: 'an.application:thirdPartyComment.labels.descriptionInput',
      defaultMessage: 'Lýsing á slysi',
      description: `Label for description input field`,
    },
    descriptionInputPlaceholder: {
      id: 'an.application:thirdPartyComment.labels.descriptionInputPlaceholder',
      defaultMessage: 'Skrifaðu hér tildrög, orsök og aðstæður slyssins',
      description: 'Label for description input placeholder',
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
