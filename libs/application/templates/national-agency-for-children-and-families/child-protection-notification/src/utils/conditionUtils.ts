import { NO, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { KnowsNationalId } from './constants'
import { getApplicationAnswers } from './getApplicationAnswers'

export const isKnowsNationalId = (answers: FormValue) =>
  getApplicationAnswers(answers).childKnowsNationalId === KnowsNationalId.YES

export const isUnborn = (answers: FormValue) =>
  getApplicationAnswers(answers).childKnowsNationalId === KnowsNationalId.UNBORN

export const isNoNationalId = (answers: FormValue) =>
  getApplicationAnswers(answers).childKnowsNationalId === KnowsNationalId.NO

export const knowsParentIds = (answers: FormValue) =>
  getApplicationAnswers(answers).expectantParentsKnowsNationalIds === YES

export const doesNotKnowParentIds = (answers: FormValue) =>
  getApplicationAnswers(answers).expectantParentsKnowsNationalIds === NO
