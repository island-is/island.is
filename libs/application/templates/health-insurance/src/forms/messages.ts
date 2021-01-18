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
      'Registers Iceland is the Icelandic State’s base registry. It records certain basic information on all persons who are or have been domiciled in Iceland and Icelandic citizens residing abroad, as well as any changes to their status.',
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
    description: 'About Directorate of Labor data retrieval',
  },
  internalRevenueTitle: {
    id: 'hi.application:externalData.internalRevenue.title',
    defaultMessage: 'Directorate of Internal Revenue',
    description: 'Directorate of Internal Revenue',
  },
  internalRevenueSubTitle: {
    id: 'hi.application:externalData.internalRevenue.subtitle',
    defaultMessage:
      'Handles the collection of taxes and duties as well as oversees the legitimacy of tax returns. The Directorate of Internal Revenue also plays a multifaceted customs role at the border and provides society with protection against illegal import and export of goods.',
    description: 'About Directorate of Internal Revenue data retrieval',
  },
  confirmationOfResidencyTitle: {
    id: 'hi.application:confirmationOfResidency.title',
    defaultMessage: 'Confirmation of residency',
    description: 'Confirmation of residency',
  },
  confirmationOfResidencyDescription: {
    id: 'hi.application:confirmationOfResidency.description',
    defaultMessage:
      'According to Registers Iceland’s data it seems like you are moving to Iceland from Greenland or the Faroe Islands. To apply for the national health insurance, you need to provide a confirmation of residency from Greenland or the Faroe Islands.',
    description:
      'Instructions for when moving from Greenland or the Faroe Isalnds',
  },
  confirmationOfResidencyFileUpload: {
    id: 'hi.application:confirmationOfResidency.fileUpload',
    defaultMessage: 'Please add your confirmation of residency',
    description: 'Please add your confirmation of residency',
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
      'Please edit if not correct. Updating your contact info will change it for all of island.is',
    description: 'About changing digital island data',
  },
  statusAndChildren: {
    id: 'hi.application:statusAndChildrend.section',
    defaultMessage: 'Status and children',
    description: 'Status and children',
  },
  statusDescription: {
    id: 'hi.application:status.description',
    defaultMessage: 'Status in former country of insurance?',
    description: 'Status in former country of insurance?',
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
    defaultMessage: 'All other statuses',
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
      'You are receiving old age pension or disability pension from Iceland',
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
      'You moved away from Iceland for the purpose of studying abroad and are moving back to Iceland within six months of the end of studies',
    description: 'For the people that have studied abroad and are coming back',
  },
  confirmationOfStudies: {
    id: 'hi.application:student.confirmationOfStudies',
    defaultMessage: 'Confirmation of studies must be submitted',
    description: 'Confirmation of studies must be submitted',
  },
  confirmationOfStudiesTooltip: {
    id: 'hi.application:student.confirmationOfStudies',
    defaultMessage:
      'You need to submit a copy of your Graduation certificate or a confirmation of completed credits for each semester. ' +
      'Admission or enrollement letters are not sufficient.',
    description: 'Confirmation of studies must be submitted, tooltip',
  },
  childrenDescription: {
    id: 'hi.application:children.description',
    defaultMessage:
      'Are there any children under the age of 18 moving to Iceland with you?',
    description: 'To fill in for those with children moving with them.',
  },
  childrenInfoMessageTitle: {
    id: 'hi.application:children.infoMessageTitle',
    defaultMessage: 'Health insurance for children',
    description: 'Health insurance for children info title',
  },
  childrenInfoMessageText: {
    id: 'hi.application:children.infoMessageText',
    defaultMessage:
      'Any children registered to you will automatically get health insurance once you get insured.',
    description:
      'additional information for the people that bring children under 18 with them to iceland',
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
    defaultMessage: 'Drag & drop your files here',
    description: 'Drag & drop your files here',
  },
  fileUploadDescription: {
    id: 'hi.application:fileUpload.description',
    defaultMessage: 'Accepted documents: .pdf, .docx, .rtf',
    description: 'Accepted document types',
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
      'Were you registered with a national health insurance institution in your former country of insurance?',
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
  formerInsuranceEntitlementTooltip: {
    id: 'hi.application:formerInsurance.entitlement',
    defaultMessage:
      'Most likely yes if you are still employed/receiving unemployment benefits, pension, benefits in cash or paternity/maternity benefits from your former country of insurance.',
    description: 'Former insurance entitlement tooltip',
  },
  formerInsuranceAdditionalInformation: {
    id: 'hi.application:formerInsurance.additionalInformation',
    defaultMessage: 'Please explain why',
    description: 'Former insurance additional information on entitlement',
  },
  formerInsuranceAdditionalInformationPlaceholder: {
    id: 'hi.application:formerInsurance.additionalInformationPlaceholder',
    defaultMessage: 'I´m still entitled to health insurance because...',
    description: 'Additional information placeholder',
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
    defaultMessage: 'Additional information or remarks',
    description: 'Remarks or additional information',
  },
  additionalRemarksPlaceholder: {
    id: 'hi.application.additionalRemarks.placeholder',
    defaultMessage: 'Enter your text here',
    description: 'Enter your text here',
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
  successfulSubmissionTitle: {
    id: 'hi.application:successfulSubmission.title',
    defaultMessage: 'We have received your application',
    description: 'We have received your application',
  },
  successfulSubmissionMissingInfoTitle: {
    id: 'hi.application:successfulSubmission.missingInfoTitle',
    defaultMessage: 'We have received your answer!',
    description: 'We have received your answer!',
  },
  successfulSubmissionMessage: {
    id: 'hi.application:successfulSubmission.message',
    defaultMessage:
      'Your application number is **{applicationNumber}**. A confirmation e-mail has also been sent. ',
    description: 'Application number and confirmation',
  },
  nextStepReviewTime: {
    id: 'hi.application:nextStep.duration',
    defaultMessage:
      'An application may take up to 2–6 weeks to process. Depending on how fast your former country of insurance to responds to our request, it could take a longer.',
    description: 'Estimated review time of the application',
  },
  nextStepStatusCheck: {
    id: 'hi.application:nextStep.currentStatus',
    defaultMessage:
      'You can always see the current status of your application in My Pages.',
    description:
      'You can always see the current status of your application in My Pages.',
  },
  missingInfoSection: {
    id: 'hi.application:missingInfo.section',
    defaultMessage: 'Missing information',
    description: 'Missing information',
  },
  agentCommentsTitle: {
    id: 'hi.application:agentComments.title',
    defaultMessage: 'Comment from the Icelandic Health Insurance',
    description: 'Comment from the Icelandic Health Insurance',
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
  waitingPeriodTitle: {
    id: 'hi.application:waitingPeriod.title',
    defaultMessage: 'Waiting period',
    description: 'Waiting Period',
  },
  waitingPeriodDescription: {
    id: 'hi.application:waitingPeriod.description',
    defaultMessage: 'According to Registers Iceland data it seems like you are not moving to Iceland from an EU/EEA country, Switzerland, Greenland or the Faroe Islands. There is a six-month waiting period before qualifying. We advise you to buy private health insurance until you are covered by the national health insurance. There are some Medical exceptions.',
    description: 'Waiting period description',
  },
  waitingPeriodButtonText: {
    id: 'hi.application:waitingPeriod.buttonText',
    defaultMessage: 'Read more',
    description: 'Read More',
  },
  registerYourselfTitle: {
    id: 'hi.application:registerYourself.title',
    defaultMessage: 'Register yourself in Iceland',
    description: 'Register yourself in Iceland'
  },
  registerYourselfDescription: {
    id: 'hi.application:registerYourself.description',
    defaultMessage: 'You don’t seem to be registered with Registers Iceland. You need to register your legal residence in Iceland before applying for national health insurance.',
    description: 'Register yourself description'
  },
  registerYourselfButtonText: {
    id: 'hi.application:registerYourself.buttonText',
    defaultMessage: 'How to register',
    description: 'How to register'
  },
  activeApplicationTitle: {
    id: 'hi.application.activeApplication.title',
    defaultMessage: 'Active application',
    description: 'Active application',
  },
  activeApplicationDescription: {
    id: 'hi.application.activeApplication.description',
    defaultMessage: 'You have already submitted an application for health insurance. We will notify you on the e-mail address you provided in the application when the status changes. You can always see your application status in My Pages.',
    description: 'Active application description',
  },
  activeApplicationButtonText: {
    id: 'hi.application.activeApplication.buttonText',
    defaultMessage: 'See status',
    description: 'See status',
  },
})
