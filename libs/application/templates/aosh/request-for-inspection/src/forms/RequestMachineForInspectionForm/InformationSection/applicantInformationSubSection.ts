import { buildMultiField, buildSubSection } from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'

import { applicantInformationMultiField } from '@island.is/application/ui-forms'

export const ApplicantInformationSubSection = buildSubSection({
  id: 'applicantInformation',
  title: applicantMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicantInformationMultiField',
      title: applicantMessages.general.title,
      description: applicantMessages.general.description,
      children: [
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          emailAndPhoneReadOnly: true,
          baseInfoReadOnly: true,
          addressRequired: false,
          postalCodeRequired: false,
          cityRequired: false,
        }).children,
      ],
    }),
  ],
})
