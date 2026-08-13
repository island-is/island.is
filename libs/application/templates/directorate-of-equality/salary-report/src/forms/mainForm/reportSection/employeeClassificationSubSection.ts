import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { type PersonalFactor } from '../../../utils/types'

export const employeeClassificationSubSection = buildSubSection({
  id: 'employeeClassification',
  title: messages.report.employeeClassification.sectionTitle,
  // Nothing to classify without personal criteria — skip the screen entirely.
  condition: (answers) =>
    (
      getValueViaPath<PersonalFactor[]>(
        answers,
        'criteria.personalFactors',
        [],
      ) ?? []
    ).length > 0,
  children: [
    buildMultiField({
      id: 'employeeClassificationMultiField',
      title: messages.report.employeeClassification.title,
      description: messages.report.employeeClassification.intro,
      children: [
        buildCustomField({
          id: 'employees',
          component: 'EmployeeClassificationEditor',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
