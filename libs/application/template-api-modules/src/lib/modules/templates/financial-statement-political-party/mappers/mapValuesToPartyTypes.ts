import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const mapValuesToPartyTypes = (answers: FormValue) => {
  return {
    contributionsFromTheTreasury: Number(
      getValueViaPath(answers, 'partyIncome.contributionsFromTheTreasury'),
    ),
    parliamentaryPartySupport: Number(
      getValueViaPath(answers, 'partyIncome.parliamentaryPartySupport'),
    ),
    municipalContributions: Number(
      getValueViaPath(answers, 'partyIncome.municipalContributions'),
    ),
    contributionsFromLegalEntities: Number(
      getValueViaPath(answers, 'partyIncome.contributionsFromLegalEntities'),
    ),
    contributionsFromIndividuals: Number(
      getValueViaPath(answers, 'partyIncome.contributionsFromIndividuals'),
    ),
    generalMembershipFees: Number(
      getValueViaPath(answers, 'partyIncome.generalMembershipFees'),
    ),
    otherIncome: Number(getValueViaPath(answers, 'partyIncome.otherIncome')),
    capitalIncome: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalIncome'),
    ),
    officeOperations: Number(
      getValueViaPath(answers, 'partyExpense.electionOffice'),
    ),
    otherOperatingExpenses: Number(
      getValueViaPath(answers, 'partyExpense.otherCost'),
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
