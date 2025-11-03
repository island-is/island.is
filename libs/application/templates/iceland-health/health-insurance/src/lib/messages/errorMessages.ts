import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  applicationIdMissing: {
    id: 'hi.application:error.applicationIdMissingTitle',
    defaultMessage: 'Umsóknar númer vantar',
    description: 'Application ID is missing title',
  },
  applicationIdMissingSummary: {
    id: 'hi.application:error.applicationIdMissingSummary',
    defaultMessage: 'Umsóknar númer fylgdi ekki með umsókn',
    description: 'Application ID is missing summary',
  },
  applicationIdExists: {
    id: 'hi.application:error.applicationIdExistsTitle',
    defaultMessage: 'Umsókn þegar til',
    description: 'Application ID already exists title',
  },
  applicationIdExistsSummary: {
    id: 'hi.application:error.applicationIdExistsSummary',
    defaultMessage: 'Umsókn með þetta númer er þegar til',
    description: 'Application ID already exists summary',
  },
  applicationDateInFuture: {
    id: 'hi.application:error.applicationDateInFutureTitle',
    defaultMessage: 'Röng dagsetning',
    description: 'Application date is in the future title',
  },
  applicationDateInFutureSummary: {
    id: 'hi.application:error.applicationDateInFutureSummary',
    defaultMessage: 'Dagsetning umsóknar má ekki vera fram í tímann',
    description: 'Application date is in the future summary',
  },
  applicationNationalIdNotFound: {
    id: 'hi.application:error.applicationNationalIdNotFoundTitle',
    defaultMessage: 'Kennitala fannst ekki',
    description: 'Application national ID not found title',
  },
  applicationNationalIdNotFoundSummary: {
    id: 'hi.application:error.applicationNationalIdNotFoundSummary',
    defaultMessage: 'Kennitala fannst ekki í þjóðskrá',
    description: 'Application national ID not found summary',
  },
  applicantDeceased: {
    id: 'hi.application:error.applicantDeceasedTitle',
    defaultMessage: 'Umsækjandi er skráður látinn',
    description: 'Applicant deceased title',
  },
  applicantDeceasedSummary: {
    id: 'hi.application:error.applicantDeceasedSummary',
    defaultMessage:
      'Einstaklingur með þessa kennitölu er skráður látinn í þjóðskrá miðað við dagsetningu umsóknar.',
    description: 'Applicant deceased summary',
  },
  applicantAlreadyInsured: {
    id: 'hi.application:error.applicantAlreadyInsuredTitle',
    defaultMessage: 'Umsækjandi er skráður sjúkratryggður',
    description: 'Applicant already insured title',
  },
  applicantAlreadyInsuredSummary: {
    id: 'hi.application:error.applicantAlreadyInsuredSummary',
    defaultMessage:
      'Ekki er hægt að sækja um fyrir umsækjendur sem eru skráðir sjúkratryggðir nú þegar',
    description: 'Applicant already insured summary',
  },
  applicantHasActiveApplication: {
    id: 'hi.application:error.applicantHasActiveApplicationTitle',
    defaultMessage: 'Umsókn þegar í ferli',
    description: 'Applicant has active application title',
  },
  applicantHasActiveApplicationSummary: {
    id: 'hi.application:error.applicantHasActiveApplicationSummary',
    defaultMessage:
      'Einstaklingur með þessa kennitölu á til skráða umsókn fyrir sjúkratryggingu sem er í vinnslu.',
    description: 'Applicant has active application summary',
  },
  applicationEncodingWrong: {
    id: 'hi.application:error.applicationEncodingWrongTitle',
    defaultMessage: 'Umsókn send inn á röngu formi',
    description: 'Application encoding wrong title',
  },
  applicationEncodingWrongSummary: {
    id: 'hi.application:error.applicationEncodingWrongSummary',
    defaultMessage:
      'Umsóknin er ekki í réttu sniði, vinsamlegast hafðu samband við notendaþjónustu island.is',
    description: 'Application encoding wrong summary',
  },
  applicantStudentAttachmentMissing: {
    id: 'hi.application:error.applicantStudentAttachmentMissingTitle',
    defaultMessage: 'Skjöl nemanda vantar',
    description: 'Applicant student attachment missing title',
  },
  applicantStudentAttachmentMissingSummary: {
    id: 'hi.application:error.applicantStudentAttachmentMissingSummary',
    defaultMessage: 'Ekki er hægt að sækja um fyrir aðila skráða sem nemendur ',
    description: 'Applicant student attachment missing summary',
  },
  defaultTemplateApiError: {
    id: 'hi.application:error.defaultTemplateApiErrorTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Default template api error title',
  },
  defaultTemplateApiErrorSummary: {
    id: 'hi.application:error.defaultTemplateApiErrorSummary',
    defaultMessage:
      'Vinsamlegast hafið samband við þjónustumiðstöð Sjúkratrygginga',
    description: 'Default template api error summary',
  },
})
