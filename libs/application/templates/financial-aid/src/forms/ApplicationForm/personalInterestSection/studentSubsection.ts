import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { studentOptions } from '../../../utils/options'
import { isStudent } from '../../../utils/conditions'

export const studentSubsection = buildSubSection({
  id: Routes.STUDENT,
  title: m.studentForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'studentMultiField',
      title: m.studentForm.general.pageTitle,
      children: [
        buildRadioField({
          id: 'student.isStudent',
          options: studentOptions,
          marginBottom: 2,
        }),
        buildTextField({
          condition: isStudent,
          id: 'student.custom',
          title: m.studentForm.input.label,
          placeholder: m.studentForm.input.example,
          required: true,
        }),
      ],
    }),
  ],
})
