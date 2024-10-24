import { FormValue } from '@island.is/application/types'
import { NO, YES } from './constants'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import { isMachineRelatedAccident } from './isMachineRelatedAccident'
describe('isMachineRelatedAccident', () => {
  const machineRelatedAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
    workMachineRadio: YES,
  }

  const nonMachineRelatedAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
    workMachineRadio: NO,
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for machine related general work accidents', () => {
    expect(isMachineRelatedAccident(machineRelatedAccident)).toEqual(true)
  })
  it('should return false for non machine related general work accidents', () => {
    expect(isMachineRelatedAccident(nonMachineRelatedAccident)).toEqual(false)
  })
  it('should return false for workplace accidents other than general', () => {
    expect(isMachineRelatedAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isMachineRelatedAccident(emptyObject)).toEqual(false)
  })
})
