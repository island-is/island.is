import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionLookupStudent = buildSubSection({
  id: 'requirements',
  title: m.applicationEligibilityTitle,
  children: [
    buildMultiField({
      id: 'studentLookup',
      title: m.applicationStudentLookupTitle,
      children: [
        buildCustomField({
          title: m.applicationStudentLookupTitle,
          component: 'FindStudent',
          id: 'findstudent',
        }),
      ],
    }),
  ],
})
