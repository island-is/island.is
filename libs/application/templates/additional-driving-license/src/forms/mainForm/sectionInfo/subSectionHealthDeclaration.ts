import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildFileUploadField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const subSectionHealthDeclaration = buildSubSection({
  id: 'healthDeclaration',
  title: m.healthDeclarationSectionTitle,
  children: [
    buildMultiField({
      id: 'overviewBE',
      title: m.healthDeclarationMultiFieldTitle,
      space: 2,
      children: [
        buildDescriptionField({
          id: 'healthCertificateDescriptionBE',
          description: m.healthCertificateDescription,
        }),
        buildFileUploadField({
          id: 'healthCertificate',
          title: m.healthCertificateTitle,
          uploadHeader: m.healthCertificateUploadHeader,
          uploadDescription: m.healthCertificateUploadDescription,
          uploadButtonLabel: m.healthCertificateUploadButtonLabel,
          maxSize: 4000000,
          uploadAccept: '.pdf, .jpg, .jpeg, .png',
        }),
      ],
    }),
  ],
})
