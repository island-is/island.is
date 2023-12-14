import {
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { inReviewFormMessages } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/messages'
import { FILE_SIZE_LIMIT } from '@island.is/application/templates/social-insurance-administration-core/constants'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'HouseholdSupplementInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'reviewUpload',
      title:
        socialInsuranceAdministrationMessage.fileUpload
          .additionalDocumentRequiredTitle,
      children: [
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title:
            socialInsuranceAdministrationMessage.fileUpload
              .additionalDocumentRequiredTitle,
          description:
            socialInsuranceAdministrationMessage.fileUpload
              .additionalDocumentRequiredDescription,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
              title: '',
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                socialInsuranceAdministrationMessage.fileUpload
                  .attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                socialInsuranceAdministrationMessage.fileUpload
                  .attachmentHeader,
              uploadDescription:
                socialInsuranceAdministrationMessage.fileUpload
                  .attachmentDescription,
              uploadButtonLabel:
                socialInsuranceAdministrationMessage.fileUpload
                  .attachmentButton,
              uploadMultiple: true,
            }),
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              title:
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalDocumentsEditSubmit,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: socialInsuranceAdministrationMessage.fileUpload
                    .additionalDocumentsEditSubmit,
                  type: 'primary',
                  event: DefaultEvents.SUBMIT,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
