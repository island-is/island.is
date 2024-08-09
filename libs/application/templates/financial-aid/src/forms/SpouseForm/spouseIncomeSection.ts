import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { Routes } from '../../lib/constants'
import { getIncomeOptions } from '../../lib/utils/getIncomeOptions'

export const spouseIncomeSection = buildSection({
  id: Routes.SPOUSEINCOME,
  title: m.incomeForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSEINCOME,
      title: m.incomeForm.general.pageTitle,
      children: [
        buildRadioField({
          id: `${Routes.SPOUSEINCOME}.type`,
          title: '',
          width: 'half',
          options: getIncomeOptions(),
        }),
        buildDescriptionField({
          id: `${Routes.SPOUSEINCOME}.bullets`,
          title: m.incomeForm.bulletList.headline,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.incomeForm.examplesOfIncome.incomeExampleList,
        }),
      ],
    }),
  ],
})
