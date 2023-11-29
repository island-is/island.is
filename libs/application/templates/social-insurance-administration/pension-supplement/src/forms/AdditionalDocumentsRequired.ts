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
import {
  inReviewFormMessages,
  pensionSupplementFormMessage,
} from '../lib/messages'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'PensionSupplementInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: pensionSupplementFormMessage.fileUpload.additionalFileTitle,
      children: [
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title: pensionSupplementFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
              title:
                pensionSupplementFormMessage.fileUpload.additionalFileTitle,
              description:
                pensionSupplementFormMessage.fileUpload
                  .additionalFileDescription,
              introduction:
                pensionSupplementFormMessage.fileUpload
                  .additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              title:
                pensionSupplementFormMessage.fileUpload
                  .additionalDocumentsEditSubmit,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: pensionSupplementFormMessage.fileUpload
                    .additionalDocumentsEditSubmit,
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
