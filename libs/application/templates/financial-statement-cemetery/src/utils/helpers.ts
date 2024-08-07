import { ExternalData, FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { BOARDMEMEBER, CARETAKER, TOTAL } from './constants'
import { FinancialStatementCemetery } from '../lib/dataSchema'
import getYear from 'date-fns/getYear'
import subYears from 'date-fns/subYears'
import { BoardMember, Config, FSIUSERTYPE } from '../types/types'

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

export const formatCurrency = (answer?: string) => {
  if (!answer) return '0. kr'
  return answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
}
