import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const mapValuesToPartyTypes = (answers: FormValue) => {
  return {
    contributionsFromTheTreasury: Number(
      getValueViaPath<string>(
        answers,
        'partyIncome.contributionsFromTheTreasury',
      ),
    ),
    parliamentaryPartySupport: Number(
      getValueViaPath<string>(answers, 'partyIncome.parliamentaryPartySupport'),
    ),
    municipalContributions: Number(
      getValueViaPath<string>(answers, 'partyIncome.municipalContributions'),
    ),
    contributionsFromLegalEntities: Number(
      getValueViaPath<string>(
        answers,
        'partyIncome.contributionsFromLegalEntities',
      ),
    ),
    contributionsFromIndividuals: Number(
      getValueViaPath<string>(
        answers,
        'partyIncome.contributionsFromIndividuals',
      ),
    ),
    generalMembershipFees: Number(
      getValueViaPath<string>(answers, 'partyIncome.generalMembershipFees'),
    ),
    otherIncome: Number(
      getValueViaPath<string>(answers, 'partyIncome.otherIncome'),
    ),
    officeOperations: Number(
      getValueViaPath<string>(answers, 'partyExpense.electionOffice'),
    ),
    otherOperatingExpenses: Number(
      getValueViaPath<string>(answers, 'partyExpense.otherCost'),
    ),
    capitalIncome: Number(
      getValueViaPath<string>(answers, 'capitalNumbers.capitalIncome'),
    ),
    financialExpenses: Number(
      getValueViaPath<string>(answers, 'capitalNumbers.capitalCost'),
    ),
    fixedAssetsTotal: Number(
      getValueViaPath<string>(answers, 'asset.fixedAssetsTotal'),
    ),
    currentAssets: Number(
      getValueViaPath<string>(answers, 'asset.currentAssets'),
    ),
    longTermLiabilitiesTotal: Number(
      getValueViaPath<string>(answers, 'liability.longTerm'),
    ),
    shortTermLiabilitiesTotal: Number(
      getValueViaPath<string>(answers, 'liability.shortTerm'),
    ),
    equityTotal: Number(getValueViaPath<string>(answers, 'equity.totalEquity')),
  }
}
