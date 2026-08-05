import {
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const additionalInformationSection = buildSection({
  id: 'additionalInformationSection',
  title: socialInsuranceAdministrationMessage.additionalInfo.section,
  children: [
    buildSubSection({
      id: 'commentSection',
      title: socialInsuranceAdministrationMessage.additionalInfo.commentSection,
      children: [
        buildTextField({
          id: 'comment',
          title:
            socialInsuranceAdministrationMessage.additionalInfo.commentSection,
          variant: 'textarea',
          rows: 10,
          description:
            socialInsuranceAdministrationMessage.additionalInfo
              .commentDescription,
          placeholder:
            socialInsuranceAdministrationMessage.additionalInfo
              .commentPlaceholder,
        }),
      ],
    }),
  ],
})
