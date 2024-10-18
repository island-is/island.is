import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { CEMETERYOPERATIONIDS } from '../../../utils/constants'
import { m } from '../../../lib/messages'

export const opperatingCostSubSection = buildSubSection({
  id: 'operatingCost',
  title: m.expensesIncome,
  children: [
    buildMultiField({
      id: 'cemetryIncomeAndExpense',
      title: m.keyNumbersIncomeAndExpenses,
      description: m.fillOutAppopriate,
      children: [
        buildCustomField({
          id: 'cemetryKeyNumbers',
          title: '',
          component: 'CemeteryOperation',
          childInputIds: Object.values(CEMETERYOPERATIONIDS),
        }),
      ],
    }),
  ],
})
