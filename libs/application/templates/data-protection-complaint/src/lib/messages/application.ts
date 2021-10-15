import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'dpac.application:application.name',
    defaultMessage: 'Kvörtun til Persónuverndar',
    description: 'Name of the Data Protection Authority Complaint application',
  },
  institutionName: {
    id: 'dpac.application:application.institutionName',
    defaultMessage: 'Persónuvernd',
    description: 'Name of the Data Protection Authority',
  },
})

// All sections in the application
export const section = defineMessages({
  externalData: {
    id: 'dpac.application:section.externalData',
    defaultMessage: 'Gagnaöflun',
    description: 'Approval of external data gathering',
  },
  delimitation: {
    id: 'dpac.application:section.delimitation',
    defaultMessage: 'Afmörkun kvörtunar',
    description: 'Delimitation of the complaint',
  },
  authorities: {
    id: 'dpac.application:section.authorities',
    defaultMessage: 'Stjórnvöld',
    description: 'Is the complaint being handles by the authorities',
  },
  media: {
    id: 'dpac.application:section.media',
    defaultMessage: 'Fjölmiðlar',
    description: 'Complaint regards media coverage',
  },
  banMarking: {
    id: 'dpac.application:section.banMarking',
    defaultMessage: 'Bannmerking',
    description: 'Complaint regards ban marking in the phone book',
  },
  libel: {
    id: 'dpac.application:section.libel',
    defaultMessage: 'Meiðyrði',
    description: 'Complaint regards libel',
  },
  personalDataConflict: {
    id: 'dpac.application:section.personalDataConflict',
    defaultMessage: 'Meðhöndlun gagna',
    description: 'Complaint regards personal data conflict',
  },
  agreement: {
    id: 'dpac.application:section.agreement',
    defaultMessage: 'Samþykki',
    description: 'Agreement section title',
  },
  info: {
    id: 'dpac.application:section.info',
    defaultMessage: 'Upplýsingar',
    description: 'Info',
  },
  onBehalf: {
    id: 'dpac.application:section.onBehalf',
    defaultMessage: 'Fyrir hvern',
    description: 'Details about on behalf of whom the complaint is registered',
  },
  applicant: {
    id: 'dpac.application:section.applicant',
    defaultMessage: 'Upplýsingar um þig',
    description: 'Details about the applicant',
  },
  organizationOrInstitution: {
    id: 'dpac.application:section.organizationOrInstitution',
    defaultMessage: 'Félagasamtök / stofnun',
    description: 'Details about the organizationOrInstitution',
  },
  commissions: {
    id: 'dpac.application:section.commissions',
    defaultMessage: 'Upplýsingar umboðsaðila',
    description: 'Details about the commissionees',
  },
  complaint: {
    id: 'dpac.application:section.complaint',
    defaultMessage: 'Kvörtun',
    description: 'Complaint',
  },
  complainee: {
    id: 'dpac.application:section.complainee',
    defaultMessage: 'Sá sem er kvartað yfir',
    description: 'The one who is being complained about',
  },
  subjectOfComplaint: {
    id: 'dpac.application:section.subjectOfComplaint',
    defaultMessage: 'Efni kvörtunar',
    description: 'The subject of the complaint',
  },
  overview: {
    id: 'dpac.application:section.overview',
    defaultMessage: 'Yfirlit og samþykki',
    description: 'Overview and approval',
  },
  received: {
    id: 'dpac.application:section.received',
    defaultMessage: 'Staðfesting',
    description: 'Application Received',
  },
})

export const sharedFields = defineMessages({
  moreInfoButtonLabel: {
    id: 'dpac.application:sharedFields.moreInfoButtonLabel',
    defaultMessage: 'Nánari upplýsingar hér',
    description: 'More Info Button Label',
  },
  yes: {
    id: 'dpac.application:sharedFields.yes',
    defaultMessage: 'Já',
    description: 'Used to give an affirmative response',
  },
  no: {
    id: 'dpac.application:sharedFields.no',
    defaultMessage: 'Nei',
    description: 'Used to give a negative response',
  },
  edit: {
    id: 'dpac.application:sharedFields.edit',
    defaultMessage: 'Breyta',
    description: 'Edit',
  },
  remove: {
    id: 'dpac.application:sharedFields.remove',
    defaultMessage: 'Eyða',
    description: 'Remove',
  },
  word: {
    id: 'dpac.application:sharedFields.word',
    defaultMessage: 'orð',
    description: 'Words',
  },
})
