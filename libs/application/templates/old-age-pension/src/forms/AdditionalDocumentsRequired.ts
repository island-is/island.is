import {
  buildCustomField,
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
import { inReviewFormMessages, oldAgePensionFormMessage } from '../lib/messages'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'ParentalLeaveInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
      children: [
        buildCustomField({
          id: 'uploadAdditionalFilesInfoScreen',
          title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
          component: 'UploadAdditionalFilesInfoScreen',
        }),
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.additionalFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              title:
                oldAgePensionFormMessage.fileUpload
                  .additionalDocumentsEditSubmit,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name:
                    oldAgePensionFormMessage.fileUpload
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
