import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.wan.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    description: {
      id: 'aosh.wan.application:information.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of information page',
    },
    pageTitle: {
      id: 'aosh.wan.application:information.company.pageTitle',
      defaultMessage: 'Fyrirtækið',
      description: 'Title of company information section',
    },
  }),
  labels: {
    company: defineMessages({
      sectionTitle: {
        id: 'aosh.wan.application:information.company.sectionTitle',
        defaultMessage: 'Grunnupplýsingar',
        description: 'Title of base information section',
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
      descriptionField: {
        id: 'aosh.wan.application:information.company.descriptionField',
        defaultMessage: 'Grunnupplýsingar',
        description: 'H5 of company information page',
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
      // industryClassification: {
      //   id: 'aosh.wan.application:information.company.industryClassification',
      //   defaultMessage: 'Atvinnugreinaflokkun',
      //   description: 'Company information industry classification label',
      // },
      numberOfEmployees: {
        id: 'aosh.wan.application:information.company.numberOfEmployees',
        defaultMessage: 'Starfsmannafjöldi',
        description: 'Company information industry classification label',
      },
      ohasw: {
        id: 'aosh.wan.application:information.company.ohasw',
        defaultMessage: 'Vinnuverndarstarf',
        description: 'Occupational health and safety work',
      },
      alertMessage: {
        id: 'aosh.wan.application:information.company.alertMessage',
        defaultMessage:
          'Skráðu nafn útibús og eða deildar. Ef útibú/deild er með annað heimilisfang en höfuðstöð þá þarf að skrá það hér fyrir neðan.',
        description: 'Company information alert message',
      },
      nameOfBranch: {
        id: 'aosh.wan.application:information.company.nameOfBranch',
        defaultMessage: 'Nafn útibús/deildar',
        description: 'Name of company branch',
      },
      addressOfBranch: {
        id: 'aosh.wan.application:information.company.addressOfbranch',
        defaultMessage: 'Heimilisfang útibús/deildar',
        description: 'Address of company branch',
      },
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
    workhealth: {
      sectionTitle: {
        id: 'aosh.wan.application:information.workhealth.sectionTitle',
        defaultMessage: 'Vinnuvernd',
        description: 'Title of workhealth information section',
      },
      descriptionField: {
        id: 'aosh.wan.application:information.workhealth.descriptionField',
        defaultMessage: 'Vinnuverndarstarf',
        description: 'H5 of workhealth information page',
      },
      errorAlert: {
        id: 'aosh.wan.application:information.workhealth.errorAlert',
        defaultMessage:
          "Vinsamlegast veldur a.m.k einn valmöguleika, ef ekkert á við veldu 'engin'",
        description:
          'error alert on workhealth information page when user attempt to navigate forwards without choosing an option',
      },
    },
    projectPurchase: {
      sectionTitle: {
        id: 'aosh.wan.application:information.projectPurchase.sectionTitle',
        defaultMessage: 'Verkkaupi',
        description: 'Title of project purchase information section',
      },
      radioTitle: {
        id: 'aosh.wan.application:information.projectPurchase.radioTitle',
        defaultMessage: 'Vilt þú skrá verkkaupa ?',
        description:
          'Title of checkbox on the project purchase page. information section',
      },
      descriptionField: {
        id: 'aosh.wan.application:information.projectPurchase.descriptionField',
        defaultMessage: 'Verkkaupi',
        description: 'H5 of project purchase information page',
      },
      alertMessage: {
        id: 'aosh.wan.application:information.projectPurchase.alertMessage',
        defaultMessage:
          'Hér fyrir neðan er hægt að skrá verkkaupa ef það á við. Verkkaupi er aðili sem unnið er fyrir í verktakavinnu.',
        description:
          'Text for the alerts field in the project purchase section',
      },
      name: {
        id: 'aosh.wan.application:information.projectPurchase.name',
        defaultMessage: 'Nafn',
        description: 'Name, in project purchase section',
      },
    },
  },
}
