import {
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { inReviewFormMessages } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'

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
              ...fileUploadSharedProps,
            }),
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              placement: 'footer',
              title:
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalDocumentsEditSubmit,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: socialInsuranceAdministrationMessage.fileUpload
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
