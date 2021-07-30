import { FormValue } from '@island.is/application/core'
import { WhoIsTheNotificationForEnum } from '../types'
import { isSubmittingOnBehalfOfEmployee } from './isSubmittingOnBehalfOfEmployee'
describe('isSubmittingOnBehalfOfEmployee', () => {
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

  it('should return true if submitting on behalf of employee', () => {
    expect(isSubmittingOnBehalfOfEmployee(onBehalfOfEmployee)).toEqual(true)
  })
  it('should return false if submitting on behalf of some other person', () => {
    expect(isSubmittingOnBehalfOfEmployee(onBehalfOfSomeOtherPerson)).toEqual(
      false,
    )
  })
  it('should return false for empty object', () => {
    expect(isSubmittingOnBehalfOfEmployee(emptyObject)).toEqual(false)
  })
})
