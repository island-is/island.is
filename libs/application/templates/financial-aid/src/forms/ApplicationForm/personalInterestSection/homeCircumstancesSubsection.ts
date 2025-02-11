import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { homeCircumstancesOptions } from '../../../utils/options'
import { hasOtherHomeCircumstances } from '../../../utils/conditions'

export const homeCircumstancesSubsection = buildSubSection({
  id: Routes.HOMECIRCUMSTANCES,
  title: m.homeCircumstancesForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'homeCircumstancesMultiField',
      title: m.homeCircumstancesForm.general.pageTitle,
      children: [
        buildRadioField({
          id: 'homeCircumstances.type',
          marginBottom: 2,
          options: homeCircumstancesOptions,
        }),
        buildTextField({
          condition: hasOtherHomeCircumstances,
          id: 'homeCircumstances.custom',
          title: m.input.label,
          variant: 'textarea',
          required: true,
          rows: 8,
        }),
      ],
    }),
  ],
})
