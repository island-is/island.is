import {
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { inReviewFormMessages, oldAgePensionFormMessage } from '../lib/messages'
import { FILE_SIZE_LIMIT } from '../lib/constants'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'OldAgePensionInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'reviewUpload',
      title:
        oldAgePensionFormMessage.fileUpload.additionalDocumentRequiredTitle,
      children: [
        buildMultiField({
          id: 'additionalDocumentsRequiredScreen',
          title:
            oldAgePensionFormMessage.fileUpload.additionalDocumentRequiredTitle,
          description:
            oldAgePensionFormMessage.fileUpload
              .additionalDocumentRequiredDescription,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
              title: '',
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
              id: 'submit',
              placement: 'footer',
              title:
                oldAgePensionFormMessage.fileUpload
                  .additionalDocumentsEditSubmit,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: oldAgePensionFormMessage.fileUpload
                    .additionalDocumentsEditSubmit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
