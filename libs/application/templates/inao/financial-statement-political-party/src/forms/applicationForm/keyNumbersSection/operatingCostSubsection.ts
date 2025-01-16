import {
  buildDescriptionField,
  buildDisplayField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { OPERATINGCOST, PARTYOPERATIONIDS } from '../../../utils/constants'
import { sumExpenses, sumIncome, sumTotal } from '../../../utils/helpers'

export const operatingCostSubsection = buildSubSection({
  id: 'operatingCost',
  title: m.expensesIncome,
  children: [
    buildMultiField({
      id: 'operatingCostMultiField',
      title: m.keyNumbersIncomeAndExpenses,
      children: [
        // Income
        buildDescriptionField({
          id: 'incomeDescription',
          title: m.income,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.contributionsFromTheTreasury,
          title: m.contributionsFromTheTreasury,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.parliamentaryPartySupport,
          title: m.parliamentaryPartySupport,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.municipalContributions,
          title: m.municipalContributions,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.contributionsFromLegalEntities,
          title: m.contributionsFromLegalEntities,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.contributionsFromIndividuals,
          title: m.contributionsFromIndividuals,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.generalMembershipFees,
          title: m.generalMembershipFees,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.otherIncome,
          title: m.otherIncome,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: PARTYOPERATIONIDS.totalIncome,
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
          id: PARTYOPERATIONIDS.electionOffice,
          title: m.electionOffice,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: PARTYOPERATIONIDS.otherCost,
          title: m.otherOperationalCost,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: PARTYOPERATIONIDS.totalExpense,
          label: m.totalExpenses,
          value: sumExpenses,
          variant: 'currency',
          rightAlign: true,
        }),

        // Total
        buildDescriptionField({
          id: 'totalDescription',
          title: m.operatingCost,
          titleVariant: 'h3',
        }),
        buildDisplayField({
          id: OPERATINGCOST.total,
          value: sumTotal,
          variant: 'currency',
          rightAlign: true,
        }),
      ],
    }),
  ],
})
