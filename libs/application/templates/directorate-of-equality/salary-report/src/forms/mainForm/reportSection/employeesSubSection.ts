import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../../lib/messages'
import { ProgressPaths } from '../../../utils/constants'

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
          // The step's own data lives on the DMR draft, so this marker is the
          // only thing that tells the shell the screen is done — see
          // ProgressPaths. Replaces `doesNotRequireAnswer: true`: a screen that
          // requires no answer is skipped without advancing the resume point.
          childInputIds: [ProgressPaths.employees],
        }),
      ],
    }),
  ],
})
