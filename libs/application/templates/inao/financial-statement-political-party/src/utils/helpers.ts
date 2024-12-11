import { Config } from '../types/types'
import subYears from 'date-fns/subYears'
import getYear from 'date-fns/getYear'
import {
  CAPITALNUMBERS,
  EQUITIESANDLIABILITIESIDS,
  EQUITYANDLIABILITIESTOTALS,
  PARTYOPERATIONIDS,
  TOTAL,
} from './constants'
import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

export const getConfigInfoForKey = (config: Config[], configKey: string) => {
  return config?.filter((config: Config) => config.key === configKey)[0].value
}

export const possibleOperatingYears = (
  yearLimit: string,
  countYearBackwardsFrom: string,
) => {
  const countFromYear = new Date(countYearBackwardsFrom)
  const backwardsYearLimit = Number(yearLimit)
  const operationYears = Array(backwardsYearLimit)
    .fill('')
    .map((_, index) => {
      const dateDiff = subYears(countFromYear, index)
      const yearsFromNow = getYear(dateDiff).toString()
      return { label: yearsFromNow, value: yearsFromNow }
    })
  return operationYears
}

export const getTotal = (values: Record<string, string>, key: string) => {
  if (!values[key]) {
    return 0
  }
  const total = Object.entries(values[key])
    .filter(([k, v]) => k !== TOTAL && !isNaN(Number(v)))
    .map(([_k, v]) => Number(v))
    .reduce((prev, current) => {
      return (prev += current)
    }, 0)
  return total
}

export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatNumber = (num: number) => num.toLocaleString('de-DE')

export const checkIfNegative = (inputNumber: string) => Number(inputNumber) >= 0

export const sumIncome = (answers: FormValue) => {
  const contributionsFromTheTreasury = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.contributionsFromTheTreasury,
  )
  const parliamentaryPartySupport = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.parliamentaryPartySupport,
  )
  const municipalContributions = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.municipalContributions,
  )
  const contributionsFromLegalEntities = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.contributionsFromLegalEntities,
  )
  const contributionsFromIndividuals = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.contributionsFromIndividuals,
  )
  const generalMembershipFees = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.generalMembershipFees,
  )
  const otherIncome = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.otherIncome,
  )

  return `${
    parseInt(contributionsFromTheTreasury || '0') +
    parseInt(parliamentaryPartySupport || '0') +
    parseInt(municipalContributions || '0') +
    parseInt(contributionsFromLegalEntities || '0') +
    parseInt(contributionsFromIndividuals || '0') +
    parseInt(generalMembershipFees || '0') +
    parseInt(otherIncome || '0')
  }`
}

export const sumExpenses = (answers: FormValue) => {
  const electionOffice = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.electionOffice,
  )
  const otherCost = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.otherCost,
  )

  return `${parseInt(electionOffice || '0') + parseInt(otherCost || '0')}`
}

export const sumTotal = (answers: FormValue) => {
  const income = getValueViaPath<string>(answers, PARTYOPERATIONIDS.totalIncome)
  const expenses = getValueViaPath<string>(
    answers,
    PARTYOPERATIONIDS.totalExpense,
  )
  return `${parseInt(income || '0') - parseInt(expenses || '0')}`
}

export const sumCapitalNumbers = (answers: FormValue) => {
  const capitalIncome = getValueViaPath<string>(
    answers,
    CAPITALNUMBERS.capitalIncome,
  )
  const capitalCost = getValueViaPath<string>(
    answers,
    CAPITALNUMBERS.capitalCost,
  )
  return `${parseInt(capitalIncome || '0') - parseInt(capitalCost || '0')}`
}

export const sumProperties = (answers: FormValue) => {
  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
  )
  const currentAssets = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.currentAssets,
  )
  return `${parseInt(fixedAssetsTotal || '0') + parseInt(currentAssets || '0')}`
}

export const sumDebts = (answers: FormValue) => {
  const longTerm = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.longTerm,
  )
  const shortTerm = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.shortTerm,
  )
  return `${parseInt(longTerm || '0') + parseInt(shortTerm || '0')}`
}

export const sumEquityAndDebts = (answers: FormValue) => {
  const totalEquity = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.totalEquity,
  )
  const totalLiability = getValueViaPath<string>(
    answers,
    EQUITYANDLIABILITIESTOTALS.liabilitiesTotal,
  )
  return `${parseInt(totalEquity || '0') + parseInt(totalLiability || '0')}`
}

export const showEquitiesAndLiabilitiesAlert = (answers: FormValue) => {
  // Assets
  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
  )
  const currentAssets = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.currentAssets,
  )
  const totalAssets = getValueViaPath<string>(
    answers,
    EQUITYANDLIABILITIESTOTALS.assetsTotal,
  )

  // Debts
  const longTerm = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.longTerm,
  )
  const shortTerm = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.shortTerm,
  )
  const totalLiability = getValueViaPath<string>(
    answers,
    EQUITYANDLIABILITIESTOTALS.liabilitiesTotal,
  )

  // Equity
  const totalEquity = getValueViaPath<string>(
    answers,
    EQUITIESANDLIABILITIESIDS.totalEquity,
  )

  // Total Equity and Liabilities
  const totalEquityAndLiabilities = getValueViaPath<string>(
    answers,
    EQUITYANDLIABILITIESTOTALS.equityAndLiabilitiesTotal,
  )

  if (
    !fixedAssetsTotal ||
    !currentAssets ||
    !totalAssets ||
    !longTerm ||
    !shortTerm ||
    !totalLiability ||
    !totalEquity ||
    !totalEquityAndLiabilities
  ) {
    return false
  }
  return totalAssets !== totalEquityAndLiabilities
}
