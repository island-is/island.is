import {
  buildDateField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { ApplicationType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/primarySchoolUtils'

export const startingSchoolSubSection = buildSubSection({
  id: 'startingSchoolSubSection',
  title: primarySchoolMessages.primarySchool.startingSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Application for a new primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'startingSchoolMultiField',
      title: primarySchoolMessages.primarySchool.startingSchoolTitle,
      description:
        primarySchoolMessages.primarySchool.startingSchoolDescription,
      children: [
        buildDateField({
          id: 'expectedStartDate',
          title: primarySchoolMessages.shared.date,
          placeholder: primarySchoolMessages.shared.datePlaceholder,
          defaultValue: null,
          minDate: () => new Date(),
        }),
      ],
    }),
  ],
})
