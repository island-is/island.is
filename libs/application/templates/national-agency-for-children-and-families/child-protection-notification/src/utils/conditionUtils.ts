import { NO, YES, getValueViaPath } from '@island.is/application/core'
import { KnowsNationalId } from './constants'

export const isUnborn = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'child.knowsNationalId') === KnowsNationalId.UNBORN

export const isNoNationalId = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'child.knowsNationalId') === KnowsNationalId.NO

export const knowsParentIds = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'expectantParents.knowsParentNationalIds') === YES

export const doesNotKnowParentIds = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'expectantParents.knowsParentNationalIds') === NO

export const parentSectionVisible = (answers: Record<string, unknown>) =>
  knowsParentIds(answers) || doesNotKnowParentIds(answers)
