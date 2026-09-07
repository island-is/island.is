import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const incomeOtherIncomeYes = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'incomeHasOtherIncome') === YES

export const contractorIncomeSelected = (answers: FormValue) =>
  incomeOtherIncomeYes(answers) &&
  (
    getValueViaPath<string[]>(answers, 'incomeContractorCheckbox') ?? []
  ).includes(YES)

export const foreignIncomeSelected = (answers: FormValue) =>
  incomeOtherIncomeYes(answers) &&
  (getValueViaPath<string[]>(answers, 'incomeForeignCheckbox') ?? []).includes(
    YES,
  )

export const otherIncomeSelected = (answers: FormValue) =>
  incomeOtherIncomeYes(answers) &&
  (getValueViaPath<string[]>(answers, 'incomeOtherCheckbox') ?? []).includes(
    YES,
  )

export const incomeRadioClearChildren = [
  'incomeContractorCheckbox',
  'incomeForeignCheckbox',
  'incomeOtherCheckbox',
  'incomeContractorDescription',
  'incomeForeignDescription',
  'incomeOtherDescription',
] as const
