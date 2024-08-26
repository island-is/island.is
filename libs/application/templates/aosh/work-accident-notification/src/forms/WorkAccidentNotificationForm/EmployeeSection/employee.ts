import {
  buildDateField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { employee, sections } from '../../../lib/messages'

export const employeeSubSection = buildSubSection({
  id: 'employeeSubSection',
  title: sections.draft.employee,
  children: [
    buildMultiField({
      title: employee.employee.pageTitle,
      description: employee.employee.description,
      children: [
        buildDateField({
          // Placeholder, remove me
          id: 'date', // Update id name
          title: 'Dagsetning',
        }),
      ],
    }),
  ],
})
