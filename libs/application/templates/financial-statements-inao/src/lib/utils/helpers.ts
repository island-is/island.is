import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import subYears from 'date-fns/subYears'
import getYear from 'date-fns/getYear'
import { BOARDMEMEBER, CARETAKER, TOTAL } from '../constants'
import { BoardMember, FSIUSERTYPE } from '../../types'

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

export const formatNumber = (num: number) => num.toLocaleString('de-DE')

export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const possibleOperatingYears = (yearLimit: string) => {
  const currentDate = new Date()
  const backwardsYearLimit = Number(yearLimit)
  const operationYears = Array(backwardsYearLimit)
    .fill('')
    .map((_, index) => {
      const dateDiff = subYears(currentDate, index + 1)
      const yearsFromNow = getYear(dateDiff).toString()
      return { label: yearsFromNow, value: yearsFromNow }
    })
  return operationYears
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

export const currencyStringToNumber = (str: string) => {
  if (!str) {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}

export const getBoardmembersAndCaretakers = (members: BoardMember[]) => {
  const careTakers = members
    .filter((member) => member.role === CARETAKER)
    .map((member) => member.nationalId)
  const boardMembers = members
    .filter((member) => member.role === BOARDMEMEBER)
    .map((member) => member.nationalId)

  return { careTakers, boardMembers }
}
