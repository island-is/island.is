import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ApplicationType } from '../../shared'

export const checkIsFreshman = (answers: FormValue): boolean => {
  return (
    getValueViaPath<ApplicationType>(answers, 'applicationType.value') ===
    ApplicationType.FRESHMAN
  )
}
