import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'

export const employeeClassificationSubSection = buildSubSection({
  id: 'employeeClassification',
  title: messages.report.employeeClassification.sectionTitle,
  // Nothing to classify without personal criteria — skip the screen entirely.
  // `hasPersonalCriteria` is kept in sync by CriteriaEditor/ExcelTemplateDownload (see dataSchema.ts).
  condition: (answers) => answers.hasPersonalCriteria === true,
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
