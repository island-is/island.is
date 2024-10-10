import { buildCustomField, buildSubSection } from '@island.is/application/core'
import { m } from '../../../../lib/messages'
import { PARTYOPERATIONIDS } from '../../../../utils/constants'

export const operatingCostSubsection = buildSubSection({
  id: 'operatingCost',
  title: m.expensesIncome,
  children: [
    buildCustomField({
      id: 'partyOperations',
      title: m.keyNumbersIncomeAndExpenses,
      description: m.fillOutAppopriate,
      component: 'PartyOperatingIncome',
      childInputIds: Object.values(PARTYOPERATIONIDS),
    }),
  ],
})
