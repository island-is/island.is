import { FormValue } from '@island.is/application/types'
import { isReportingOnBehalfSelf } from './isReportingBehalfOfSelf'
import { WhoIsTheNotificationForEnum } from '../types'

describe('isRepresentativeOfCompanyOrInstitute', () => {
  const self: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
  }

  const notSelf: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
  }

  it('should return true when someone is reporting on behalf of themselves', () => {
    expect(isReportingOnBehalfSelf(self)).toEqual(true)
  })
  it('should return false when someone is not reporting on behalf of themselves', () => {
    expect(isReportingOnBehalfSelf(notSelf)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isReportingOnBehalfSelf({})).toEqual(false)
  })
})
