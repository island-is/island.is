import { FormValue } from '@island.is/application/core'
import {
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from '../types'
import { isUploadNow } from './isUploadNow'

describe('isUploadNow', () => {
  const powerOfAttorneyReporterWithUploadNow: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
    powerOfAttorney: {
      type: PowerOfAttorneyUploadEnum.UPLOADNOW,
    },
  }

  const powerOfAttorneyReporterWithUploadLater: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
    powerOfAttorney: {
      type: PowerOfAttorneyUploadEnum.UPLOADLATER,
    },
  }

  const reportingForSelf: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
  }

  const emptyObject = {}

  it('should return true for power of attorney reporter with upload now', () => {
    expect(isUploadNow(powerOfAttorneyReporterWithUploadNow)).toEqual(true)
  })

  it('should return false for power of attorney reporter with upload later', () => {
    expect(isUploadNow(powerOfAttorneyReporterWithUploadLater)).toEqual(false)
  })

  it('should return false for reporting for yourself', () => {
    expect(isUploadNow(reportingForSelf)).toEqual(false)
  })

  it('should return false for empty object', () => {
    expect(isUploadNow(emptyObject)).toEqual(false)
  })
})
