import { defineMessages } from 'react-intl'

export const m = defineMessages({
  formTitle: {
    id: 'hi.application:title',
    defaultMessage: 'Apply for health insurance',
    description: 'Apply for health insurance',
  },
  applicantInfoSection: {
    id: 'hi.application:applicant.section',
    defaultMessage: 'Your contact information',
    description: 'Applicant contact information',
  },
  externalDataTitle: {
    id: 'hi.application:externalData.title',
    defaultMessage: 'Information retrieval',
    description: 'External data',
  },
  nationalRegistryTitle: {
    id: 'hi.application:externalData.nationalRegistry.title',
    defaultMessage: 'Registers Iceland',
    description: 'Registers Iceland',
  },
  nationalRegistrySubTitle: {
    id: 'hi.application:externalData.nationalRegistry.subtitle',
    defaultMessage:
      'Registers Iceland is the Icelandic State’s base registry. It records certain basic information on all persons who are or have been domiciled in Iceland and Icelandic citizens residing abroad, as well as changes to their status.',
    description: 'About Registers Iceland data retrieval',
  },
  directorateOfLaborTitle: {
    id: 'hi.application:externalData.directorateOfLabor.title',
    defaultMessage: 'Directorate of Labor',
    description: 'Directorate of Labor',
  },
  directorateOfLaborSubTitle: {
    id: 'hi.application:externalData.directorateOfLabor.subtitle',
    defaultMessage:
      'The Directorate of Labour bears overall responsibility for public labour exchanges and handles day-to-day operations of the Unemployment Insurance Fund, the Maternity and Paternity Leave Fund and the Wage Guarantee Fund.',
    description: 'Aboout Directorate of Labor data retrieval',
  },
  internalRevenueTitle: {
    id: 'hi.application:externalData.internalRevenue.title',
    defaultMessage: 'RSK Directorate of Internal Revenue',
    description: 'RSK Directorate of Internal Revenue',
  },
  internalRevenueSubTitle: {
    id: 'hi.application:externalData.internalRevenue.subtitle',
    defaultMessage:
      'Handles the collection of taxes and duties as well as oversees the legitimacy of tax returns. The Directorate of Internal Revenue also plays a multifaceted customs role at the border and provides society with protection against illegal import and export of goods.',
    description: 'About RSK Directorate of Internal Revenue data retrieval',
  },
  contactInfoTitle: {
    id: 'hi.application:contactInfo.title',
    defaultMessage: 'Confirm your contact information',
    description: 'Confirm your contact information',
  },
  name: {
    id: 'hi.application:applicant.name',
    defaultMessage: 'Full name',
    description: 'Full name',
  },
  nationalId: {
    id: 'hi.application:applicant.nationalId',
    defaultMessage: 'Icelandic ID number',
    description: 'Icelandic ID number',
  },
  address: {
    id: 'hi.application:applicant.address',
    defaultMessage: 'Address',
    description: 'Address',
  },
  postalCode: {
    id: 'hi.application:applicant.postalCode',
    defaultMessage: 'Postal code',
    description: 'Postal code',
  },
  city: {
    id: 'hi.application:applicant.city',
    defaultMessage: 'City',
    description: 'City',
  },
  nationality: {
    id: 'hi.application:applicant.nationality',
    defaultMessage: 'Nationality',
    description: 'Nationality',
  },
  editNationalRegistryData: {
    id: 'hi.application:nationalRegistryData.edit',
    defaultMessage:
      'Need to update your address? Go to **[Change of Address](https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/)**',
    description: 'About changing national registry data',
  },
  email: {
    id: 'hi.application:applicant.email',
    defaultMessage: 'E-mail',
    description: 'E-mail',
  },
  phoneNumber: {
    id: 'hi.application:applicant.phoneNumber',
    defaultMessage: 'Phone number',
    description: 'Phone number',
  },
  editDigitalIslandData: {
    id: 'hi.application:digitalIslandData.edit',
    defaultMessage:
      'Please edit if not correct. This will update your contact info for all of island.is ',
    description: 'About changing digital island data',
  },
  childrenDescription: {
    id: 'pl.application:children.description',
    defaultMessage:
      'Are there any children under the age of 18 moving with you?',
    description: 'some description',
  },
  statusAdditionalInformation: {
    id: 'pl.application:status.additionalInformation',
    defaultMessage: 'Confirmation of studies must be submitted',
    description: 'Drag and drop for proof of studies',
  },
  statusAndChildren: {
    id: 'pl.application:applicant.section',
    defaultMessage: 'Status and Children',
    description: 'Applicant status and children information',
  },
  statusDescription: {
    id: 'pl.application:status.description',
    defaultMessage: 'What is you current status?',
    description: 'Some description',
  },
  statusOther: {
    id: 'pl.application:status.other',
    defaultMessage: 'Other',
    description: 'Some description',
  },
  statusOtherInformation: {
    id: 'pl.application:other.information',
    defaultMessage: 'All other statuses.',
    description: 'Some description',
  },
  statusPensioner: {
    id: 'pl.application:status.pensioner',
    defaultMessage: 'Pensioner',
    description: 'Some description',
  },
  statusPensionerInformation: {
    id: 'pl.application:pensioner.information',
    defaultMessage:
      'You are reciving old age pension or disability pension from Iceland.',
    description: 'Some description',
  },
  statusStudent: {
    id: 'pl.application:status.student',
    defaultMessage: 'Student',
    description: 'Some description',
  },
  statusStudentInformation: {
    id: 'pl.application:student.information',
    defaultMessage:
      'You moved away from Iceland for the purpose of studying abroad and are moving back to Iceland withing six months of the end of studies.',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'pl.application:children.yes',
    defaultMessage: 'Yes',
    description: 'some description',
  },
  noOptionLabel: {
    id: 'pl.application:children.no',
    defaultMessage: 'No',
    description: 'some description',
  },
  requiredAnswerError: {
    id: 'pl.application:required.answer.error',
    defaultMessage: 'You are required to answer this question!',
    description: 'You need to answer this question to continue.',
  },
})
