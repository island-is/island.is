import { defineMessages } from 'react-intl'

// External information retrieval
export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id:
        'an.application:section.backgroundInformation.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id: 'an.application:section.backgroundInformation.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'an.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt.',
      description: 'External information retrieval subtitle',
    },
    checkboxLabel: {
      id:
        'an.application:section.backgroundInformation.externalData.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu tilkynningarinnar',
      description: 'External information retrieval checkbox label',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id:
        'an.application:section.backgroundInformation.externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'Title: National Registry',
    },
    description: {
      id:
        'an.application:section.backgroundInformation.externalData.nationalRegistry.description',
      defaultMessage: 'Nafn, kennitala, símanúmer, netfang',
      description: 'Description: National Registry',
    },
  }),
  userProfile: defineMessages({
    title: {
      id:
        'an.application:section.backgroundInformation.externalData.userProfile.title',
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'Title: User Profile',
    },
    description: {
      id:
        'an.application:section.backgroundInformation.externalData.userProfile.description',
      defaultMessage:
        'Símanúmer, netfang. Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
      description: 'Description: User Profile',
    },
  }),
  revAndCustoms: defineMessages({
    title: {
      id:
        'an.application:section.backgroundInformation.externalData.revAndCustoms.title',
      defaultMessage: 'Upplýsingar frá skattinum',
      description: 'Title: External Info about applicants insurance ',
    },
    description: {
      id:
        'an.application:section.backgroundInformation.externalData.revAndCustoms.description',
      defaultMessage: 'Upplýsingar um slyastryggingu við heimilisstörf',
      description: 'Description: External Info about applicants insurance',
    },
  }),
  notifications: defineMessages({
    title: {
      id:
        'an.application:section.backgroundInformation.externalData.notifications.title',
      defaultMessage: 'Samþykki fyrir tilkynningar',
      description: 'Approval of notifications',
    },
    description: {
      id:
        'an.application:section.backgroundInformation.externalData.notifications.description',
      defaultMessage: 'Send verða til þín um stöðu mála osfrv.',
      description:
        'Notifications will be sent regarding the status of your application',
    },
  }),
}
