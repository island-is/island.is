import { buildSection } from '@island.is/application/core'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { applicant } from '../../lib/messages'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicant.general.sectionTitle,
  children: [
    applicantInformationMultiField({
      applicantInformationTitle: applicant.general.title,
      baseInfoReadOnly: true,
      emailAndPhoneReadOnly: true,
      addressRequired: false,
      postalCodeRequired: false,
      cityRequired: false,
      emailRequired: false,
    }),
  ],
})
