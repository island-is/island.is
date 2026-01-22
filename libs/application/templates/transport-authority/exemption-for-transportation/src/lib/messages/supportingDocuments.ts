import { defineMessages } from 'react-intl'

export const supportingDocuments = {
  general: defineMessages({
    sectionTitleShortTerm: {
      id: 'ta.eft.application:supportingDocuments.general.sectionTitleShortTerm',
      defaultMessage: 'Athugasemdir og fylgigögn',
      description: 'Title of supporting documents section',
    },
    sectionTitleLongTerm: {
      id: 'ta.eft.application:supportingDocuments.general.sectionTitleLongTerm',
      defaultMessage: 'Athugasemdir',
      description: 'Title of supporting documents section',
    },
    pageTitleShortTerm: {
      id: 'ta.eft.application:supportingDocuments.general.pageTitleShortTerm',
      defaultMessage: 'Athugasemdir og fylgigögn',
      description: 'Title of supporting documents page',
    },
    pageTitleLongTerm: {
      id: 'ta.eft.application:supportingDocuments.general.pageTitleLongTerm',
      defaultMessage: 'Athugasemdir',
      description: 'Title of supporting documents page',
    },
  }),
  labels: defineMessages({
    fileUploadHeader: {
      id: 'ta.eft.application:supportingDocuments.labels.fileUploadHeader',
      defaultMessage:
        'Dragðu inn fylgiskjöl, sem dæmi staðfesting vegna flutnings á húsi (stöðuleyfi, flutningsheimild)',
      description: 'Supporting documents file upload header',
    },
    fileUploadDescription: {
      id: 'ta.eft.application:supportingDocuments.labels.fileUploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: {allowedTypes}',
      description: 'Supporting documents file upload description',
    },
    fileUploadButtonLabel: {
      id: 'ta.eft.application:supportingDocuments.labels.fileUploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Supporting documents file upload button label',
    },
    comments: {
      id: 'ta.eft.application:supportingDocuments.labels.comments',
      defaultMessage: 'Athugasemd',
      description: 'Supporting documents comments label',
    },
  }),
}
