import {
  buildDateField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { ApplicationType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

export const startingSchoolSubSection = buildSubSection({
  id: 'startingSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.startingSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Application for a new primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
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
