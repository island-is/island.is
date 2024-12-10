import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  BOARDMEMEBER,
  CARETAKER,
  CemeteriesBackwardLimit,
  CemeteriesYearAllowed,
} from './constants'
import getYear from 'date-fns/getYear'
import subYears from 'date-fns/subYears'
import { AuditConfig, BoardMember } from '../types/types'

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
