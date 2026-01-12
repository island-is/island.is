import { defineMessages } from 'react-intl'

export const error = defineMessages({
  missingSignature: {
    id: 'ojoi.application:error.missingSignature',
    defaultMessage: 'Undirritun vantar',
    description: 'Error message when signature is missing',
  },
  fetchCommentsFailedTitle: {
    id: 'ojoi.application:error.fetchCommentsFailedTitle',
    defaultMessage: 'Ekki tókst að sækja athugasemdir',
    description: 'Error message when fetching comments fails',
  },
  fetchCommentsFailedMessage: {
    id: 'ojoi.application:error.fetchCommentsFailedMessage',
    defaultMessage:
      'Villa kom upp við að sækja athugasemdir, reyndu aftur síðar',
    description: 'Error message when fetching comments fails',
  },
  fetchAdvertFailed: {
    id: 'ojoi.application:error.fetchAdvertFailed',
    defaultMessage: 'Ekki tókst að sækja auglýsingu',
    description: 'Error message when fetching advert fails',
  },
  fetchAdvertFailedMessage: {
    id: 'ojoi.application:error.fetchAdvertFailedMessage',
    defaultMessage: 'Villa kom upp við að sækja auglýsingu, reyndu aftur síðar',
    description: 'Error message when fetching advert fails',
  },
  fetchApplicationFailedTitle: {
    id: 'ojoi.application:error.fetchApplicationFailedTitle',
    defaultMessage: 'Ekki tókst að sækja umsókn',
    description: 'Error message when fetching application fails',
  },
  fetchApplicationFailedMessage: {
    id: 'ojoi.application:error.fetchApplicationFailedMessage',
    defaultMessage: 'Villa kom upp við að sækja umsókn, reyndu aftur síðar',
    description: 'Error message when fetching application fails',
  },
  missingChairmanName: {
    id: 'ojoi.application:error.missingChairmanName',
    defaultMessage: 'Nafn formanns vantar',
    description: 'Error message when chairman name is missing',
  },
  missingCommitteeMemberName: {
    id: 'ojoi.application:error.missingCommitteeMemberName',
    defaultMessage: 'Nafn nefndarmanns vantar',
    description: 'Error message when committee member name is missing',
  },
  missingSignatureInstitution: {
    id: 'ojoi.application:error.missingSignatureInstitution',
    defaultMessage: 'Nafn stofnunar vantar',
    description: 'Error message when signature institution is missing',
  },
  missingSignatureDate: {
    id: 'ojoi.application:error.missingSignatureDate',
    defaultMessage: 'Dagsetning undirskriftar vantar',
    description: 'Error message when signature date is missing',
  },
  missingSignatureType: {
    id: 'ojoi.application:error.missingSignatureType',
    defaultMessage: 'Tegund undirskriftar vantar',
    description: 'Error message when signature type is missing',
  },
  missingFieldsTitle: {
    id: 'ojoi.application:error.missingFieldsTitle',
    defaultMessage: 'Fylla þarf út eftirfarandi reiti í {x}',
    description: 'Error message when fields are missing',
  },
  missingFieldsAny: {
    id: 'ojoi.application:error.missingFieldsAny',
    defaultMessage: 'Fylla þarf út eftirfarandi reiti',
    description: 'Error message when fields are missing',
  },
  missingSignatureFieldsMessage: {
    id: 'ojoi.application:error.missingSignatureFieldsMessage',
    defaultMessage: '(Undirritunarkafli er hluti {x})',
    description: 'Error message when signature fields are missing',
  },
  noSignatureMembers: {
    id: 'ojoi.application:error.noSignatureMembers',
    defaultMessage: 'Engin undirskriftarmenn valdir',
    description: 'Error message when no signature members are selected',
  },
  missingSignatureMember: {
    id: 'ojoi.application:error.missingSignatureMember',
    defaultMessage: 'Nafn undirritara vantar',
    description: 'Error message when signature member is missing',
  },
  noCategorySelected: {
    id: 'ojoi.application:error.noCategorySelected',
    defaultMessage: 'Enginn efnisflokkur valinn, vinsamlegast veldu efnisflokk',
    description: 'Error message when no category is selected',
  },
  missingPreviewType: {
    id: 'ojoi.application:error.missingPreviewType',
    defaultMessage: 'Tegund auglýsingar',
    description: 'Error message when type is missing',
  },
  missingPreviewDepartment: {
    id: 'ojoi.application:error.missingPreviewDepartment',
    defaultMessage: 'Deild',
    description: 'Error message when department is missing',
  },
  missingPreviewTitle: {
    id: 'ojoi.application:error.missingPreviewTitle',
    defaultMessage: 'Heiti auglýsingar',
    description: 'Error message when title is missing',
  },
  missingPreviewHtml: {
    id: 'ojoi.application:error.missingPreviewHtml',
    defaultMessage: 'Meginmál auglýsingar',
    description: 'Error message when html is missing',
  },
  missingType: {
    id: 'ojoi.application:error.missingType',
    defaultMessage: 'Velja þarf tegund auglýsingar',
    description: 'Error message when type is missing',
  },
  missingDepartment: {
    id: 'ojoi.application:error.missingDepartment',
    defaultMessage: 'Velja þarf deild auglýsingar',
    description: 'Error message when department is missing',
  },
  missingTitle: {
    id: 'ojoi.application:error.missingTitle',
    defaultMessage: 'Fylla þarf út titill auglýsingar',
    description: 'Error message when title is missing',
  },
  missingHtml: {
    id: 'ojoi.application:error.missingHtml',
    defaultMessage: 'Meginmál auglýsingar má ekki vera autt',
    description: 'Error message when html is missing',
  },
  missingHtmlMessage: {
    id: 'ojoi.application:error.missingHtmlMessage',
    defaultMessage: 'Innsending samanstendur af eftirfarandi reitum',
    description: 'Error message when html is missing',
  },
  missingRequestedDate: {
    id: 'ojoi.application:error.missingRequestedDate',
    defaultMessage: 'Útgáfudagsetning má ekki vera tóm',
    description: 'Error message when requested date is missing',
  },
  dateBeforeToday: {
    id: 'ojoi.application:error.dateBeforeToday',
    defaultMessage: 'Þessi birtingardagsetning er ekki leyfileg',
    description: 'Error message when requested date is not valid',
  },
  applicationValidationError: {
    id: 'ojoi.application:error.applicationValidationError',
    defaultMessage: 'Umsókn er ekki rétt útfyllt',
    description: 'Error message when application is not valid',
  },
  signaturesValidationError: {
    id: 'ojoi.application:error.signaturesValidationError',
    defaultMessage: 'Undirskriftir eru ekki réttar',
    description: 'Error message when signatures are not valid',
  },
  dataSubmissionErrorTitle: {
    id: 'ojoi.application:error.dataSubmissionErrorTitle',
    defaultMessage: 'Villa kom upp við vistun gagna',
    description: 'Error message when data is not submitted',
  },
  fetchXFailedTitle: {
    id: 'ojoi.application:error.fetchXFailedTitle',
    defaultMessage: 'Ekki tókst að sækja {x}',
    description: 'Error message when fetching x fails',
  },
  fetchXFailedMessage: {
    id: 'ojoi.application:error.fetchXFailedMessage',
    defaultMessage: 'Villa kom upp við að sækja {x}',
    description: 'Error message when fetching x fails',
  },
  fetchFailedTitle: {
    id: 'ojoi.application:error.fetchFailedTitle',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Error message when fetching fails',
  },
  fetchFailedMessage: {
    id: 'ojoi.application:error.fetchFailedMessage',
    defaultMessage: 'Villa kom upp við að sækja gögn',
    description: 'Error message when fetching fails',
  },
  xIsNotValid: {
    id: 'ojoi.application:error.xIsNotValid',
    defaultMessage: '{x} er ekki gilt',
    description: 'Error message when x is not valid',
  },
  xAlreadyExists: {
    id: 'ojoi.application:error.xAlreadyExists',
    defaultMessage: '{x} er þegar til',
    description: 'Error message when x already exists',
  },
  emptyFieldError: {
    id: 'ojoi.application:error.emptyFieldError',
    defaultMessage: 'Þessi reitur má ekki vera tómur',
    description: 'Error message when field is empty',
  },
  dataGathering: {
    id: 'ojoi.application:error.dataGathering',
    defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
    description: 'Error message when data gathering is not approved',
  },
  radioErrorMessage: {
    id: 'ojoi.application:section.radioErrorMessage',
    defaultMessage: 'Þú þarft að velja einn valmöguleika',
    description: 'Error message when no option is selected',
  },
  inputErrorMessage: {
    id: 'ojoi.application:section.inputErrorMessage',
    defaultMessage: 'Þú þarft að skrifa í textareitinn',
    description: 'Error message when input is empty',
  },
  email: {
    id: 'ojoi.application:error.email',
    defaultMessage: 'Athugaðu hvort netfang sé rétt slegið inn',
    description: 'Error message when email is invalid or not present',
  },
  phone: {
    id: 'ojoi.application:error.phone',
    defaultMessage: 'Athugaðu hvort símanúmer sé rétt slegið inn',
    description: 'Error message when phone is invalid or not present',
  },
  datePicker: {
    id: 'ojoi.application:error.datePicker',
    defaultMessage: 'Vinsamlegast veldu dagsetningu',
    description: 'Error message when date is invalid or not present',
  },
  emptyChannel: {
    id: 'ojoi.application:error.emptyChannel',
    defaultMessage:
      'Samskiptaleið þarf að innihalda að minnstakosti einn aðila',
    description: 'Error message when channel is empty',
  },
  invalidChannel: {
    id: 'ojoi.application:error.invalidChannel',
    defaultMessage: 'Samskiptaleið þarf að vera með gilt netfang',
    description: 'Error message when channel is invalid',
  },
  invalidDate: {
    id: 'ojoi.application:error.invalidDate',
    defaultMessage: 'Athugaðu hvort dagsetning sé rétt slegin inn',
    description: 'Error message when date is invalid',
  },
  invalidMinsitry: {
    id: 'ojoi.application:error.invalidMinsitry',
    defaultMessage: 'Ráðuneyti er óþekkt',
    description: 'Error message when ministry is invalid',
  },
  submitApplicationFailedTitle: {
    id: 'ojoi.application:error.submitApplicationFailedTitle',
    defaultMessage: 'Athugið',
    description: 'Error message when submit application fails',
  },
  submitApplicationFailedMessage: {
    id: 'ojoi.application:error.submitApplicationFailedMessage',
    defaultMessage: 'Ekki tókst að senda umsókn',
    description: 'Error message when submit application fails',
  },
  noResults: {
    id: 'ojoi.application:error.noResults',
    defaultMessage: 'Engar niðurstöður fundust',
    description: 'Error message when no results are found',
  },
})
