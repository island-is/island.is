import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { applicationTypeMessages, sharedMessages } from '../../lib/messages'
import { ApplicationType } from '../../utils/constants'

export const applicationTypeSection = buildSection({
  id: 'applicationTypeSection',
  title: applicationTypeMessages.sectionTitle,
  condition: (answers) => !answers.applicationType,
  children: [
    buildMultiField({
      id: 'applicationTypeMultiField',
      title: applicationTypeMessages.sectionTitle,
      children: [
        buildRadioField({
          id: 'applicationType',
          required: true,
          options: [
            {
              value: ApplicationType.NEW_PRIMARY_SCHOOL,
              label: sharedMessages.newPrimarySchoolApplicationName,
              subLabel: applicationTypeMessages.schoolTransferSubLabel,
              dataTestId: 'new-primary-school',
            },
            // {
            //   value: ApplicationType.CONTINUING_ENROLLMENT,
            //   label: sharedMessages.continuingEnrollmentApplicationName,
            //   subLabel: applicationTypeMessages.continuingEnrollmentSubLabel,
            //   dataTestId: 'continuing-enrollment',
            // },
            // take out for now, asked by MMS
          ],
        }),
      ],
    }),
  ],
})
