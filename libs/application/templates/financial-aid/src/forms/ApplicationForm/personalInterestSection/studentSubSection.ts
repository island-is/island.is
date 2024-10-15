import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { getStudentOptions } from '../../../lib/utils/getStudentOptions'
import { FormValue } from '@island.is/application/types'
import { ApproveOptions } from '../../../lib/types'

export const studentSubSection = buildSubSection({
  id: Routes.STUDENT,
  title: m.studentForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.STUDENT,
      title: m.studentForm.general.pageTitle,
      children: [
        buildRadioField({
          id: `${Routes.STUDENT}.isStudent`,
          title: '',
          options: getStudentOptions(),
        }),
        buildTextField({
          condition: (answers) =>
            (answers[Routes.STUDENT] as FormValue)?.isStudent ===
            ApproveOptions.Yes,
          id: `${Routes.STUDENT}.custom`,
          title: m.studentForm.input.label,
          placeholder: m.studentForm.input.example,
          required: true,
        }),
      ],
    }),
  ],
})
