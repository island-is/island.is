import { buildRadioField, buildSubSection } from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { ApplicationType } from '../../lib/constants'
import { primarySchoolMessages } from '../../lib/messages'

const shouldRenderApplicationTypeSubSection =
  !isRunningOnEnvironment('production')

export const applicationTypeSubSection = buildSubSection({
  id: 'applicationTypeSubSection',
  title: primarySchoolMessages.pre.applicationTypeSubSectionTitle,
  condition: () => shouldRenderApplicationTypeSubSection,
  children: [
    buildRadioField({
      id: 'applicationType',
      title: primarySchoolMessages.pre.applicationTypeSubSectionTitle,
      description:
        primarySchoolMessages.pre.applicationTypeSubSectionDescription,
      options: [
        {
          value: ApplicationType.PRIMARY_SCHOOL,
          dataTestId: 'primary-school',
          label: primarySchoolMessages.shared.applicationName,
        },
        {
          value: ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL,
          dataTestId: 'enrollment-in-primary-school',
          label: primarySchoolMessages.shared.enrollmentApplicationName,
        },
      ],
      required: true,
    }),
  ],
})
