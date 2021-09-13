import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'
import { isReportingOnBehalfOfChild } from './isReportingOnBehalfOfChild'
describe('isReportingOnBehalfOfChild', () => {
  const onBehalfOfChild: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.CHILDINCUSTODY,
    },
  }

  const onBehalfOfSomeOtherPerson: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
  }

  const emptyObject = {}

  it('should return true if reporting on behalf of child', () => {
    expect(isReportingOnBehalfOfChild(onBehalfOfChild)).toEqual(true)
  })
  it('should return false if reporting on behalf of some other person', () => {
    expect(isReportingOnBehalfOfChild(onBehalfOfSomeOtherPerson)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isReportingOnBehalfOfChild(emptyObject)).toEqual(false)
  })
})
