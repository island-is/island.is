import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  CAPITALNUMBERS,
  CEMETERYEQUITIESANDLIABILITIESIDS,
  CEMETERYOPERATIONIDS,
  EQUITYANDLIABILITIESTOTALS,
  OPERATINGCOST,
} from './constants'

export const sumIncome = (answers: FormValue) => {
  const careIncome =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.careIncome) || '0'
  const burialRevenue =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.burialRevenue) || '0'
  const grantFromTheCemeteryFund =
    getValueViaPath<string>(
      answers,
      CEMETERYOPERATIONIDS.grantFromTheCemeteryFund,
    ) || '0'
  const otherIncome =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.otherIncome) || '0'

  return `${
    Number(careIncome) +
    Number(burialRevenue) +
    Number(grantFromTheCemeteryFund) +
    Number(otherIncome)
  }`
}

export const sumExpenses = (answers: FormValue) => {
  const payroll = getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.payroll)
  const funeralCost =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.funeralCost) || '0'
  const chapelExpense =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.chapelExpense) || '0'
  const donationsToCemeteryFund =
    getValueViaPath<string>(
      answers,
      CEMETERYOPERATIONIDS.donationsToCemeteryFund,
    ) || '0'
  const donationsToOther =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.donationsToOther) ||
    '0'
  const otherOperationCost =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.otherOperationCost) ||
    '0'
  const depreciation =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.depreciation) || '0'

  return `${
    Number(payroll) +
    Number(funeralCost) +
    Number(chapelExpense) +
    Number(donationsToCemeteryFund) +
    Number(donationsToOther) +
    Number(otherOperationCost) +
    Number(depreciation)
  }`
}

export const sumOperatingResults = (answers: FormValue) => {
  const income =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.totalIncome) || '0'
  const expenses =
    getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.totalExpense) || '0'

  return `${Number(income) - Number(expenses)}`
}

export const sumCapitalNumbers = (answers: FormValue) => {
  const capitalIncome =
    getValueViaPath<string>(answers, CAPITALNUMBERS.capitalIncome) || '0'
  const capitalCost =
    getValueViaPath<string>(answers, CAPITALNUMBERS.capitalCost) || '0'
  return `${Number(capitalIncome) - Number(capitalCost)}`
}

export const sumAssets = (answers: FormValue) => {
  const fixedAssetsTotal =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
    ) || '0'
  const currentAssets =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets,
    ) || '0'
  return `${Number(fixedAssetsTotal) + Number(currentAssets)}`
}

export const sumLiabilities = (answers: FormValue) => {
  const longTerm =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.longTerm,
    ) || '0'
  const shortTerm =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm,
    ) || '0'
  return `${Number(longTerm) + Number(shortTerm)}`
}

export const operationResult = (answers: FormValue) => {
  const operatingTotalCost =
    getValueViaPath<string>(answers, OPERATINGCOST.total) || '0'
  const capitalTotal =
    getValueViaPath<string>(answers, CAPITALNUMBERS.total) || '0'
  return `${Number(operatingTotalCost) + Number(capitalTotal)}`
}

export const sumTotalEquity = (answers: FormValue) => {
  const equityAtTheBeginningOfTheYear =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
    ) || '0'
  const revaluationDueToPriceChanges =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
    ) || '0'
  const reevaluateOther =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther,
    ) || '0'
  const operationResult =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.operationResult,
    ) || '0'

  return `${
    Number(equityAtTheBeginningOfTheYear) +
    Number(revaluationDueToPriceChanges) +
    Number(reevaluateOther) +
    Number(operationResult)
  }`
}

export const sumTotalEquityAndLiabilities = (answers: FormValue) => {
  const liabilityTotal =
    getValueViaPath<string>(
      answers,
      EQUITYANDLIABILITIESTOTALS.liabilitiesTotal,
    ) || '0'
  const totalEquity =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.equityTotal,
    ) || '0'

  return `${Number(totalEquity) + Number(liabilityTotal)}`
}

export const showEquitiesAndLiabilitiesAlert = (answers: FormValue) => {
  const fixedAssetsTotal =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
    ) || '0'
  const currentAssets =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets,
    ) || '0'
  const longTerm =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.longTerm,
    ) || '0'
  const shortTerm =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm,
    ) || '0'
  const equityAtTheBeginningOfTheYear =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
    ) || '0'
  const revaluationDueToPriceChanges =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
    ) || '0'
  const reevaluateOther =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther,
    ) || '0'

  const totalAssets =
    getValueViaPath<string>(answers, EQUITYANDLIABILITIESTOTALS.assetsTotal) ||
    '0'
  const totalEquityAndLiabilities =
    getValueViaPath<string>(
      answers,
      EQUITYANDLIABILITIESTOTALS.equityAndLiabilitiesTotal,
    ) || '0'
  const operationResult =
    getValueViaPath<string>(
      answers,
      CEMETERYEQUITIESANDLIABILITIESIDS.operationResult,
    ) || '0'

  if (
    !fixedAssetsTotal ||
    !currentAssets ||
    !longTerm ||
    !shortTerm ||
    !equityAtTheBeginningOfTheYear ||
    !revaluationDueToPriceChanges ||
    !reevaluateOther ||
    !operationResult
  ) {
    return false
  }
  return totalAssets !== totalEquityAndLiabilities
}
