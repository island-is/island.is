import {
  buildCustomField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { ApproveOptions } from '../../lib/types'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'

export const spouseIncomeFilesSection = buildSection({
  condition: (answers) => {
    const income = getValueViaPath<ApproveOptions>(answers, 'spouseIncome.type')
    return income === ApproveOptions.Yes
  },
  id: Routes.SPOUSEINCOMEFILES,
  title: m.incomeFilesForm.general.sectionTitle,
  children: [
    buildCustomField({
      id: Routes.SPOUSEINCOMEFILES,
      title: m.incomeFilesForm.general.pageTitle,
      component: 'IncomeFilesForm',
    }),
  ],
})
