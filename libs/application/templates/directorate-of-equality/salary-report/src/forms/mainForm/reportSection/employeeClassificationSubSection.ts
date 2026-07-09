import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

export const employeeClassificationSubSection = buildSubSection({
  id: 'employeeClassification',
  title: messages.report.employeeClassification.sectionTitle,
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
