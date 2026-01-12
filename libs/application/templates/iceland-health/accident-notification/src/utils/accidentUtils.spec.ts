import { FormValue } from '@island.is/application/types'
import {
  getInjuredPersonInformation,
  isFatalAccident,
  isHomeActivitiesAccident,
  isRescueWorkAccident,
  isStudiesAccident,
  isWorkAccident,
} from './accidentUtils'
import { NO, YES } from '@island.is/application/core'
import { AccidentTypeEnum } from './enums'

describe('isHomeActivitiesAccident', () => {
  const homeActivitiesAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.RESCUEWORK },
  }

  const emptyObject = {}

  it('should return true for home activity accidents', () => {
    expect(isHomeActivitiesAccident(homeActivitiesAccident)).toEqual(true)
  })
  it('should return false for accidents other than home activity accidents', () => {
    expect(isHomeActivitiesAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isHomeActivitiesAccident(emptyObject)).toEqual(false)
  })
})
describe('isWorkAccident', () => {
  const workAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const emptyObject = {}

  it('should return true for work accidents', () => {
    expect(isWorkAccident(workAccident)).toEqual(true)
  })
  it('should return false for accidents other than work', () => {
    expect(isWorkAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isWorkAccident(emptyObject)).toEqual(false)
  })
})

describe('isRescueWorkAccident', () => {
  const rescueWorkAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.RESCUEWORK },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const emptyObject = {}

  it('should return true for rescue work accidents', () => {
    expect(isRescueWorkAccident(rescueWorkAccident)).toEqual(true)
  })
  it('should return false for accidents other than rescue work', () => {
    expect(isRescueWorkAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isRescueWorkAccident(emptyObject)).toEqual(false)
  })
})

describe('isStudiesAccident', () => {
  const studiesAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.STUDIES },
  }

  const someOtherAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const emptyObject = {}

  it('should return true for studies accidents', () => {
    expect(isStudiesAccident(studiesAccident)).toEqual(true)
  })
  it('should return false for accidents other than studies', () => {
    expect(isStudiesAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isStudiesAccident(emptyObject)).toEqual(false)
  })
})

describe('getInjuredPersonInformation', () => {
  const injuredPersonInformation: FormValue = {
    injuredPersonInformation: {
      email: 'kalli@palli.is',
      name: 'Kalli',
    },
  }

  const emptyInjuredPersonInformation: FormValue = {
    injuredPersonInformation: {
      email: '',
      name: '',
    },
  }

  it('Should return the email of the injured person', () => {
    expect(
      getInjuredPersonInformation(injuredPersonInformation)?.email,
    ).toEqual('kalli@palli.is')
  })

  it('Should return the name of the injured person', () => {
    expect(getInjuredPersonInformation(injuredPersonInformation)?.name).toEqual(
      'Kalli',
    )
  })

  it('Should return empty string for email if not provided', () => {
    expect(
      getInjuredPersonInformation(emptyInjuredPersonInformation)?.email,
    ).toEqual('')
  })

  it('Should return empty string for name if not provided', () => {
    expect(
      getInjuredPersonInformation(emptyInjuredPersonInformation)?.name,
    ).toEqual('')
  })
})

describe('isFatalAccident', () => {
  const fatal: FormValue = {
    wasTheAccidentFatal: YES,
  }

  const notFatal: FormValue = {
    wasTheAccidentFatal: NO,
  }

  it('should return true for a fatal accident', () => {
    expect(isFatalAccident(fatal)).toEqual(true)
  })
  it('should return false for a non fatal accident', () => {
    expect(isFatalAccident(notFatal)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isFatalAccident({})).toEqual(false)
  })
})
