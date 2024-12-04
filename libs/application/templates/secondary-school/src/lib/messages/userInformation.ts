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
  otherAddress: defineMessages({
    subtitle: {
      id: 'ss.application:userInformation.otherAddress.subtitle',
      defaultMessage: 'Dvalarstaður ef annar en lögheimili',
      description: 'Other address subtitle',
    },
    address: {
      id: 'ss.application:userInformation.otherAddress.address',
      defaultMessage: 'Heimilisfang',
      description: 'Other address address',
    },
    postalCode: {
      id: 'ss.application:userInformation.otherAddress.postalCode',
      defaultMessage: 'Póstnúmer og sveitarfélag',
      description: 'Other address postal code',
    },
  }),
  applicationType: defineMessages({
    subtitle: {
      id: 'ss.application:userInformation.applicationType.subtitle',
      defaultMessage: 'Núverandi staða umsækjanda',
      description: 'Application typa subtitle',
    },
    freshmanOptionTitle: {
      id: 'ss.application:userInformation.applicationType.freshmanOptionTitle',
      defaultMessage: 'Nýnemi að koma úr 10. bekk',
      description: 'Freshman option title',
    },
    generalApplicationOptionTitle: {
      id: 'ss.application:userInformation.applicationType.generalApplicationOptionTitle',
      defaultMessage: 'Almenn umsókn',
      description: 'General application option title',
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
    subtitle1: {
      id: 'ss.application:userInformation.custodian.subtitle1',
      defaultMessage: 'Forsjáraðili 1',
      description: 'Custodian 1 subtitle',
    },
    subtitle2: {
      id: 'ss.application:userInformation.custodian.subtitle2',
      defaultMessage: 'Forsjáraðili 2',
      description: 'Custodian 1 subtitle',
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
      defaultMessage: 'Póstnúmer og staður',
      description: 'Custodian postal code',
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
  }),
  otherContact: defineMessages({
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
  supportingDocuments: defineMessages({
    subSectionTitle: {
      id: 'ss.application:userInformation.supportingDocuments.subSectionTitle',
      defaultMessage: 'Fylgigögn',
      description: 'Title of supporting documents sub section',
    },
    pageTitle: {
      id: 'ss.application:userInformation.supportingDocuments.pageTitle',
      defaultMessage: 'Fylgigögn',
      description: 'Title of supporting documents page',
    },
    description: {
      id: 'ss.application:userInformation.supportingDocuments.description',
      defaultMessage:
        'Þú getur hengt hér inn skjöl eins og staðfestingu sérfræðings á greiningu t.d. vegna sértækra námsörðugleika (ekki mælt með að láta full greiningargögn fylgja með fyrr en ef skóli biður um þau þegar umsókn hefur verið samþykkt), meðmæli eða annað það sem þú vilt að fylgi umsókninni. Ef þú hefur ekki tök á að setja skjöl rafrænt hér inn getur þú sent þau í pósti til þeirra skóla sem sótt er um.',
      description: 'Description of supporting documents page',
    },
    fileUploadHeader: {
      id: 'ss.application:userInformation.supportingDocuments.fileUploadHeader',
      defaultMessage: 'Viðhengi',
      description: 'File upload title',
    },
    fileUploadDescription: {
      id: 'ss.application:userInformation.supportingDocuments.fileUploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'File upload title',
    },
    fileUploadButtonLabel: {
      id: 'ss.application:userInformation.supportingDocuments.fileUploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'File upload title',
    },
  }),
}
