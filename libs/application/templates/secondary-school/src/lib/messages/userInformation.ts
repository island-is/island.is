import { defineMessages } from 'react-intl'

export const userInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ss.application:userInformation.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'Title of user information section',
    },
  }),
  applicant: defineMessages({
    subSectionTitle: {
      id: 'ss.application:userInformation.applicant.subSectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Title of applicant sub section',
    },
    pageTitle: {
      id: 'ss.application:userInformation.applicant.pageTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Title of applicant page',
    },
    description: {
      id: 'ss.application:userInformation.applicant.description',
      defaultMessage:
        'Vinsamlegast farðu yfir hvort allar upplýsingar séu réttar',
      description: 'Description of applicant page',
    },
    subtitle: {
      id: 'ss.application:userInformation.applicant.subtitle',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant subtitle',
    },
  }),
  applicationType: defineMessages({
    subtitle: {
      id: 'ss.application:userInformation.applicationType.subtitle',
      defaultMessage: 'Tegund umsækjanda',
      description: 'Application type subtitle',
    },
    freshmanOptionTitle: {
      id: 'ss.application:userInformation.applicationType.freshmanOptionTitle',
      defaultMessage: 'Útskrifast úr grunnskóla í vor',
      description: 'Freshman option title',
    },
    generalApplicationOptionTitle: {
      id: 'ss.application:userInformation.applicationType.generalApplicationOptionTitle',
      defaultMessage: 'Lauk grunnskóla fyrir ári eða meira',
      description: 'General application option title',
    },
    alertMessage: {
      id: 'ss.application:userInformation.applicationType.alertMessage',
      defaultMessage:
        'Miðstöð menntunar og skólaþjónustu hefur ekki upplýsingar um útskrift þína úr grunnskóla í vor. Vinsamlegast hafðu samband í gegnum netfangið innritun@midstodmenntunar.is',
      description: 'Application type alert message',
    },
  }),
  custodian: defineMessages({
    subSectionTitle: {
      id: 'ss.application:userInformation.custodian.subSectionTitle',
      defaultMessage: 'Forsjáraðili',
      description: 'Title of custodian sub section',
    },
    pageTitle: {
      id: 'ss.application:userInformation.custodian.pageTitle',
      defaultMessage: 'Forsjáraðili',
      description: 'Title of custodian page',
    },
    subtitle: {
      id: 'ss.application:userInformation.custodian.subtitle',
      defaultMessage: 'Forsjáraðili',
      description: 'Custodian subtitle',
    },
    name: {
      id: 'ss.application:userInformation.custodian.name',
      defaultMessage: 'Fullt nafn',
      description: 'Custodian name',
    },
    nationalId: {
      id: 'ss.application:userInformation.custodian.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Custodian national id',
    },
    address: {
      id: 'ss.application:userInformation.custodian.address',
      defaultMessage: 'Heimilisfang',
      description: 'Custodian address',
    },
    postalCode: {
      id: 'ss.application:userInformation.custodian.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Custodian postal code',
    },
    city: {
      id: 'ss.application:userInformation.custodian.city',
      defaultMessage: 'Staður',
      description: 'Custodian city',
    },
    email: {
      id: 'ss.application:userInformation.custodian.email',
      defaultMessage: 'Netfang',
      description: 'Custodian email',
    },
    phone: {
      id: 'ss.application:userInformation.custodian.phone',
      defaultMessage: 'Símanúmer',
      description: 'Custodian phone',
    },
    addButtonLabel: {
      id: 'ss.application:userInformation.custodian.addButtonLabel',
      defaultMessage: 'Bæta við forsjáraðila',
      description: 'Custodian add button label',
    },
    removeButtonLabel: {
      id: 'ss.application:userInformation.custodian.removeButtonLabel',
      defaultMessage: 'Fjarlægja forsjáraðila',
      description: 'Custodian remove button label',
    },
  }),
  otherContact: defineMessages({
    subSectionTitle: {
      id: 'ss.application:userInformation.otherContact.subSectionTitle',
      defaultMessage: 'Tengiliður',
      description: 'Title of other contact sub section',
    },
    pageTitle: {
      id: 'ss.application:userInformation.otherContact.pageTitle',
      defaultMessage: 'Tengiliður',
      description: 'Title of other contact page',
    },
    description: {
      id: 'ss.application:userInformation.otherContact.description',
      defaultMessage:
        'Vinsamlegast farðu yfir hvort allar upplýsingar séu réttar',
      description: 'Description of other contact page',
    },
    subtitle: {
      id: 'ss.application:userInformation.otherContact.subtitle',
      defaultMessage: 'Aðrir tengiliðir',
      description: 'Other contact subtitle',
    },
    addButtonLabel: {
      id: 'ss.application:userInformation.otherContact.addButtonLabel',
      defaultMessage: 'Bæta við tengilið',
      description: 'Other contact add button label',
    },
    removeButtonLabel: {
      id: 'ss.application:userInformation.otherContact.removeButtonLabel',
      defaultMessage: 'Fjarlægja tengilið',
      description: 'Other contact remove button label',
    },
    name: {
      id: 'ss.application:userInformation.otherContact.name',
      defaultMessage: 'Fullt nafn',
      description: 'Other contact name',
    },
    nationalId: {
      id: 'ss.application:userInformation.otherContact.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Other contact national id',
    },
    email: {
      id: 'ss.application:userInformation.otherContact.email',
      defaultMessage: 'Netfang',
      description: 'Other contact email',
    },
    phone: {
      id: 'ss.application:userInformation.otherContact.phone',
      defaultMessage: 'Símanúmer',
      description: 'Other contact phone',
    },
  }),
}
