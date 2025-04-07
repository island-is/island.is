import { FormValue } from '@island.is/application/types'
import { LESS, GREATER } from './constants'
import { getValueViaPath } from '@island.is/application/core'

export const isLessThanIncomeLimit = (answers: FormValue) =>
  getValueViaPath(answers, 'election.incomeLimit') === LESS

export const isGreaterThanIncomeLimit = (answers: FormValue) =>
  getValueViaPath(answers, 'election.incomeLimit') === GREATER
