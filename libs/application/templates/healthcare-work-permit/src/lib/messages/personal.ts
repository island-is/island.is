import { defineMessages } from 'react-intl'

export const personal = {
  general: defineMessages({
    sectionTitle: {
      id: 'hwp.application:personal.general.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal section title',
    },
  }),
  labels: {
    userInformation: defineMessages({
      pageTitle: {
        id: 'hwp.application:personal.labels.userInformation.pageTitle',
        defaultMessage: 'Persónuupplýsingar',
        description: 'User information page title',
      },
      title: {
        id: 'hwp.application:personal.labels.userInformation.title',
        defaultMessage: 'Umsækjandi',
        description: 'User information title',
      },
      nationalId: {
        id: 'hwp.application:personal.labels.userInformation.nationalId',
        defaultMessage: 'Kennitala',
        description: 'User information national ID label',
      },
      name: {
        id: 'hwp.application:personal.labels.userInformation.name',
        defaultMessage: 'Nafn',
        description: 'User information name label',
      },
      birthDate: {
        id: 'hwp.application:personal.labels.userInformation.birthDate',
        defaultMessage: 'Fæðingardagur',
        description: 'User information birth date label',
      },
      citizenship: {
        id: 'hwp.application:personal.labels.userInformation.citizenship',
        defaultMessage: 'Fæðingarstaður',
        description: 'User information birth place label',
      },
      email: {
        id: 'hwp.application:personal.labels.userInformation.email',
        defaultMessage: 'Netfang',
        description: 'User information email label',
      },
      phone: {
        id: 'hwp.application:personal.labels.userInformation.phone',
        defaultMessage: 'Símanúmer',
        description: 'User information phone number label',
      },
      alertMessage: {
        id: 'hwp.application:personal.labels.userInformation.alertMessage#markdown',
        defaultMessage:
          'Ef netfang og símanúmer er ekki rétt hér að neðan þá verður að breyta þeim upplýsingum á {mínum síðum}. Þú þarft svo að koma aftur í þennan glugga og uppfæra upplýsingar hér neðst á síðunni.',
        description: 'User information alert message',
      },
      alertMessageLink: {
        id: 'hwp.application:personal.labels.userInformation.alertMessageLink',
        defaultMessage: '/minarsidur',
        description: 'Link for mínar síður',
      },
      alertMessageLinkTitle: {
        id: 'hwp.application:personal.labels.userInformation.alertMessageLinkTitle',
        defaultMessage: 'Fara á mínar síður',
        description: 'title for mínar síður link',
      },
    }),
  },
}
