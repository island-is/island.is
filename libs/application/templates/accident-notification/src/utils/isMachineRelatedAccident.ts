import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { YES } from './constants'
import { YesOrNo } from '../types'
import { isGeneralWorkplaceAccident } from './isGeneralWorkplaceAccident'

export const isMachineRelatedAccident = (formValue: FormValue) => {
  const workMachineAnswer = getValueViaPath(
    formValue,
    'workMachineRadio',
  ) as YesOrNo
  return isGeneralWorkplaceAccident(formValue) && workMachineAnswer === YES
}
