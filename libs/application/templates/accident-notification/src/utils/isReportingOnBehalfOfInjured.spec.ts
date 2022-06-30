import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'
import { isReportingOnBehalfOfInjured } from './isReportingOnBehalfOfInjured'

describe('isReportingOnBehalfOfInjured', () => {
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
    expect(isReportingOnBehalfOfInjured(powerOfAttorneyReporter)).toEqual(true)
  })

  it('should return true for power of juridical person reporter', () => {
    expect(isReportingOnBehalfOfInjured(juridicialPersonReporter)).toEqual(true)
  })

  it('should return false for reporting for yourself', () => {
    expect(isReportingOnBehalfOfInjured(reportingForSelf)).toEqual(false)
  })

  it('should return false for empty object', () => {
    expect(isReportingOnBehalfOfInjured(emptyObject)).toEqual(false)
  })
})
