import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isSameAsApplicant = (
  answers: FormValue,
  fieldKey: string,
): boolean => {
  const isSameAsApplicantArr =
    getValueViaPath<string[]>(answers, `${fieldKey}.isSameAsApplicant`) || []
  return isSameAsApplicantArr?.includes(YES)
}
