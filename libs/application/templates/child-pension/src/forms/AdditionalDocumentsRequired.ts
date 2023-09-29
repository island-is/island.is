import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { inReviewFormMessages, childPensionFormMessage } from '../lib/messages'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'ChildPensionInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: childPensionFormMessage.fileUpload.additionalDocumentRequiredTitle,
      children: [
        buildMultiField({
          id: 'additionalDocumentsRequiredScreen',
          title:
            childPensionFormMessage.fileUpload.additionalDocumentRequiredTitle,
          description:
            childPensionFormMessage.fileUpload
              .additionalDocumentRequiredDescription,
          children: [
            buildCustomField({
              id: 'fileUploadAdditionalFiles.additionalDocumentsRequired',
              title: '',
              component: 'UploadAdditionalDocumentsScreen',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title:
                childPensionFormMessage.fileUpload
                  .additionalDocumentRequiredSubmit,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: childPensionFormMessage.fileUpload
                    .additionalDocumentRequiredSubmit,
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
