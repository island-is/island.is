import { FormValue } from '@island.is/application/core'
import { YES } from '../constants'
import { YesOrNo } from '../types'
import { isGeneralWorkplaceAccident } from './isGeneralWorkplaceAccident'

export const isMachineRelatedAccident = (formValue: FormValue) => {
  const workMachineAnswer = (formValue as {
    workMachineRadio: YesOrNo
  })?.workMachineRadio

  return isGeneralWorkplaceAccident(formValue) && workMachineAnswer === YES
}
