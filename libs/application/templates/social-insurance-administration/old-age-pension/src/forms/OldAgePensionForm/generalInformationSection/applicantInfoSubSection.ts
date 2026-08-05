import { buildSubSection } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

export const applicantInfoSubSection = buildSubSection({
  id: 'applicantInfoSubSection',
  title: socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
  children: [
    applicantInformationMultiField({
      emailRequired: false,
      emailDisabled: true,
      applicantInformationDescription:
        socialInsuranceAdministrationMessage.info.infoSubSectionDescription,
    }),
  ],
})
