import { ExternalData, FormValue } from '@island.is/application/types'
import { BOARDMEMEBER, CARETAKER } from './constants'
import { FinancialStatementCemetery } from '../lib/dataSchema'
import getYear from 'date-fns/getYear'
import subYears from 'date-fns/subYears'
import { BoardMember, Config, FSIUSERTYPE } from '../types/types'
import {
  getCurrentUserType,
  currencyStringToNumber,
} from '../../../shared/utils/helpers'

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
  const isUnderLimit = currencyStringToNumber(totalIncome) < careTakerLimit
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
