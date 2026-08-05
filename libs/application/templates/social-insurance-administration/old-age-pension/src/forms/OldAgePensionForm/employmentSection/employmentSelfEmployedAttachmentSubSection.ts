import {
  buildFileUploadField,
  buildSubSection,
} from '@island.is/application/core'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { Employment } from '../../../utils/constants'
import { getApplicationAnswers } from '../../../utils/oldAgePensionUtils'

export const employmentSelfEmployedAttachmentSubSection = buildSubSection({
  id: 'employmentSelfEmployedAttachmentSubSection',
  title: oldAgePensionFormMessage.fileUpload.selfEmployedTitle,
  condition: (answers) => {
    const { employmentStatus } = getApplicationAnswers(answers)

    return employmentStatus === Employment.SELFEMPLOYED
  },
  children: [
    buildFileUploadField({
      id: 'employment.selfEmployedAttachment',
      title: oldAgePensionFormMessage.fileUpload.selfEmployedTitle,
      description: oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
      introduction: oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
      ...fileUploadSharedProps,
    }),
  ],
})
