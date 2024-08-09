import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'

import { getHomeCircumstancesOptions } from '../../../lib/utils/getHomeCircumstancesOptions'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import { FormValue } from '@island.is/application/types'

export const homeCircumstancesSubSection = buildSubSection({
  id: Routes.HOMECIRCUMSTANCES,
  title: m.homeCircumstancesForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.HOMECIRCUMSTANCES,
      title: m.homeCircumstancesForm.general.pageTitle,
      children: [
        buildRadioField({
          id: `${Routes.HOMECIRCUMSTANCES}.type`,
          title: '',
          options: getHomeCircumstancesOptions(),
          required: true,
        }),
        buildTextField({
          condition: (answers: FormValue) =>
            (answers[Routes.HOMECIRCUMSTANCES] as FormValue)?.type ===
            HomeCircumstances.OTHER,
          id: `${Routes.HOMECIRCUMSTANCES}.custom`,
          title: m.input.label,
          variant: 'textarea',
          rows: 6,
        }),
      ],
    }),
  ],
})
