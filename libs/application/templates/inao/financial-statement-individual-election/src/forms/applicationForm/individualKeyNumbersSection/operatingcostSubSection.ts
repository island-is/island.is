import {
  buildDescriptionField,
  buildDisplayField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { INDIVIDUALOPERATIONIDS, OPERATINGCOST } from '../../../utils/constants'
import {
  sumExpenses,
  sumIncome,
  sumOperatingCost,
} from '../../../utils/sumUtils'

export const operatingCostSubSection = buildSubSection({
  id: 'operatingCost',
  title: m.expensesIncome,
  children: [
    buildMultiField({
      id: 'operatinCostfields',
      title: m.keyNumbersIncomeAndExpenses,
      description: m.fillOutAppopriate,
      children: [
        // Income
        buildDescriptionField({
          id: INDIVIDUALOPERATIONIDS.contributionsByLegalEntities,
          title: m.income,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.contributionsByLegalEntities,
          title: m.contributionsFromLegalEntities,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.individualContributions,
          title: m.contributionsFromIndividuals,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.candidatesOwnContributions,
          title: m.candidatesOwnContributions,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.otherIncome,
          title: m.otherIncome,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: INDIVIDUALOPERATIONIDS.totalIncome,
          label: m.totalIncome,
          value: sumIncome,
          variant: 'currency',
          rightAlign: true,
        }),

        // expenses
        buildDescriptionField({
          id: 'expenseDescription',
          title: m.expenses,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.electionOffice,
          title: m.electionOffice,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.advertisements,
          title: m.advertisements,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.travelCost,
          title: m.travelCost,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: INDIVIDUALOPERATIONIDS.otherCost,
          title: m.otherCost,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: INDIVIDUALOPERATIONIDS.totalExpense,
          label: m.totalExpenses,
          value: sumExpenses,
          variant: 'currency',
          rightAlign: true,
        }),

        // Total operating cost
        buildDisplayField({
          id: OPERATINGCOST.total,
          title: m.operatingCost,
          value: sumOperatingCost,
          variant: 'currency',
          rightAlign: true,
        }),
      ],
    }),
  ],
})
