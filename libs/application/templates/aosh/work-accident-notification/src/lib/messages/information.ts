import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.wan.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'aosh.wan.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'aosh.wan.application:information.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of information page',
    },
  }),
  labels: {
    company: defineMessages({
      sectionTitle: {
        id: 'aosh.wan.application:information.company.sectionTitle',
        defaultMessage: 'Fyrirtækið',
        description: 'Title of company information section',
      },
      pageTitle: {
        id: 'aosh.wan.application:information.company.pageTitle',
        defaultMessage: 'Fyrirtækið',
        description: 'Title of company information section',
      },
      description: {
        id: 'aosh.wan.application:information.company.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
        description: 'Description of company information page',
      },
      title: {
        id: 'aosh.wan.application:information.company.title',
        defaultMessage: 'Grunnupplýsingar',
        description: 'Company information title',
      },
      nationalId: {
        id: 'aosh.wan.application:information.company.nationalId',
        defaultMessage: 'Kennitala',
        description: 'Company information national ID label',
      },
      name: {
        id: 'aosh.wan.application:information.company.name',
        defaultMessage: 'Nafn',
        description: 'Company information name label',
      },
      address: {
        id: 'aosh.wan.application:information.company.address',
        defaultMessage: 'Heimilisfang',
        description: 'Company information address label',
      },
      postNumberAndTown: {
        id: 'aosh.wan.application:information.company.postNumberAndTown',
        defaultMessage: 'Póstnúmer og bær',
        description: 'Company information post number and town label',
      },
      industryClassification: {
        id: 'aosh.wan.application:information.company.industryClassification',
        defaultMessage: 'Atvinnugreinaflokkun',
        description: 'Company information industry classification label',
      },
      numberOfEmployees: {
        id: 'aosh.wan.application:information.company.numberOfEmployees',
        defaultMessage: 'Starfsmannafjöldi',
        description: 'Company information industry classification label',
      },
      // alertMessage: {
      //   id: 'aosh.wan.application:information.company.alertMessage#markdown',
      //   defaultMessage:
      //     'Ef netfang og símanúmer er ekki rétt hér að neðan þá verður að breyta þeim upplýsingum á {mínum síðum}. Þú þarft svo að koma aftur í þennan glugga og uppfæra upplýsingar hér neðst á síðunni.',
      //   description: 'Company information alert message',
      // },
      // alertMessageLink: {
      //   id: 'aosh.wan.application:information.company.alertMessageLink',
      //   defaultMessage: '/minarsidur',
      //   description: 'Link for mínar síður',
      // },
      // alertMessageLinkTitle: {
      //   id: 'aosh.wan.application:information.company.alertMessageLinkTitle',
      //   defaultMessage: 'Fara á mínar síður',
      //   description: 'title for mínar síður link',
      // },
    }),
    laborProtection: {
      pageTitle: {
        id: 'aosh.wan.application:information.laborProtection.pageTitle',
        defaultMessage: 'Vinnuverndastarf',
        description: 'Title of company labor protection section',
      },
      alertMessageText: {
        id: 'aosh.wan.application:information.laborProtection.alertMessageText',
        defaultMessage:
          'Öryggis- og heilbrigðisstarfsemi fyrirtækisins. Vinsamlega veldu allt sem við á.',
        description:
          'Text for the alerts field in the labor protection part of the company section',
      },
    },
  },
}
