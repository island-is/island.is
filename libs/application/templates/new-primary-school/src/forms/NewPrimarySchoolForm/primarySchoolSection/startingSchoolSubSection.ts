import {
  buildDateField,
  buildMultiField,
  buildSubSection,
  NO,
} from '@island.is/application/core'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

export const startingSchoolSubSection = buildSubSection({
  id: 'startingSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.startingSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if "Moving abroad" is not selected as reason for application
    const { reasonForApplication, applyForNeighbourhoodSchool } =
      getApplicationAnswers(answers)
    return (
      reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD &&
      applyForNeighbourhoodSchool === NO
    )
  },
  children: [
    buildMultiField({
      id: 'startingSchoolMultiField',
      title: newPrimarySchoolMessages.primarySchool.startingSchoolTitle,
      description:
        newPrimarySchoolMessages.primarySchool.startingSchoolDescription,
      children: [
        buildDateField({
          id: 'startDate',
          title: newPrimarySchoolMessages.shared.date,
          placeholder: newPrimarySchoolMessages.shared.datePlaceholder,
          defaultValue: null,
          minDate: () => new Date(),
        }),
      ],
    }),
  ],
})
