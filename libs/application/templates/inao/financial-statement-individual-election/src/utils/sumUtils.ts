import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  CAPITALNUMBERS,
  EQUITIESANDLIABILITIESIDS,
  INDIVIDUALOPERATIONIDS,
} from './constants'

export const sumIncome = (answers: FormValue) => {
  const contributionsByLegalEntities = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.contributionsByLegalEntities,
  )
  const individualContributions = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.individualContributions,
  )
  const candidatesOwnContributions = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.candidatesOwnContributions,
  )
  const otherIncome = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.otherIncome,
  )

  return `${
    Number(contributionsByLegalEntities) +
    Number(individualContributions) +
    Number(candidatesOwnContributions) +
    Number(otherIncome)
  }`
}

export const sumExpenses = (answers: FormValue) => {
  const electionOffice = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.electionOffice,
  )
  const advertisements = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.advertisements,
  )
  const travelCost = getValueViaPath(answers, INDIVIDUALOPERATIONIDS.travelCost)
  const otherCost = getValueViaPath(answers, INDIVIDUALOPERATIONIDS.otherCost)

  return `${
    Number(electionOffice) +
    Number(advertisements) +
    Number(travelCost) +
    Number(otherCost)
  }`
}

export const sumOperatingCost = (answers: FormValue) => {
  const totalIncome = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.totalIncome,
  )
  const totalExpense = getValueViaPath(
    answers,
    INDIVIDUALOPERATIONIDS.totalExpense,
  )
  return `${Number(totalIncome) - Number(totalExpense)}`
}

export const sumCapitalNumbers = (answers: FormValue) => {
  const capitalIncome = getValueViaPath(answers, CAPITALNUMBERS.capitalIncome)
  const capitalCost = getValueViaPath(answers, CAPITALNUMBERS.capitalCost)

  return `${Number(capitalIncome) - Number(capitalCost)}`
}

export const sumAssets = (answers: FormValue) => {
  const fixedAssetsTotal = getValueViaPath(
    answers,
    EQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
  )
  const currentAssets = getValueViaPath(
    answers,
    EQUITIESANDLIABILITIESIDS.currentAssets,
  )

  return `${Number(fixedAssetsTotal) + Number(currentAssets)}`
}

export const sumDebts = (answers: FormValue) => {
  const longTerm = getValueViaPath(answers, EQUITIESANDLIABILITIESIDS.longTerm)
  const shortTerm = getValueViaPath(
    answers,
    EQUITIESANDLIABILITIESIDS.shortTerm,
  )

  return `${Number(longTerm) + Number(shortTerm)}`
}

export const sumEquityAndLiabilities = (answers: FormValue) => {
  const totalEquity = getValueViaPath(
    answers,
    EQUITIESANDLIABILITIESIDS.totalEquity,
  )
  const totalLiability = getValueViaPath(
    answers,
    EQUITIESANDLIABILITIESIDS.totalLiability,
  )
  return `${Number(totalEquity) + Number(totalLiability)}`
}

export const showEquitiesAndLiabilitiesAlert = (answers: FormValue) => {
  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
  )
  const currentAssets = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.currentAssets,
  )
  const longTerm = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.longTerm,
  )
  const shortTerm = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.shortTerm,
  )

  const totalAssets = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.assetTotal,
  )
  const totalEquityAndLiabilities = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.totalEquityAndLiabilities,
  )

  if (!fixedAssetsTotal || !currentAssets || !longTerm || !shortTerm) {
    return false
  }
  return totalAssets !== totalEquityAndLiabilities
}
