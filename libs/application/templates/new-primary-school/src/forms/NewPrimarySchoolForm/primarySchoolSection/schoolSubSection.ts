import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { ApplicationType } from '../../../utils/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getPreferredSchoolName,
} from '../../../utils/newPrimarySchoolUtils'

export const schoolSubSection = buildSubSection({
  id: 'schoolSubSection',
  title: primarySchoolMessages.school.subSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Enrollment in primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'school',
      title: primarySchoolMessages.school.subSectionTitle,
      description: primarySchoolMessages.school.description,
      children: [
        buildRadioField({
          id: 'school.applyForPreferredSchool',
          required: true,
          options: (application) => {
            return [
              {
                label:
                  primarySchoolMessages.school.applyForPreferredSchoolLabel,
                subLabel: {
                  ...primarySchoolMessages.school
                    .applyForPreferredSchoolSubLabel,
                  values: {
                    preferredSchoolName: getPreferredSchoolName(
                      application.externalData,
                    ),
                  },
                },
                value: YES,
              },
              {
                label: primarySchoolMessages.school.applyForOtherSchoolLabel,
                subLabel:
                  primarySchoolMessages.school.applyForOtherSchoolSubLabel,
                value: NO,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
