import { defineMessages } from 'react-intl'

export const prereq = defineMessages({
  title: {
    id: 'vmst.vsd.application:prereq.title',
    defaultMessage: 'Vinnumálastofnun',
    description: 'Prerequisite service provider title',
  },
  subtitle: {
    id: 'vmst.vsd.application:prereq.subtitle',
    defaultMessage: 'Gögn sótt til Vinnumálastofnunar',
    description: 'Prerequisite service provider subtitle',
  },
  checkbox: {
    id: 'vmst.vsd.application:prereq.checkbox',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'Prerequisite checkbox text',
  },
})

export const uploadDocuments = defineMessages({
  title: {
    id: 'vmst.vsd.application:uploadDocuments.title',
    defaultMessage: 'Skila gögnum',
    description: 'Upload documents title',
  },
  multiFieldDescription: {
    id: 'vmst.vsd.application:uploadDocuments.multiFieldDescription',
    defaultMessage:
      'Vinsamlegast skilaðu þeim gögnum sem vantar upp á hér að neðan. Hægt er að hlaða upp einu í einu en þú getur bætt við línu ef þú ætlar að skila fleiri gögnum í einu.',
    description: 'Upload documents description',
  },
  sectionStepTitle: {
    id: 'vmst.vsd.application:uploadDocuments.sectionStepTitle',
    defaultMessage: 'Hlaða upp gögnum',
    description: 'Upload documents section step title',
  },
  typeLabel: {
    id: 'vmst.vsd.application:uploadDocuments.typeLabel',
    defaultMessage: 'Tegund gagna',
    description: 'Label for document type select',
  },
  fileLabel: {
    id: 'vmst.vsd.application:uploadDocuments.fileLabel',
    defaultMessage: 'Skjal',
    description: 'Label for file upload',
  },
  commentLabel: {
    id: 'vmst.vsd.application:uploadDocuments.commentLabel',
    defaultMessage: 'Athugasemd',
    description: 'Label for comment input',
  },
  requestedAttachmentsDescription: {
    id: 'vmst.vsd.application:uploadDocuments.requestedAttachmentsDescription',
    defaultMessage:
      'Vinnumálastofnun óskar eftir að þú skilir inn eftirfarandi gögnum:',
    description: 'Requested attachments description heading',
  },
})

export const application = defineMessages({
  name: {
    id: 'vmst.vsd.application:name',
    defaultMessage: 'Skila gögnum',
    description: `Application's name`,
  },
  institutionName: {
    id: 'vmst.vsd.application:institution',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'vmst.vsd.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardSubmitted: {
    id: 'vmst.vsd.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  agreeCheckbox: {
    id: 'vmst.vsd.application:agreeCheckbox',
    defaultMessage: 'Ég skil',
    description: 'Agree checkbox label',
  },
  successSubmissionTitle: {
    id: 'vmst.vsd.application:successSubmissionTitle',
    defaultMessage:
      'Vinnumálastofnun hefur móttekið umsókn þína og er hún komin til afgreiðslu.',
    description: 'Successful submission title',
  },
  multiFieldTitle: {
    id: 'vmst.vsd.application:multiFieldTitle',
    defaultMessage: 'Staðfesting',
    description: 'Title for the multi field on completed form',
  },
  completedFormAlertTitle: {
    id: 'vmst.vsd.application:completedFormAlertTitle',
    defaultMessage: 'Vinnumálastofnun hefur móttekið gögnin.',
    description: 'Title for alert when form is completed',
  },
  bottomButtonMessage: {
    id: 'vmst.vsd.application:bottomButtonMessage',
    defaultMessage:
      'Á mínum síðum og í appi ísland.is getur þú nú nálgast staðfestingu á því að þessi aðgerð hafi verið framkvæmd.',
    description: 'Bottom info message on completed form',
  },
  bottomButtonLabel: {
    id: 'vmst.vsd.application:bottomButtonLabel',
    defaultMessage: 'Opna Mínar síður',
    description: 'Bottom button label on completed form',
  },
  actionCardDraft: {
    id: 'vmst.vsd.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description: 'Action card tag for draft application',
  },
  applicationSent: {
    id: 'vmst.vsd.application:applicationSent',
    defaultMessage: 'Gagnaskil móttekin',
    description: 'History log message when application is sent',
  },
})

export const errorMessages = defineMessages({
  eligibilityErrorTitle: {
    id: 'vmst.vsd.application:error.eligibilityErrorTitle',
    defaultMessage: 'Ekki er hægt að skila gögnum',
    description: 'Error title when user is not eligible to submit documents',
  },
  cannotApplyErrorSummary: {
    id: 'vmst.vsd.application:error.cannotApplyErrorSummary',
    defaultMessage:
      'Samkvæmt sóttum gögnum er ekki hægt að skila inn gögnum á þessari stundu.',
    description: 'Error summary when user is not eligible to submit documents',
  },
  documentsMinError: {
    id: 'vmst.vsd.application:error.documentsMinError',
    defaultMessage: 'Þú þarft að skila að minnsta kosti einu skjali',
    description: 'Error message when no documents are submitted',
  },
  documentsMaxError: {
    id: 'vmst.vsd.application:error.documentsMaxError',
    defaultMessage: 'Þú getur ekki skilað fleiri en {max} skjölum',
    description: 'Error message when too many documents are submitted',
  },
})
