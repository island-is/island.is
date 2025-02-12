import { getValueViaPath } from '@island.is/application/core'
import { ApplicationType } from './enums'
import { FormValue } from '@island.is/application/types'

export const checkIsFreshman = (answers: FormValue): boolean => {
  return (
    getValueViaPath<ApplicationType>(answers, 'applicationType.value') ===
    ApplicationType.FRESHMAN
  )
}
