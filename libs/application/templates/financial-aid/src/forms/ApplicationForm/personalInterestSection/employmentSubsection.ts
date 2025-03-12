import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { employmentOptions } from '../../../utils/options'
import { otherEmployment } from '../../../utils/conditions'

export const employmentSubsection = buildSubSection({
  id: Routes.EMPLOYMENT,
  title: m.employmentForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'employmentMultiField',
      title: m.employmentForm.general.pageTitle,
      children: [
        buildRadioField({
          id: 'employment.type',
          options: employmentOptions,
          marginBottom: 2,
        }),
        buildTextField({
          condition: otherEmployment,
          id: 'employment.custom',
          title: m.input.label,
          required: true,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
