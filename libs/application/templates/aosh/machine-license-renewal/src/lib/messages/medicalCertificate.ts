import { defineMessages } from 'react-intl'

export const medicalCertificate = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlr.application:medicalCertificate.general.sectionTitle',
      defaultMessage: 'Læknisvottorð',
      description: 'Title of medical certificate section',
    },
    title: {
      id: 'aosh.mlr.application:medicalCertificate.general.title',
      defaultMessage: 'Læknisvottorð',
      description: 'Title of medical certificate screen',
    },
    description: {
      id: 'aosh.mlr.application:medicalCertificate.general.description',
      defaultMessage: 'Endurnýjun á réttindum krefjast læknisvottorðs.',
      description: 'Description of medical certificate screen',
    },
  }),
  labels: defineMessages({
    uploadHeader: {
      id: 'aosh.mlr.application:medicalCertificate.labels.uploadHeader',
      defaultMessage: 'Hlaða upp læknisvottorði',
      description: 'Medical certificate upload header',
    },
    uploadDescription: {
      id: 'aosh.mlr.application:medicalCertificate.labels.uploadDescription',
      defaultMessage:
        'Eingöngu er tekið við skjölum með endingunum: .pdf, .jpg, .jpeg, .png.',
      description: 'Medical certificate upload description',
    },
    uploadButtonLabel: {
      id: 'aosh.mlr.application:medicalCertificate.labels.uploadButtonLabel',
      defaultMessage: 'Hlaða inn vottorði',
      description: 'Medical certificate upload button label',
    },
  }),
  errors: defineMessages({
    required: {
      id: 'aosh.mlr.application:medicalCertificate.errors.required',
      defaultMessage: 'Hlaða þarf upp læknisvottorði',
      description: 'Error when no medical certificate is uploaded',
    },
  }),
}
