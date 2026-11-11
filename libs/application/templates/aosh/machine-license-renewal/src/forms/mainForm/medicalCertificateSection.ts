import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { medicalCertificate } from '../../lib/messages'

export const medicalCertificateSection = buildSection({
  id: 'medicalCertificateSection',
  title: medicalCertificate.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'medicalCertificateMultiField',
      title: medicalCertificate.general.title,
      description: medicalCertificate.general.description,
      children: [
        buildFileUploadField({
          id: 'medicalCertificate',
          uploadHeader: medicalCertificate.labels.uploadHeader,
          uploadDescription: medicalCertificate.labels.uploadDescription,
          uploadButtonLabel: medicalCertificate.labels.uploadButtonLabel,
          uploadAccept: '.pdf, .jpg, .jpeg, .png',
          uploadMultiple: false,
        }),
      ],
    }),
  ],
})
