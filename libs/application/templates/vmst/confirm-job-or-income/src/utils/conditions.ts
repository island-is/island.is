import { getValueViaPath } from '@island.is/application/core'

export const isCasualWork = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes('casualWork') ??
  false

export const isPartTime = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes('partTime') ??
  false

export const isContractWork = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes(
    'contractWork',
  ) ?? false

export const isCapitalIncome = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes(
    'capitalIncome',
  ) ?? false

export const isPension = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes('pension') ??
  false

export const isSocialInsurance = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes(
    'socialInsurance',
  ) ?? false
