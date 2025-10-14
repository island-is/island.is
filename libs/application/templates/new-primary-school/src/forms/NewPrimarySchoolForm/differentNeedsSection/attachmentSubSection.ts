import {
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import {
  AttachmentOptions,
  FILE_SIZE_LIMIT,
  UPLOAD_ACCEPT,
} from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'

export const attachmentSubSection = buildSubSection({
  id: 'attachmentSubSection',
  title: newPrimarySchoolMessages.differentNeeds.attachmentsPageTitle,
  // condition: () => {
  //   // TODO: Need to update when we get config from Júní and only show page for "sérskóli - hegðun" and "sérdeild - hegðun"
  //   return false
  // },
  children: [
    buildMultiField({
      id: 'attachments',
      title: newPrimarySchoolMessages.differentNeeds.attachmentsPageTitle,
      description:
        newPrimarySchoolMessages.differentNeeds.attachmentsPageDescription,
      children: [
        buildRadioField({
          id: 'attachments.answer',
          options: [
            {
              value: AttachmentOptions.ONLY_ELECTRONIC,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .electronicAttachmentOption,
            },
            {
              value: AttachmentOptions.ONLY_ON_PAPER,
              label:
                newPrimarySchoolMessages.differentNeeds.paperAttachmentOption,
            },
            {
              value: AttachmentOptions.ELECTRONIC_AND_PAPER,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .electronicAndPaperAttachmentOption,
            },
          ],
        }),
        buildFileUploadField({
          id: 'attachments.files',
          title: newPrimarySchoolMessages.differentNeeds.attachmentsPageTitle,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText:
            newPrimarySchoolMessages.differentNeeds.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader:
            newPrimarySchoolMessages.differentNeeds.attachmentHeader,
          uploadDescription:
            newPrimarySchoolMessages.differentNeeds.attachmentDescription,
          uploadButtonLabel:
            newPrimarySchoolMessages.differentNeeds.attachmentButton,
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
