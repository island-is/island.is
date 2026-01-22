import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const mapValuesToIndividualtype = (answers: FormValue) => {
  return {
    contributionsByLegalEntities: Number(
      getValueViaPath(answers, 'individualIncome.contributionsByLegalEntities'),
    ),
    candidatesOwnContributions: Number(
      getValueViaPath(answers, 'individualIncome.candidatesOwnContributions'),
    ),
    individualContributions: Number(
      getValueViaPath(answers, 'individualIncome.individualContributions'),
    ),
    otherIncome: Number(
      getValueViaPath(answers, 'individualIncome.otherIncome'),
    ),
    electionOfficeExpenses: Number(
      getValueViaPath(answers, 'individualExpense.electionOffice'),
    ),
    advertisingAndPromotions: Number(
      getValueViaPath(answers, 'individualExpense.advertisements'),
    ),
    meetingsAndTravelExpenses: Number(
      getValueViaPath(answers, 'individualExpense.travelCost'),
    ),
    otherExpenses: Number(
      getValueViaPath(answers, 'individualExpense.otherCost'),
    ),
    capitalIncome: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalIncome'),
    ),
    financialExpenses: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalCost'),
    ),
    fixedAssetsTotal: Number(
      getValueViaPath(answers, 'asset.fixedAssetsTotal'),
    ),
    currentAssets: Number(getValueViaPath(answers, 'asset.currentAssets')),
    longTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'liability.longTerm'),
    ),
    shortTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'liability.shortTerm'),
    ),
    equityTotal: Number(getValueViaPath(answers, 'equity.totalEquity')),
  }
}
