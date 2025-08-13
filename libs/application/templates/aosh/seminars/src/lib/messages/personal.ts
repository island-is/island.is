import { defineMessages } from 'react-intl'

export const personal = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:personal.general.pageTitle',
      defaultMessage: 'Skráningaraðili',
      description: `personal page title `,
    },
    sectionTitle: {
      id: 'aosh.sem.application:personal.general.sectionTitle',
      defaultMessage: 'Skráningaraðili',
      description: `personal section title `,
    },
    pageDescription: {
      id: 'aosh.sem.application:personal.general.pageDescription',
      defaultMessage: 'Upplýsingar um skráningaraðila',
      description: `personal page description `,
    },
  }),
  labels: defineMessages({
    changeInfo: {
      id: 'aosh.sem.application:personal.labels.changeInfo',
      defaultMessage: 'Breyta upplýsingum á mínum síðum',
      description: 'Change information label on personal screen',
    },
    userName: {
      id: 'aosh.sem.application:personal.labels.userName',
      defaultMessage: 'Nafn',
      description: `user name `,
    },
    userNationalId: {
      id: 'aosh.sem.application:personal.labels.userNationalId',
      defaultMessage: 'Kennitala',
      description: `user nationalId `,
    },
    userEmail: {
      id: 'aosh.sem.application:personal.labels.userEmail',
      defaultMessage: 'Netfang',
      description: `user email `,
    },
    userPhoneNumber: {
      id: 'aosh.sem.application:personal.labels.userPhoneNumber',
      defaultMessage: 'Símanúmer',
      description: `user phone number `,
    },
    isApplyinForOthers: {
      id: 'aosh.sem.application:personal.labels.isApplyinForOthers',
      defaultMessage:
        'Vinsamlegast tilgreindu hvort þú sért að skrá sjálfan þig eða fleiri einstaklinga',
      description: `is applying for others`,
    },
    isApplyinForOthersRadioYes: {
      id: 'aosh.sem.application:personal.labels.isApplyinForOthersRadioYes',
      defaultMessage: 'Skrá mig og fleiri',
      description: `is applying for others radio yes`,
    },
    isApplyinForOthersRadioNo: {
      id: 'aosh.sem.application:personal.labels.isApplyinForOthersRadioNo',
      defaultMessage: 'Skrá bara mig',
      description: `is applying for others radio no`,
    },
  }),
}
