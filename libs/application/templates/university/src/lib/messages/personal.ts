import { defineMessages } from 'react-intl'

export const personal = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:personal.general.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal section title',
    },
  }),
  labels: {
    userInformation: defineMessages({
      subSectionTitle: {
        id: 'uni.application:personal.labels.userInformation.subSectionTitle',
        defaultMessage: 'Persónuupplýsingar',
        description: 'User information sub section title',
      },
      pageTitle: {
        id: 'uni.application:personal.labels.userInformation.pageTitle',
        defaultMessage: 'Persónuupplýsingar',
        description: 'User information page title',
      },
      title: {
        id: 'uni.application:personal.labels.userInformation.title',
        defaultMessage: 'Umsækjandi',
        description: 'User information title',
      },
      nationalId: {
        id: 'uni.application:personal.labels.userInformation.nationalId',
        defaultMessage: 'Kennitala',
        description: 'User information national ID label',
      },
      name: {
        id: 'uni.application:personal.labels.userInformation.name',
        defaultMessage: 'Nafn',
        description: 'User information name label',
      },
      address: {
        id: 'uni.application:personal.labels.userInformation.address',
        defaultMessage: 'Heimili/póstfang',
        description: 'User information address label',
      },
      postalCodeAndCity: {
        id: 'uni.application:personal.labels.userInformation.postalCodeAndCity',
        defaultMessage: 'Sveitarfélag',
        description: 'User information postal code and city label',
      },
      email: {
        id: 'uni.application:personal.labels.userInformation.email',
        defaultMessage: 'Netfang',
        description: 'User information email label',
      },
      phone: {
        id: 'uni.application:personal.labels.userInformation.phone',
        defaultMessage: 'Símanúmer',
        description: 'User information phone number label',
      },
      alertMessage: {
        id: 'uni.application:personal.labels.userInformation.alertMessage#markdown',
        defaultMessage:
          'Ef netfang og símanúmer er ekki rétt hér að neðan þá verður að breyta þeim upplýsingum á {mínum síðum}. Þú þarft svo að koma aftur í þennan glugga og uppfæra upplýsingar hér neðst á síðunni.',
        description: 'User information alert message',
      },
      alertMessageLink: {
        id: 'uni.application:personal.labels.userInformation.alertMessageLink',
        defaultMessage: '/minarsidur',
        description: 'Link for mínar síður',
      },
      alertMessageLinkTitle: {
        id: 'uni.application:personal.labels.userInformation.alertMessageLinkTitle',
        defaultMessage: 'Fara á mínar síður',
        description: 'title for mínar síður link',
      },
    }),
  },
}
