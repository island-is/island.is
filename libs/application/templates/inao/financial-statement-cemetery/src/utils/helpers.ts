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
  data.financialStatementsInaoConfig.map((item) => {
    if (item.key === CemeteriesBackwardLimit) {
      yearLimit = item.value
    }
  })

  let countYearBackwardsFrom: string | undefined
  data.financialStatementsInaoConfig.map((item) => {
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

export const checkIfNegative = (inputNumber: string) => {
  if (Number(inputNumber) < 0) {
    return false
  } else {
    return true
  }
}

export const sumIncome = (answers: FormValue) => {
  const careIncome = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.careIncome,
  )
  const burialRevenue = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.burialRevenue,
  )
  const grantFromTheCemeteryFund = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.grantFromTheCemeteryFund,
  )
  const otherIncome = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.otherIncome,
  )

  return `${
    Number(careIncome) +
    Number(burialRevenue) +
    Number(grantFromTheCemeteryFund) +
    Number(otherIncome)
  }`
}

export const sumExpenses = (answers: FormValue) => {
  const payroll = getValueViaPath<string>(answers, CEMETERYOPERATIONIDS.payroll)
  const funeralCost = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.funeralCost,
  )
  const chapelExpense = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.chapelExpense,
  )
  const donationsToCemeteryFund = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.donationsToCemeteryFund,
  )
  const donationsToOther = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.donationsToOther,
  )
  const otherOperationCost = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.otherOperationCost,
  )
  const depreciation = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.depreciation,
  )

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
  const income = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.totalIncome,
  )
  const expenses = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.totalExpense,
  )

  return `${Number(income) - Number(expenses)}`
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
  return `${Number(capitalIncome) - Number(capitalCost)}`
}

export const sumAssets = (answers: FormValue) => {
  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
  )
  const currentAssets = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets,
  )
  return `${Number(fixedAssetsTotal) + Number(currentAssets)}`
}

export const sumLiabilities = (answers: FormValue) => {
  const longTerm = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.longTerm,
  )
  const shortTerm = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm,
  )
  return `${Number(longTerm) + Number(shortTerm)}`
}

export const operationResult = (answers: FormValue) => {
  const operatingTotalCost = getValueViaPath<string>(
    answers,
    OPERATINGCOST.total,
  )
  const capitalTotal = getValueViaPath<string>(answers, CAPITALNUMBERS.total)
  return `${Number(operatingTotalCost) + Number(capitalTotal)}`
}

export const sumTotalEquity = (answers: FormValue) => {
  const equityAtTheBeginningOfTheYear = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
  )
  const revaluationDueToPriceChanges = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
  )
  const reevaluateOther = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther,
  )
  const operationResult = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.operationResult,
  )

  return `${
    Number(equityAtTheBeginningOfTheYear) +
    Number(revaluationDueToPriceChanges) +
    Number(reevaluateOther) +
    Number(operationResult)
  }`
}

export const sumTotalEquityAndLiabilities = (answers: FormValue) => {
  const liabilityTotal = getValueViaPath<string>(
    answers,
    EQUITYANDLIABILITIESTOTALS.liabilitiesTotal,
  )
  const totalEquity = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.equityTotal,
  )

  return `${Number(totalEquity) + Number(liabilityTotal)}`
}

export const showEquitiesAndLiabilitiesAlert = (answers: FormValue) => {
  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
  )
  const currentAssets = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets,
  )
  const longTerm = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.longTerm,
  )
  const shortTerm = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm,
  )
  const equityAtTheBeginningOfTheYear = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
  )
  const revaluationDueToPriceChanges = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
  )
  const reevaluateOther = getValueViaPath<string>(
    answers,
    CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther,
  )

  const totalAssets = getValueViaPath<string>(
    answers,
    EQUITYANDLIABILITIESTOTALS.assetsTotal,
  )
  const totalEquityAndLiabilities = getValueViaPath<string>(
    answers,
    EQUITYANDLIABILITIESTOTALS.equityAndLiabilitiesTotal,
  )

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
