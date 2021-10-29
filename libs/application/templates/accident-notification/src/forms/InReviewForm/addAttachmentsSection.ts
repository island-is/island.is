import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { UPLOAD_ACCEPT } from '../../constants'
import { addDocuments } from '../../lib/messages'

export const addAttachmentsSection = buildSection({
  id: 'addAttachmentSection',
  title: addDocuments.general.heading,
  children: [
    buildMultiField({
      id: 'addAttachmentScreen',
      title: addDocuments.general.heading,
      description: addDocuments.general.description,
      children: [
        buildDescriptionField({
          id: 'attachments.injuryCertificateFile.title',
          title: addDocuments.injuryCertificate.title,
          description: '',
          space: 5,
          titleVariant: 'h5',
        }),
        buildFileUploadField({
          id: 'attachments.injuryCertificateFile.file',
          title: '',
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: addDocuments.injuryCertificate.uploadHeader,
          uploadDescription: addDocuments.general.uploadDescription,
          uploadButtonLabel: addDocuments.general.uploadButtonLabel,
        }),
        // TODO: Add conditional render for Umboðskjal
        buildDescriptionField({
          id: 'attachments.powerOfAttorney.title',
          title: addDocuments.powerOfAttorney.title,
          description: '',
          space: 5,
          titleVariant: 'h5',
          condition: (formValue) => true,
        }),
        buildFileUploadField({
          id: 'attachments.powerOfAttorneyFile.file',
          title: '',
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: addDocuments.powerOfAttorney.uploadHeader,
          uploadDescription: addDocuments.general.uploadDescription,
          uploadButtonLabel: addDocuments.general.uploadButtonLabel,
          condition: (formValue) => true,
        }),

        buildDescriptionField({
          id: 'attachments.additionalAttachments.title',
          title: addDocuments.additional.title,
          description: '',
          space: 5,
          titleVariant: 'h5',
        }),
        buildDescriptionField({
          id: 'attachments.additionalAttachments.description',
          title: '',
          description: addDocuments.general.additionalDocumentsDescription,
          space: 3,
        }),
        buildFileUploadField({
          id: 'attachments.additionalFiles.file',
          title: '',
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: addDocuments.general.uploadHeader,
          uploadDescription: addDocuments.general.uploadDescription,
          uploadButtonLabel: addDocuments.general.uploadButtonLabel,
        }),
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'footer',
          actions: [
            // Todo make sure we send correct action to upload additional attachments.
            { event: 'SUBMIT', name: 'Hlaða upp skjölum', type: 'primary' },
          ],
        }),
      ],
    }),
  ],
})
