import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

export const isHousingBenefitsNonProduction = () =>
  !isRunningOnEnvironment('production')

export const shouldRenderMockDataSection = () =>
  isHousingBenefitsNonProduction()

export const devMockEnabled = (answers: FormValue) =>
  getValueViaPath<string>(answers, 'devMockSettings.useMock') === YES

export const devMockTaxChecked = (answers: FormValue) => {
  const tax = getValueViaPath<string[]>(
    answers,
    'devMockSettings.mockTaxReturn',
  )
  return Array.isArray(tax) && tax.includes(YES)
}
