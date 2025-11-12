import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { ApplicationType } from '../../utils/constants'

export const applicationTypeSection = buildSection({
  id: 'applicationTypeSection',
  title: newPrimarySchoolMessages.applicationType.sectionTitle,
  condition: (answers) => !answers.applicationType,
  children: [
    buildMultiField({
      id: 'applicationTypeMultiField',
      title: newPrimarySchoolMessages.applicationType.sectionTitle,
      children: [
        buildRadioField({
          id: 'applicationType',
          required: true,
          options: [
            {
              value: ApplicationType.NEW_PRIMARY_SCHOOL,
              label:
                newPrimarySchoolMessages.shared.newPrimarySchoolApplicationName,
              subLabel:
                newPrimarySchoolMessages.applicationType.schoolTransferSubLabel,
              dataTestId: 'new-primary-school',
            },
            {
              value: ApplicationType.CONTINUING_ENROLLMENT,
              label:
                newPrimarySchoolMessages.shared
                  .continuingEnrollmentApplicationName,
              subLabel:
                newPrimarySchoolMessages.applicationType
                  .continuingEnrollmentSubLabel,
              dataTestId: 'continuing-enrollment',
            },
          ],
        }),
      ],
    }),
  ],
})
