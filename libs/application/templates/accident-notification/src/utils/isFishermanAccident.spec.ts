import { FormValue } from '@island.is/application/core'
import { WorkAccidentTypeEnum } from '../types'
import { isFishermanAccident } from './isFishermanAccident'
describe('isFishermanAccident', () => {
  const fishermanAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for fisherman accidents', () => {
    expect(isFishermanAccident(fishermanAccident)).toEqual(true)
  })
  it('should return true for workplace accidents other than fisherman', () => {
    expect(isFishermanAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isFishermanAccident(emptyObject)).toEqual(false)
  })
})
