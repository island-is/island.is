import {
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'
import { FILE_SIZE_LIMIT } from '@island.is/application/templates/social-insurance-administration-core/constants'

export const AdditionalSupportForTheElderlyForm: Form = buildForm({
  id: 'AdditionalSupportForTheElderlyDraft',
  title: additionalSupportForTheElderyFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: additionalSupportForTheElderyFormMessage.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'additionalInformation',
      title: additionalSupportForTheElderyFormMessage.comment.additionalInfoTitle,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title: additionalSupportForTheElderyFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title: additionalSupportForTheElderyFormMessage.fileUpload.additionalFileTitle,
              description:
                additionalSupportForTheElderyFormMessage.fileUpload.additionalFileDescription,
              introduction:
                additionalSupportForTheElderyFormMessage.fileUpload.additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                additionalSupportForTheElderyFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                additionalSupportForTheElderyFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                additionalSupportForTheElderyFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                additionalSupportForTheElderyFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title: additionalSupportForTheElderyFormMessage.comment.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title: additionalSupportForTheElderyFormMessage.comment.commentSection,
              variant: 'textarea',
              rows: 10,
              description: additionalSupportForTheElderyFormMessage.comment.description,
              placeholder: additionalSupportForTheElderyFormMessage.comment.placeholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: additionalSupportForTheElderyFormMessage.confirm.section,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirm',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmScreen',
                    title: additionalSupportForTheElderyFormMessage.confirm.title,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})