import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { ApplicationType } from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getPreferredSchoolName,
} from '../../../utils/newPrimarySchoolUtils'

export const schoolSubSection = buildSubSection({
  id: 'schoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.schoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Enrollment in primary school"
    const { applicationType } = getApplicationAnswers(answers)
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
          id: 'school.applyForPreferredSchool',
          required: true,
          options: (application) => {
            return [
              {
                label:
                  newPrimarySchoolMessages.primarySchool
                    .schoolApplyForPreferredSchoolLabel,
                subLabel: {
                  ...newPrimarySchoolMessages.primarySchool
                    .schoolApplyForPreferredSchoolSubLabel,
                  values: {
                    preferredSchoolName: getPreferredSchoolName(
                      application.externalData,
                    ),
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
