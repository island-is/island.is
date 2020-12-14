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
    id: 'hi.application:children.description',
    defaultMessage:
      'Are there any children under the age of 18 moving with you?',
    description: 'To fill in for those with children moving with them.',
  },
  statusAdditionalInformation: {
    id: 'hi.application:status.additionalInformation',
    defaultMessage: 'Confirmation of studies must be submitted',
    description: 'Drag and drop for proof of studies',
  },
  statusAndChildren: {
    id: 'hi.application:statusAndChildrend.section',
    defaultMessage: 'Status and Children',
    description: 'Applicant status and children information',
  },
  statusDescription: {
    id: 'hi.application:status.description',
    defaultMessage: 'What is you current status?',
    description: 'The current status',
  },
  statusOther: {
    id: 'hi.application:status.other',
    defaultMessage: 'Other',
    description: 'Other',
  },
  statusOtherInformation: {
    id: 'hi.application:other.information',
    defaultMessage: 'All other statuses.',
    description: 'All other statuses',
  },
  statusPensioner: {
    id: 'hi.application:status.pensioner',
    defaultMessage: 'Pensioner',
    description: 'Pensioner',
  },
  statusPensionerInformation: {
    id: 'hi.application:pensioner.information',
    defaultMessage:
      'You are reciving old age pension or disability pension from Iceland.',
    description: 'old age pension or disability pension',
  },
  statusStudent: {
    id: 'hi.application:status.student',
    defaultMessage: 'Student',
    description: 'Student',
  },
  statusStudentInformation: {
    id: 'hi.application:student.information',
    defaultMessage:
      'You moved away from Iceland for the purpose of studying abroad and are moving back to Iceland withing six months of the end of studies.',
    description: 'For the people that have studied abroad and are coming back',
  },
  yesOptionLabel: {
    id: 'hi.application:option.yes',
    defaultMessage: 'Yes',
    description: 'yes',
  },
  noOptionLabel: {
    id: 'hi.application:option.no',
    defaultMessage: 'No',
    description: 'no',
  },
  requiredAnswerError: {
    id: 'hi.application:required.answer.error',
    defaultMessage: 'You are required to answer this question!',
    description: 'You need to answer this question to continue.',
  },
  formerCountryOfInsuranceDescription: {
    id: 'hi.application:formerCountryOfInsurance.description',
    defaultMessage:
      'Were you registerd with a national health insurance insitution in your former country  of insurance?',
    description: 'former country of insurance description',
  },
  formerCountryOfInsuranceEntitlement: {
    id: 'hi.application:formerCountryOfInsurance.entitlement',
    defaultMessage:
      'Are you entitled to continued insurance in your former country of residence while living in Iceland?',
    description: 'former country of insurance entitlement',
  },
  formerCountryOfInsuranceTitle: {
    id: 'hi.application:formerCountryOfInsurance.title',
    defaultMessage: 'Former country of insurance',
    description: 'former country of insurance title',
  },
  formerCountryOfInsuranceInfo: {
    id: 'hi.application:formerCountryOfInsurance.info',
    defaultMessage:
      'Please provide the following details regarding your former country of residence.',
    description: 'former country of insurance information',
  },
  formerCountryOfInsuranceNoOption: {
    id: 'hi.application:formerCountryOfInsurance.noOption',
    defaultMessage: 'No, only private insurance or no insurance',
    description: 'former country of insurance information',
  },
  country: {
    id: 'hi.application:applicant.country',
    defaultMessage: 'Country',
    description: 'Country',
  },
  formerId: {
    id: 'hi.application:applicant.previousIdNr',
    defaultMessage: 'ID number in previous country',
    description: 'ID number in previous country',
  },
  insuranceInstitution: {
    id: 'hi.application:applicant.insuranceName',
    defaultMessage: 'Name of the health insurance institution',
    description: 'Name of the health insurance institution',
  },
})
