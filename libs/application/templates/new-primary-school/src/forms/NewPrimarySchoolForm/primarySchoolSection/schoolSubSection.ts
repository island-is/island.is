import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { ApplicationType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getNeighbourhoodSchoolName,
} from '../../../lib/newPrimarySchoolUtils'

export const schoolSubSection = buildSubSection({
  id: 'schoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.schoolSubSectionTitle,
  condition: (answers) => {
    const { applicationType } = getApplicationAnswers(answers)
    // Only display section if application type is "Enrollment in primary school"
    return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'school',
      title: newPrimarySchoolMessages.primarySchool.schoolSubSectionTitle,
      description:
        newPrimarySchoolMessages.primarySchool.schoolSubSectionDescription,
      children: [
        buildRadioField({
          id: 'school.applyForNeighbourhoodSchool',
          required: true,
          options: (application) => {
            return [
              {
                label:
                  newPrimarySchoolMessages.primarySchool
                    .schoolApplyForNeighbourhoodSchoolLabel,
                subLabel: {
                  ...newPrimarySchoolMessages.primarySchool
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
                  newPrimarySchoolMessages.primarySchool
                    .schoolApplyForOtherSchoolLabel,
                subLabel:
                  newPrimarySchoolMessages.primarySchool
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
