import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

export const employeesSubSection = buildSubSection({
  id: 'employees',
  title: messages.report.employees.sectionTitle,
  children: [
    buildMultiField({
      id: 'employeesMultiField',
      title: messages.report.employees.title,
      description: messages.report.employees.intro,
      children: [
        buildCustomField({
          id: 'employees',
          component: 'EmployeesEditor',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
