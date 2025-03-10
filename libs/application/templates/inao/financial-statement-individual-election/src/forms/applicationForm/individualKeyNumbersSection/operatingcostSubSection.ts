import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../../lib/utils/messages'
import { INDIVIDUALOPERATIONIDS } from '../../../lib/utils/constants'

export const operatingCostSubSection = buildSubSection({
  id: 'operatingCost',
  title: m.expensesIncome,
  children: [
    buildMultiField({
      id: 'operatinCostfields',
      title: m.keyNumbersIncomeAndExpenses,
      description: m.fillOutAppopriate,
      children: [
        buildCustomField({
          id: 'IndividualIncome',
          component: 'IndividualElectionOperatingIncome',
          childInputIds: Object.values(INDIVIDUALOPERATIONIDS),
        }),
      ],
    }),
  ],
})
