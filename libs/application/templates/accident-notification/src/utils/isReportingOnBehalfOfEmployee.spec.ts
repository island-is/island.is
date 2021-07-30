import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'
import { isReportingOnBehalfOfEmployee } from './isReportingOnBehalfOfEmployee'
describe('isReportingOnBehalfOfEmployee', () => {
  const onBehalfOfEmployee: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.JURIDICALPERSON,
    },
  }

  const onBehalfOfSomeOtherPerson: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
  }

  const emptyObject = {}

  it('should return true if reporting on behalf of employee', () => {
    expect(isReportingOnBehalfOfEmployee(onBehalfOfEmployee)).toEqual(true)
  })
  it('should return false if reporting on behalf of some other person', () => {
    expect(isReportingOnBehalfOfEmployee(onBehalfOfSomeOtherPerson)).toEqual(
      false,
    )
  })
  it('should return false for empty object', () => {
    expect(isReportingOnBehalfOfEmployee(emptyObject)).toEqual(false)
  })
})
