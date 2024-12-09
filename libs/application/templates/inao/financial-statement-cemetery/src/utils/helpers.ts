import { ExternalData, FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  BOARDMEMEBER,
  CAPITALNUMBERS,
  CARETAKER,
  CemeteriesBackwardLimit,
  CemeteriesYearAllowed,
  CEMETERYEQUITIESANDLIABILITIESIDS,
  CEMETERYOPERATIONIDS,
  EQUITYANDLIABILITIESTOTALS,
  OPERATINGCOST,
  TOTAL,
} from './constants'
import { FinancialStatementCemetery } from '../lib/dataSchema'
import getYear from 'date-fns/getYear'
import subYears from 'date-fns/subYears'
import { AuditConfig, BoardMember, Config, FSIUSERTYPE } from '../types/types'

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

export const currencyStringToNumber = (str: string) => {
  if (!str) {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}

export const getCurrentUserType = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const fakeUserType: FSIUSERTYPE | undefined = getValueViaPath(
    answers,
    'fakeData.options',
  )

  const currentUserType: FSIUSERTYPE | undefined = getValueViaPath(
    externalData,
    'getUserType.data.value',
  )

  return fakeUserType ? fakeUserType : currentUserType
}

export const getBoardmembersAndCaretakers = (members: Array<BoardMember>) => {
  const careTakers = members
    ?.filter((member) => member.role === CARETAKER)
    .map((member) => member.nationalId)
  const boardMembers = members
    ?.filter((member) => member.role === BOARDMEMEBER)
    ?.map((member) => member.nationalId)

  return { careTakers, boardMembers }
}

export const isCemetryUnderFinancialLimit = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const userType = getCurrentUserType(answers, externalData)
  const applicationAnswers = answers as FinancialStatementCemetery
  const careTakerLimit =
    applicationAnswers.cemeteryOperation?.incomeLimit ?? '0'
  const fixedAssetsTotal = applicationAnswers.cemeteryAsset?.fixedAssetsTotal
  const isCemetry = userType === FSIUSERTYPE.CEMETRY
  const totalIncome = isCemetry ? applicationAnswers.cemeteryIncome?.total : '0'
  const longTermDebt = applicationAnswers.cemeteryLiability?.longTerm
  const isUnderLimit = Number(totalIncome) < Number(careTakerLimit)
  if (
    isCemetry &&
    isUnderLimit &&
    fixedAssetsTotal === '0' &&
    longTermDebt === '0'
  ) {
    return true
  }
  return false
}

export const getYearOptions = (data: AuditConfig) => {
  let yearLimit: string | undefined
  let countYearBackwardsFrom: string | undefined
  data.financialStatementsInaoConfig.forEach((item) => {
    if (item.key === CemeteriesBackwardLimit) {
      yearLimit = item.value
    }

    if (item.key === CemeteriesYearAllowed) {
      countYearBackwardsFrom = item.value
    }
  })

  if (!countYearBackwardsFrom) {
    return []
  }

  return possibleOperatingYears(yearLimit || '1', countYearBackwardsFrom)
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

export const getConfigInfoForKey = (config: Config[], configKey: string) => {
  return config?.filter((config: Config) => config.key === configKey)[0].value
}

export const formatCurrency = (answer?: string) => {
  if (!answer) return '0. kr'
  return answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
}

export const isPositiveNumberInString = (input: string) => {
  return Number(input) > 0
}

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
