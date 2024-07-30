import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { getIncomeOptions } from '../../../lib/utils/getIncomeOptions'

export const incomeSubSection = buildSubSection({
  id: Routes.INCOME,
  title: m.incomeForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.INCOME,
      title: m.incomeForm.general.pageTitle,
      children: [
        buildRadioField({
          id: `${Routes.INCOME}.type`,
          title: '',
          width: 'half',
          options: getIncomeOptions(),
        }),
        buildDescriptionField({
          id: `${Routes.INCOME}.descriptionLeft`,
          title: m.incomeForm.bulletList.headline,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.incomeForm.examplesOfIncome.incomeExampleList,
        }),
      ],
    }),
  ],
})
