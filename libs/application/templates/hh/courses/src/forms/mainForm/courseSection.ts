import {
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const courseSection = buildSection({
  id: 'courseSection',
  title: m.course.sectionTitle,
  children: [
    buildMultiField({
      id: 'courseSectionMultiField',
      title: m.course.sectionTitle,
      children: [
        buildSelectField({
          id: 'courseSelect',
          title: m.course.courseSelectTitle,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
        }),
        buildSelectField({
          id: 'dateSelect',
          title: m.course.dateSelectTitle,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
        }),
      ],
    }),
  ],
})
