import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getCurrentSchoolName,
} from '../../../lib/newPrimarySchoolUtils'

export const schoolSubSection = buildSubSection({
  id: 'schoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.schoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if "Moving abroad" is not selected as reason for application
    const { reasonForApplication } = getApplicationAnswers(answers)
    return reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
  },
  children: [
    buildMultiField({
      id: 'school',
      title: newPrimarySchoolMessages.primarySchool.schoolSubSectionTitle,
      description: newPrimarySchoolMessages.primarySchool.schoolDescription,
      children: [
        buildRadioField({
          id: 'school.applyForNeighbourhoodSchool',
          title: '',
          required: true,
          options: (application) => {
            return [
              {
                label:
                  newPrimarySchoolMessages.primarySchool
                    .schoolApplyForNeighbourhoodSchoolLabel,
                subLabel: {
                  id: 'newPrimarySchoolMessages.primarySchool.schoolApplyForNeighbourhoodSchoolSubLabel',
                  ...newPrimarySchoolMessages.primarySchool
                    .schoolApplyForNeighbourhoodSchoolSubLabel,
                  values: {
                    currentSchoolName: getCurrentSchoolName(application),
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
