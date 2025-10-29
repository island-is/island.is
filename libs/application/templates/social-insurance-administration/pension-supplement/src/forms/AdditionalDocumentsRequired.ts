import {
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { pensionSupplementFormMessage } from '../lib/messages'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'PensionSupplementInReviewUpload',
  title: pensionSupplementFormMessage.shared.applicationTitle,
  logo: SocialInsuranceAdministrationLogo,
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
