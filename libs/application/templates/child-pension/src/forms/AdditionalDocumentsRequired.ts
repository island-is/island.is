import {
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../lib/constants'
import { inReviewFormMessages, childPensionFormMessage } from '../lib/messages'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'ParentalLeaveInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: childPensionFormMessage.fileUpload.additionalDocumentRequiredTitle,
      children: [
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title:
            childPensionFormMessage.fileUpload.additionalDocumentRequiredTitle,
          children: [
            buildFileUploadField({
              id: 'fileUpload.additionalDocuments',
              title:
                childPensionFormMessage.fileUpload
                  .additionalDocumentRequiredTitle,
              description:
                childPensionFormMessage.fileUpload
                  .additionalDocumentRequiredDescription,
              introduction:
                childPensionFormMessage.fileUpload
                  .additionalDocumentRequiredDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                childPensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader: childPensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                childPensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                childPensionFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              title:
                childPensionFormMessage.fileUpload
                  .additionalDocumentRequiredSubmit,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: childPensionFormMessage.fileUpload
                    .additionalDocumentRequiredSubmit,
                  type: 'primary',
                  event: 'APPROVE',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'unused',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
