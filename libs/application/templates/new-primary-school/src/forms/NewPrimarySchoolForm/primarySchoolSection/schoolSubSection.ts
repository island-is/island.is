import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { primarySchoolMessages } from '../../../lib/messages'
import { ApplicationType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getPreferredSchoolName,
} from '../../../utils/newPrimarySchoolUtils'

export const schoolSubSection = buildSubSection({
  id: 'schoolSubSection',
  title: primarySchoolMessages.school.subSectionTitle,
  condition: (answers, externalData) => {
    // Only display section if application type is "Enrollment in primary school" and preferred school is not null
    const { applicationType } = getApplicationAnswers(answers)
    const { preferredSchool } = getApplicationExternalData(externalData)

    return (
      applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
      preferredSchool !== null
    )
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
          space: 0,
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
