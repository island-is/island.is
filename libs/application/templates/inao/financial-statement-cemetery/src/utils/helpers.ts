import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  BOARDMEMEBER,
  CARETAKER,
  CemeteriesBackwardLimit,
  CemeteriesYearAllowed,
  CEMETERYOPERATIONIDS,
  TaxInfoTypes,
} from './constants'
import getYear from 'date-fns/getYear'
import subYears from 'date-fns/subYears'
import { AuditConfig, BoardMember, TaxInfoItem } from '../types/types'

export const getBoardmembersAndCaretakers = (members: Array<BoardMember>) => {
  const careTakers = members
    ?.filter((member) => member.role === CARETAKER)
    .map((member) => member.nationalId)
  const boardMembers = members
    ?.filter((member) => member.role === BOARDMEMEBER)
    ?.map((member) => member.nationalId)

  return { careTakers, boardMembers }
}

export const isCemetryUnderFinancialLimit = (answers: FormValue) => {
  const totalIncome =
    getValueViaPath<string>(answers, 'cemeteryIncome.total') || '0'
  const incomeLimit =
    getValueViaPath<string>(answers, 'cemeteryOperation.incomeLimit') || '0'
  const fixedAssetsTotal =
    getValueViaPath<string>(answers, 'cemeteryAsset.fixedAssetsTotal') || '0'
  const longTermDebt =
    getValueViaPath<string>(answers, 'cemeteryLiability.longTerm') || '0'
  const isUnderLimit = Number(totalIncome) < Number(incomeLimit)

  return isUnderLimit && fixedAssetsTotal === '0' && longTermDebt === '0'
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

export const getCareIncomeAndBurialRevenueAndGrant = (
  taxInfo?: Array<TaxInfoItem>,
) => {
  if (!taxInfo) {
    return {
      careIncome: undefined,
      burialRevenue: undefined,
      grantFromTheCemeteryFund: undefined,
    }
  }

  const careIncome = taxInfo.find(
    (item) => item.key === TaxInfoTypes.CARE_INCOME,
  )
  const burialRevenue = taxInfo.find(
    (item) => item.key === TaxInfoTypes.BURIAL_REVENUE,
  )
  const grantFromTheCemeteryFund = taxInfo.find(
    (item) => item.key === TaxInfoTypes.GRANT_FROM_THE_CEMETERY_FUND,
  )
  const donationsToCemeteryFund = taxInfo.find(
    (item) => item.key === TaxInfoTypes.DONATIONS_TO_CEMETERYFUND,
  )

  return {
    careIncome: careIncome ? careIncome.value : undefined,
    burialRevenue: burialRevenue ? burialRevenue.value : undefined,
    grantFromTheCemeteryFund: grantFromTheCemeteryFund
      ? grantFromTheCemeteryFund.value
      : undefined,
    donationsToCemeteryFund: donationsToCemeteryFund
      ? donationsToCemeteryFund.value
      : undefined,
  }
}

export const getTaxInfoFromAnswers = (answers: FormValue) => {
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
  const donationsToCemeteryFund = getValueViaPath<string>(
    answers,
    CEMETERYOPERATIONIDS.donationsToCemeteryFund,
  )

  return {
    careIncomeFromAnswers: careIncome,
    burialRevenueFromAnswers: burialRevenue,
    grantFromTheCemeteryFundFromAnswers: grantFromTheCemeteryFund,
    donationsToCemeteryFundFromAnswers: donationsToCemeteryFund,
  }
}
