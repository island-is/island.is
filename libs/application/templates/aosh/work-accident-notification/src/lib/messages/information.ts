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
      id: 'aosh.wan.application:information.general.pageTitle',
      defaultMessage: 'Tilkynningaraðili',
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
        defaultMessage: 'Tilkynningaraðili',
        description: 'Title of company/sole proprietary information section',
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
      postNumberAndTownOfBranch: {
        id: 'aosh.wan.application:information.company.postNumberAndTownOfBranch',
        defaultMessage: 'Póstnúmer og bær útibús/deildar',
        description: 'Company information post number and town of branch label',
      },
      email: {
        id: 'aosh.wan.application:information.company.email',
        defaultMessage: 'Netfang tengiliðs',
        description: 'Email of company ',
      },
      phonenumber: {
        id: 'aosh.wan.application:information.company.phonenumber',
        defaultMessage: 'Símanúmer tengiliðs',
        description: 'Phonenumber of company',
      },
      emailAndPhoneAlertMessage: {
        id: 'aosh.wan.application:information.company.emailAndPhoneAlertMessage',
        defaultMessage:
          'ATH. Ef tengiliður er annar en er sjálfkrafa skráður þá geturðu breytt þeim upplýsingum hér.',
        description: 'Email and phone information alert message',
      },
      branchPostnumberError: {
        id: 'aosh.wan.application:information.company.branchPostnumberError',
        defaultMessage:
          'Ef skráð er heimilisfang útibús þarf einnig að skrá postnúmer',
        description: 'Error if only address for branch is input',
      },
      branchAddressError: {
        id: 'aosh.wan.application:information.company.branchAddressError',
        defaultMessage:
          'Ef skráð er postnúmer útibús þarf einnig að skrá heimilisfang',
        description: 'Error if only postnumber for branch is input',
      },
      branchNameError: {
        id: 'aosh.wan.application:information.company.branchNameError',
        defaultMessage: 'Vinsamlegast skráðu nafn útibús/deildar',
        description: 'Error if company user does not input name of branch',
      },
    }),
    laborProtection: defineMessages({
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
    }),
    workhealth: defineMessages({
      sectionTitle: {
        id: 'aosh.wan.application:information.workhealth.sectionTitle',
        defaultMessage: 'Vinnuvernd',
        description: 'Title of workhealth information section',
      },
      descriptionField: {
        id: 'aosh.wan.application:information.workhealth.descriptionField',
        defaultMessage: 'Vinnuverndarstörf',
        description: 'H5 of workhealth information page',
      },
      errorAlert: {
        id: 'aosh.wan.application:information.workhealth.errorAlert',
        defaultMessage:
          "Vinsamlegast veldu a.m.k einn valmöguleika, ef ekkert á við veldu 'engin'",
        description:
          'error alert on workhealth information page when user attempt to navigate forwards without choosing an option',
      },
      pageTitle: {
        id: 'aosh.wan.application:information.workhealth.pageTitle',
        defaultMessage: 'Vinnuvernd',
        description: 'Title of workhealth information page',
      },
      pageDescription: {
        id: 'aosh.wan.application:information.workhealth.pageDescription',
        defaultMessage: 'Öryggis- og heilbrigðisstarfsemi fyrirtækisins.',
        description: 'Description of workhealth information page',
      },
    }),
    projectPurchase: defineMessages({
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
      pageTitle: {
        id: 'aosh.wan.application:information.projectPurchase.pageTitle',
        defaultMessage: 'Verkkaupi',
        description: 'Title of project purchase information page',
      },
      pageDescription: {
        id: 'aosh.wan.application:information.projectPurchase.pageDescription',
        defaultMessage: 'Verkkaupi',
        description: 'Description of project purchase information page',
      },
    }),
  },
}
