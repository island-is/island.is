import { NO, YES, getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { KnowsNationalId } from './constants'
import { getApplicationAnswers } from './getApplicationAnswers'

export const isKnowsNationalId = (answers: FormValue) =>
  getApplicationAnswers(answers).childKnowsNationalId === KnowsNationalId.YES

export const isUnborn = (answers: FormValue) =>
  getValueViaPath(answers, 'child.knowsNationalId') === KnowsNationalId.UNBORN

export const isNoNationalId = (answers: FormValue) =>
  getValueViaPath(answers, 'child.knowsNationalId') === KnowsNationalId.NO

export const knowsParentIds = (answers: FormValue) =>
  getValueViaPath(answers, 'expectantParents.knowsParentNationalIds') === YES

export const doesNotKnowParentIds = (answers: FormValue) =>
  getValueViaPath(answers, 'expectantParents.knowsParentNationalIds') === NO
