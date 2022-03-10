import { FormValue } from '@island.is/application/core'
import {
  AccidentTypeEnum,
  FishermanWorkplaceAccidentLocationEnum,
  WorkAccidentTypeEnum,
} from '../types'
import { isAboardShip, isFishermanAccident } from './fishermanUtils'
describe('isFishermanAccident', () => {
  const fishermanAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for fisherman accidents', () => {
    expect(isFishermanAccident(fishermanAccident)).toEqual(true)
  })
  it('should return false for workplace accidents other than fisherman', () => {
    expect(isFishermanAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isFishermanAccident(emptyObject)).toEqual(false)
  })
})

describe('isAboardShip', () => {
  const onTheShipLocation: FormValue = {
    accidentLocation: {
      answer: FishermanWorkplaceAccidentLocationEnum.ONTHESHIP,
    },
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherLocation: FormValue = {
    accidentLocation: { answer: FishermanWorkplaceAccidentLocationEnum.OTHER },
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const emptyObject = {}

  it('should return true for fisherman work accident that happens on a ship', () => {
    expect(isAboardShip(onTheShipLocation)).toEqual(true)
  })
  it('should return false for fisherman work accident that happens else where', () => {
    expect(isAboardShip(someOtherLocation)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isAboardShip(emptyObject)).toEqual(false)
  })
})
