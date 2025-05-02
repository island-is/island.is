import { FormValue } from '@island.is/application/types'
import { getAccidentTypeOptions } from './getOptions'
import { AccidentTypeEnum, WhoIsTheNotificationForEnum } from './enums'

describe('getAccidentTypeOptions', () => {
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

  it('should return an array of length 4 when submitting on behalf of employee', () => {
    expect(getAccidentTypeOptions(onBehalfOfEmployee)).toHaveLength(4)
  })

  it('should return an array of length 5 when not submitting on behalf of employee', () => {
    expect(getAccidentTypeOptions(onBehalfOfSomeOtherPerson)).toHaveLength(5)
  })

  it('should return an array of length 5 for empty object', () => {
    expect(getAccidentTypeOptions(onBehalfOfSomeOtherPerson)).toHaveLength(5)
  })

  it('should have work as first option when submitting on behalf of employee', () => {
    const firstOption = getAccidentTypeOptions(onBehalfOfEmployee)[0]
    expect(firstOption.value).toBe(AccidentTypeEnum.WORK)
  })

  it('should have home activites as first option when not submitting on behalf of employee', () => {
    const firstOption = getAccidentTypeOptions(onBehalfOfSomeOtherPerson)[0]
    expect(firstOption.value).toBe(AccidentTypeEnum.HOMEACTIVITIES)
  })

  it('should have home activites as first option when for empty object', () => {
    const firstOption = getAccidentTypeOptions(emptyObject)[0]
    expect(firstOption.value).toBe(AccidentTypeEnum.HOMEACTIVITIES)
  })
})
