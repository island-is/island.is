import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'
import { isPowerOfAttorney } from './isPowerOfAttorney'

describe('isPowerOfAttorney', () => {
  const powerOfAttorneyReporter: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
  }

  const juridicialPersonReporter: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.JURIDICALPERSON,
    },
  }

  const reportingForSelf: FormValue = {
    whoIsTheNotificationFor: { answer: WhoIsTheNotificationForEnum.ME },
  }

  const emptyObject = {}

  it('should return true for power of attorney reporter', () => {
    expect(isPowerOfAttorney(powerOfAttorneyReporter)).toEqual(true)
  })

  it('should return false for power of juridical person reporter', () => {
    expect(isPowerOfAttorney(juridicialPersonReporter)).toEqual(false)
  })

  it('should return false for reporting for yourself', () => {
    expect(isPowerOfAttorney(reportingForSelf)).toEqual(false)
  })

  it('should return false for empty object', () => {
    expect(isPowerOfAttorney(emptyObject)).toEqual(false)
  })
})
