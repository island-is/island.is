import { getValueViaPath } from '@island.is/application/core'

export const isCasualWork = (answers: Record<string, unknown>) =>
  getValueViaPath<string>(answers, 'typeOfIncome') === 'casualWork'

export const isPartTime = (answers: Record<string, unknown>) =>
  getValueViaPath<string>(answers, 'typeOfIncome') === 'partTime'

export const isContractWork = (answers: Record<string, unknown>) =>
  getValueViaPath<string>(answers, 'typeOfIncome') === 'contractWork'

export const isCapitalIncome = (answers: Record<string, unknown>) =>
  getValueViaPath<string>(answers, 'typeOfIncome') === 'capitalIncome'

export const isPension = (answers: Record<string, unknown>) =>
  getValueViaPath<string>(answers, 'typeOfIncome') === 'pension'

export const isSocialInsurance = (answers: Record<string, unknown>) =>
  getValueViaPath<string>(answers, 'typeOfIncome') === 'socialInsurance'
