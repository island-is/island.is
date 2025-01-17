import { buildRadioField, buildSubSection } from '@island.is/application/core'
import { ApplicationType } from '../../lib/constants'
import { newPrimarySchoolMessages } from '../../lib/messages'

export const applicationTypeSubSection = buildSubSection({
  id: 'applicationTypeSubSection',
  title: newPrimarySchoolMessages.pre.applicationTypeSubSectionTitle,
  children: [
    buildRadioField({
      id: 'applicationType',
      title: newPrimarySchoolMessages.pre.applicationTypeSubSectionTitle,
      description:
        newPrimarySchoolMessages.pre.applicationTypeSubSectionDescription,
      options: [
        {
          value: ApplicationType.NEW_PRIMARY_SCHOOL,
          dataTestId: 'new-primary-school',
          label: newPrimarySchoolMessages.shared.applicationName,
        },
        {
          value: ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
          dataTestId: 'enrollment-in-primary-school',
          label: newPrimarySchoolMessages.shared.enrollmentApplicationName,
        },
      ],
      required: true,
    }),
  ],
})
