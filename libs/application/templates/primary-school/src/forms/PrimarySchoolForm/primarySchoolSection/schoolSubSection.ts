import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { ApplicationType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getNeighbourhoodSchoolName,
} from '../../../lib/primarySchoolUtils'

export const schoolSubSection = buildSubSection({
  id: 'schoolSubSection',
  title: primarySchoolMessages.primarySchool.schoolSubSectionTitle,
  condition: (answers) => {
    const { applicationType } = getApplicationAnswers(answers)
    // Only display section if application type is "Enrollment in primary school"
    return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'school',
      title: primarySchoolMessages.primarySchool.schoolSubSectionTitle,
      description:
        primarySchoolMessages.primarySchool.schoolSubSectionDescription,
      children: [
        buildRadioField({
          id: 'school.applyForNeighbourhoodSchool',
          required: true,
          options: (application) => {
            return [
              {
                label:
                  primarySchoolMessages.primarySchool
                    .schoolApplyForNeighbourhoodSchoolLabel,
                subLabel: {
                  ...primarySchoolMessages.primarySchool
                    .schoolApplyForNeighbourhoodSchoolSubLabel,
                  values: {
                    neighbourhoodSchoolName:
                      getNeighbourhoodSchoolName(application),
                  },
                },
                value: YES,
              },
              {
                label:
                  primarySchoolMessages.primarySchool
                    .schoolApplyForOtherSchoolLabel,
                subLabel:
                  primarySchoolMessages.primarySchool
                    .schoolApplyForOtherSchoolSubLabel,
                value: NO,
              },
            ]
          },
        }),
      ],
    }),
  ],
})
