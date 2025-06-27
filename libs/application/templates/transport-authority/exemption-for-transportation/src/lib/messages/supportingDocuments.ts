import { defineMessages } from 'react-intl'

export const supportingDocuments = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:supportingDocuments.general.sectionTitle',
      defaultMessage: 'Fylgigögn',
      description: 'Title of supporting documents section',
    },
    pageTitle: {
      id: 'ta.eft.application:supportingDocuments.general.pageTitle',
      defaultMessage: 'Fylgigögn',
      description: 'Title of supporting documents page',
    },
  }),
  labels: defineMessages({
    fileUploadHeader: {
      id: 'ta.eft.application:supportingDocuments.labels.fileUploadHeader',
      defaultMessage: 'Dragðu inn fylgisköl, sem dæmi umsögn byggingafulltrúa',
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
