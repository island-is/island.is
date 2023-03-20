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

export const mapValuesToPartytype = (answers: FormValue) => {
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

export const mapValuesToCemeterytype = (answers: FormValue) => {
  return {
    careIncome: Number(getValueViaPath(answers, 'cemetryIncome.careIncome')),
    burialRevenue: Number(
      getValueViaPath(answers, 'cemetryIncome.burialRevenue'),
    ),
    grantFromTheCemeteryFund: Number(
      getValueViaPath(answers, 'cemetryIncome.grantFromTheCemeteryFund'),
    ),
    otherIncome: Number(getValueViaPath(answers, 'cemetryIncome.otherIncome')),
    salaryAndSalaryRelatedExpenses: Number(
      getValueViaPath(answers, 'cemetryExpense.payroll'),
    ),
    operationOfAFuneralChapel: Number(
      getValueViaPath(answers, 'cemetryExpense.chapelExpense'),
    ),
    funeralExpenses: Number(
      getValueViaPath(answers, 'cemetryExpense.funeralCost'),
    ),
    donationsToCemeteryFund: Number(
      getValueViaPath(answers, 'cemetryExpense.cemeteryFundExpense'),
    ),
    contributionsAndGrantsToOthers: Number(
      getValueViaPath(answers, 'cemetryExpense.donationsToOther'),
    ),
    otherOperatingExpenses: Number(
      getValueViaPath(answers, 'cemetryExpense.otherOperationCost'),
    ),
    depreciation: Number(
      getValueViaPath(answers, 'cemetryExpense.depreciation'),
    ),
    financialExpenses: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalCost'),
    ),
    capitalIncome: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalIncome'),
    ),
    fixedAssetsTotal: Number(
      getValueViaPath(answers, 'cemetryAsset.fixedAssetsTotal'),
    ),
    currentAssets: Number(
      getValueViaPath(answers, 'cemetryAsset.currentAssets'),
    ),
    longTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'cemetryLiability.longTerm'),
    ),
    shortTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'cemetryLiability.shortTerm'),
    ),
    equityAtTheBeginningOfTheYear: Number(
      getValueViaPath(answers, 'cemetryEquity.equityAtTheBeginningOfTheYear'),
    ),
    revaluationDueToPriceChanges: Number(
      getValueViaPath(answers, 'cemetryEquity.revaluationDueToPriceChanges'),
    ),
    reassessmentOther: Number(
      getValueViaPath(answers, 'cemetryEquity.reevaluateOther'),
    ),
  }
}
