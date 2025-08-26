import { FormValue } from '@island.is/application/types'
import { LESS, GREATER } from './constants'
import { getValueViaPath } from '@island.is/application/core'

export const isLessThanIncomeLimit = (answers: FormValue) =>
  getValueViaPath(answers, 'incomeLimit.limit') === LESS

export const isGreaterThanIncomeLimit = (answers: FormValue) =>
  getValueViaPath(answers, 'incomeLimit.limit') === GREATER
