import {
  buildCustomField,
  buildDescriptionField,
  buildDisplayField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { CEMETERYOPERATIONIDS, OPERATINGCOST } from '../../../utils/constants'
import { m } from '../../../lib/messages'
import {
  sumExpenses,
  sumIncome,
  sumOperatingResults,
} from '../../../utils/sums'

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
          id: 'fetchDataBasedOnYear',
          component: 'FetchDataBasedOnSelectedYear',
        }),
        // Income
        buildDescriptionField({
          id: 'incomeDescription',
          title: m.income,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.careIncome,
          title: m.careIncome,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.burialRevenue,
          title: m.burialRevenue,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.grantFromTheCemeteryFund,
          title: m.grantFromTheCemeteryFund,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.otherIncome,
          title: m.otherIncome,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: CEMETERYOPERATIONIDS.totalIncome,
          label: m.totalIncome,
          value: sumIncome,
          variant: 'currency',
          rightAlign: true,
        }),

        // Expenses
        buildDescriptionField({
          id: 'expensesDescription',
          title: m.expenses,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.payroll,
          title: m.payroll,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.funeralCost,
          title: m.funeralCost,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.chapelExpense,
          title: m.chapelExpense,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.donationsToCemeteryFund,
          title: m.donationsToCemeteryFund,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.donationsToOther,
          title: m.donationsToOther,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.otherOperationCost,
          title: m.otherOperationCost,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYOPERATIONIDS.depreciation,
          title: m.depreciation,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: CEMETERYOPERATIONIDS.totalExpense,
          label: m.totalExpenses,
          value: sumExpenses,
          variant: 'currency',
          rightAlign: true,
        }),

        // Operating results
        buildDescriptionField({
          id: 'operatingResultsDescription',
          title: m.operatingCost,
          titleVariant: 'h3',
        }),
        buildDisplayField({
          id: OPERATINGCOST.total,
          value: sumOperatingResults,
          variant: 'currency',
          rightAlign: true,
        }),
      ],
    }),
  ],
})
