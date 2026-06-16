import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const devMockEnabled = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'devMockSettings.useMock') === YES

export const devMockTaxChecked = (answers: FormValue) => {
  const tax = getValueViaPath<string[]>(
    answers,
    'devMockSettings.mockTaxReturn',
  )
  return Array.isArray(tax) && tax.includes(YES)
}
