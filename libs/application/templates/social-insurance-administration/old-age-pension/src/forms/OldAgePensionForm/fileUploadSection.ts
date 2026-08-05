import {
  buildFileUploadField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { ApplicationType } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/oldAgePensionUtils'

export const fileUploadSection = buildSection({
  id: 'fileUploadSection',
  title: socialInsuranceAdministrationMessage.fileUpload.title,
  children: [
    buildSubSection({
      id: 'fileUpload.fishermen.section',
      title: oldAgePensionFormMessage.fileUpload.fishermenFileTitle,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)
        return applicationType === ApplicationType.SAILOR_PENSION
      },
      children: [
        buildFileUploadField({
          id: 'fileUpload.fishermen',
          title: oldAgePensionFormMessage.fileUpload.fishermenFileTitle,
          description:
            oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
          introduction:
            oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
          ...fileUploadSharedProps,
        }),
      ],
    }),
  ],
})
