import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { getEmploymentOptions } from '../../../lib/utils/getEmploymentOptions'
import { FormValue } from '@island.is/application/types'
import { Employment } from '@island.is/financial-aid/shared/lib'

export const employmentSubSection = buildSubSection({
  id: Routes.EMPLOYMENT,
  title: m.employmentForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.EMPLOYMENT,
      title: m.employmentForm.general.pageTitle,
      children: [
        buildRadioField({
          id: `${Routes.EMPLOYMENT}.type`,
          title: '',
          options: getEmploymentOptions(),
        }),
        buildTextField({
          condition: (answers) =>
            (answers[Routes.EMPLOYMENT] as FormValue)?.type ===
            Employment.OTHER,
          id: `${Routes.EMPLOYMENT}.custom`,
          title: m.input.label,
          variant: 'textarea',
          rows: 6,
          required: true,
        }),
      ],
    }),
  ],
})
