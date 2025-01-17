import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { homeCircumstancesOptions } from '../../../utils/options'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'

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
          title: '',
          marginBottom: 2,
          options: homeCircumstancesOptions,
        }),
        buildTextField({
          condition: (answers) =>
            getValueViaPath<HomeCircumstances>(
              answers,
              'homeCircumstances.type',
            ) === HomeCircumstances.OTHER,
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
