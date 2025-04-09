import { FormValue } from '@island.is/application/types'
import {
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
  isReportingOnBehalfSelf,
} from './reportingUtils'
import { WhoIsTheNotificationForEnum } from './enums'

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
