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
  statusAndChildren: {
    id: 'hi.application:statusAndChildrend.section',
    defaultMessage: 'Status and children',
    description: 'Status and children',
  },
  statusDescription: {
    id: 'hi.application:status.description',
    defaultMessage: 'What is you current status?',
    description: 'What is you current status?',
  },
  statusEmployed: {
    id: 'hi.application:status.employed',
    defaultMessage: 'Employed',
    description: 'Employed',
  },
  statusEmployedInformation: {
    id: 'hi.application:status.employed.information',
    defaultMessage: 'You were employed by a company or self-employed',
    description: 'Employed description',
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
      'You are receiving old age pension or disability pension from Iceland.',
    description: 'Receiving old age pension or disability pension',
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
  confirmationOfStudies: {
    id: 'hi.application:student.confirmationOfStudies',
    defaultMessage: 'Confirmation of studies must be submitted',
    description: 'Confirmation of studies must be submitted',
  },
  childrenDescription: {
    id: 'hi.application:children.description',
    defaultMessage:
      'Are there any children under the age of 18 moving with you?',
    description: 'To fill in for those with children moving with them.',
  },
  yesOptionLabel: {
    id: 'hi.application:option.yes',
    defaultMessage: 'Yes',
    description: 'Yes',
  },
  noOptionLabel: {
    id: 'hi.application:option.no',
    defaultMessage: 'No',
    description: 'No',
  },
  fileUploadHeader: {
    id: 'hi.application:fileUpload.header',
    defaultMessage: 'Drag documents here to upload',
    description: 'Drag documents here to upload',
  },
  fileUploadDescription: {
    id: 'hi.application:fileUpload.description',
    defaultMessage: 'Documents accepted with extension: .pdf, .docx, .rtf',
    description: 'Documents accepted with extension: .pdf, .docx, .rtf',
  },
  fileUploadButton: {
    id: 'hi.application:fileUpload.button',
    defaultMessage: 'Select documents to upload',
    description: 'Select documents to upload',
  },
  formerInsuranceSection: {
    id: 'hi.application:formerInsurance.section',
    defaultMessage: 'Former insurance',
    description: 'Former insurance',
  },
  formerInsuranceTitle: {
    id: 'hi.application:formerInsurance.title',
    defaultMessage: 'Former country of insurance',
    description: 'Former country of insurance',
  },
  formerInsuranceRegistration: {
    id: 'hi.application:formerInsurance.registration',
    defaultMessage:
      'Were you registerd with a national health insurance insitution in your former country  of insurance?',
    description: 'Former country insurance registration',
  },
  formerInsuranceDetails: {
    id: 'hi.application:formerInsurance.details',
    defaultMessage:
      'Please provide the following details regarding your former country of residence.',
    description: 'Former insurance details',
  },
  formerInsuranceEntitlement: {
    id: 'hi.application:formerInsurance.entitlement',
    defaultMessage:
      'Are you entitled to continued insurance in your former country of residence while living in Iceland?',
    description: 'Former insurance entitlement',
  },
  formerInsuranceNoOption: {
    id: 'hi.application:formerInsurance.noOption',
    defaultMessage: 'No, only private insurance or no insurance',
    description: 'No, only private insurance or no insurance',
  },
  formerInsuranceCountry: {
    id: 'hi.application:formerInsurance.country',
    defaultMessage: 'Country',
    description: 'Country',
  },
  formerPersonalId: {
    id: 'hi.application:formerInsurance.formerPersonalId',
    defaultMessage: 'ID number in previous country',
    description: 'ID number in previous country',
  },
  formerInsuranceInstitution: {
    id: 'hi.application:formerInsurance.instituiton',
    defaultMessage: 'Name of the health insurance institution',
    description: 'Name of the health insurance institution',
  },
  confirmationSection: {
    id: 'hi.application:confirmationSection',
    defaultMessage: 'Confirmation',
    description: 'Confirmation',
  },
  confirmationTitle: {
    id: 'hi.application:confirmationTitle',
    defaultMessage: 'Confirm and submit your application',
    description: 'Confirm and submit your application',
  },
  additionalInfo: {
    id: 'hi.application.hasAdditionalRemarks',
    defaultMessage: 'Do you have any additional information or remarks?',
    description: 'Do you have any additional information or remarks?',
  },
  additionalRemarks: {
    id: 'hi.application.additionalRemarks',
    defaultMessage: 'Remarks or additional information',
    description: 'Remarks or additional information',
  },
  additionalRemarksPlaceholder: {
    id: 'hi.application.additionalRemarks.placeholder',
    defaultMessage: 'Enter text here',
    description: 'Enter text here',
  },
  confirmCorrectInfo: {
    id: 'hi.application:confirmCorrectInfo',
    defaultMessage: 'I am ensuring that the information is true and correct',
    description: 'I am ensuring that the information is true and correct',
  },
  submitLabel: {
    id: 'hi.application:submit',
    defaultMessage: 'Submit',
    description: 'Submit',
  },
  succesfulSubmissionTitle: {
    id: 'hi.application:successfulSubmission.title',
    defaultMessage: 'We have received your application',
    description: 'We have received your application',
  },
  succesfulSubmissionMessage: {
    id: 'hi.application:successfulSubmission.message',
    defaultMessage: 'We have received your application',
    description: 'We have received your application',
  },
  missingInfoSection: {
    id: 'hi.application:missingInfo.section',
    defaultMessage: 'Missing information',
    description: 'Missing information',
  },
  agentCommentsTitle: {
    id: 'hi.application:agentComments.title',
    defaultMessage: 'Comment from Health Insurance in Iceland',
    description: 'Comment from Health Insurance in Iceland',
  },
  agentCommentsEmpty: {
    id: 'hi.application:agentComments.empty',
    defaultMessage: 'Agent did not leave any comments for you',
    description: 'Agent did not leave any comments for you',
  },
  missingInfoAnswersTitle: {
    id: 'hi.application:missingInfo.addInfo.title',
    defaultMessage: 'Your answer',
    description: 'Your answer',
  },
  previousAnswersTitle: {
    id: 'hi.application:previousInfo.title',
    defaultMessage: 'Previous answer',
    description: 'Previous answer',
  },
  attachedFilesTitle: {
    id: 'hi.application:attachedFiles.title',
    defaultMessage: 'Attached files',
    description: 'Attached files',
  },
})
