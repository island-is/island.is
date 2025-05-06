import { FormValue } from '@island.is/application/types'
import {
  getWorkplaceData,
  isAboardShip,
  isAgricultureAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isInternshipStudiesAccident,
  isMachineRelatedAccident,
  isProfessionalAthleteAccident,
  isSportAccidentAndEmployee,
} from './occupationUtils'
import { NO, YES } from '@island.is/application/core'
import {
  AccidentTypeEnum,
  FishermanWorkplaceAccidentLocationEnum,
  StudiesAccidentTypeEnum,
  WorkAccidentTypeEnum,
} from './enums'

describe('isAboardShip', () => {
  const onTheShipLocation: FormValue = {
    accidentLocation: {
      answer: FishermanWorkplaceAccidentLocationEnum.ONTHESHIP,
    },
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherLocation: FormValue = {
    accidentLocation: { answer: FishermanWorkplaceAccidentLocationEnum.OTHER },
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const emptyObject = {}

  it('should return true for fisherman work accident that happens on a ship', () => {
    expect(isAboardShip(onTheShipLocation)).toEqual(true)
  })
  it('should return false for fisherman work accident that happens else where', () => {
    expect(isAboardShip(someOtherLocation)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isAboardShip(emptyObject)).toEqual(false)
  })
})

describe('getWorkplaceData', () => {
  const generalWorkplaceAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
    companyInfo: {},
  }

  const professionalAthleteAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.SPORTS },
    companyInfo: { onPayRoll: { answer: YES } },
  }

  const rescueWorkAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.RESCUEWORK },
  }

  const studiesAccident: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.STUDIES },
  }

  const fishermanAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const emptyObject = {}

  it('should return general work type data for general work accidents', () => {
    expect(getWorkplaceData(generalWorkplaceAccident)?.type).toEqual(
      AccidentTypeEnum.WORK,
    )
  })

  it('should return sports type data for professional athlete accidents', () => {
    expect(getWorkplaceData(professionalAthleteAccident)?.type).toEqual(
      AccidentTypeEnum.SPORTS,
    )
  })

  it('should return employee information for professional athlete accidents', () => {
    expect(
      getWorkplaceData(professionalAthleteAccident)?.companyInfo.onPayRoll
        ?.answer,
    ).toBe(YES)
  })

  it('should not return employee information for general workplace accident', () => {
    expect(
      getWorkplaceData(generalWorkplaceAccident)?.companyInfo.onPayRoll,
    ).toBe(undefined)
  })

  it('should return rescue work type data for rescue work accidents', () => {
    expect(getWorkplaceData(rescueWorkAccident)?.type).toEqual(
      AccidentTypeEnum.RESCUEWORK,
    )
  })

  it('should return studies type data for student accidents', () => {
    expect(getWorkplaceData(studiesAccident)?.type).toEqual(
      AccidentTypeEnum.STUDIES,
    )
  })

  it('should return fisherman type data for fisherman accidents', () => {
    expect(getWorkplaceData(fishermanAccident)?.type).toEqual(
      WorkAccidentTypeEnum.FISHERMAN,
    )
  })

  it('should return undefined for empty object', () => {
    expect(getWorkplaceData(emptyObject)?.type).toEqual(undefined)
  })
})

describe('isInternshipStudiesAccident', () => {
  const studiesAccidentType: FormValue = {
    studiesAccident: { type: StudiesAccidentTypeEnum.INTERNSHIP },
  }

  const someOtherAccidentType: FormValue = {
    studiesAccident: { type: StudiesAccidentTypeEnum.APPRENTICESHIP },
  }

  const emptyObject = {}

  it('should return true for studies accidents', () => {
    expect(isInternshipStudiesAccident(studiesAccidentType)).toEqual(true)
  })
  it('should return false for accidents other than studies', () => {
    expect(isInternshipStudiesAccident(someOtherAccidentType)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isInternshipStudiesAccident(emptyObject)).toEqual(false)
  })
})

describe('isMachineRelatedAccident', () => {
  const machineRelatedAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
    workMachineRadio: YES,
  }

  const nonMachineRelatedAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
    workMachineRadio: NO,
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for machine related general work accidents', () => {
    expect(isMachineRelatedAccident(machineRelatedAccident)).toEqual(true)
  })
  it('should return false for non machine related general work accidents', () => {
    expect(isMachineRelatedAccident(nonMachineRelatedAccident)).toEqual(false)
  })
  it('should return false for workplace accidents other than general', () => {
    expect(isMachineRelatedAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isMachineRelatedAccident(emptyObject)).toEqual(false)
  })
})

describe('isSportAccidentAndEmployee', () => {
  const sportAccidentRadio: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.SPORTS },
    onPayRoll: { answer: 'yes' },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: AccidentTypeEnum.HOMEACTIVITIES },
    onPayRoll: { answer: 'yes' },
  }

  const notOnPayroll: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.SPORTS },
    onPayRoll: { answer: 'no' },
  }

  it('should return true for sport accidents where the person is also an employee of the sports club', () => {
    expect(isSportAccidentAndEmployee(sportAccidentRadio)).toEqual(true)
  })

  it('should return false for other accidents', () => {
    expect(isSportAccidentAndEmployee(someOtherAccident)).toEqual(false)
  })

  it('should return false if the person is not on payroll', () => {
    expect(isSportAccidentAndEmployee(notOnPayroll)).toEqual(false)
  })
})

describe('isFishermanAccident', () => {
  const fishermanAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for fisherman accidents', () => {
    expect(isFishermanAccident(fishermanAccident)).toEqual(true)
  })
  it('should return false for workplace accidents other than fisherman', () => {
    expect(isFishermanAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isFishermanAccident(emptyObject)).toEqual(false)
  })
})

describe('isAgricultureAccident', () => {
  const agricultureAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.AGRICULTURE },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for agriculture accidents', () => {
    expect(isAgricultureAccident(agricultureAccident)).toEqual(true)
  })
  it('should return false for workplace accidents other than agriculture', () => {
    expect(isAgricultureAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isAgricultureAccident(emptyObject)).toEqual(false)
  })
})

describe('isProfessionalAthleteAccident', () => {
  const professionalAthleteAccidentRadio: FormValue = {
    accidentType: { radioButton: AccidentTypeEnum.SPORTS },
  }

  const professionalAthleteAccidentSecondaryWorkQuestion: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.FISHERMAN },
  }

  const emptyObject = {}

  it('should return true for professional athlete accidents', () => {
    expect(
      isProfessionalAthleteAccident(professionalAthleteAccidentRadio),
    ).toEqual(true)
  })

  it('should return true for professional athlete accident when user picked work related and then sports related', () => {
    expect(
      isProfessionalAthleteAccident(
        professionalAthleteAccidentSecondaryWorkQuestion,
      ),
    ).toEqual(true)
  })

  it('should return false for workplace accidents other than professional athlete', () => {
    expect(isProfessionalAthleteAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isProfessionalAthleteAccident(emptyObject)).toEqual(false)
  })
})

describe('isGeneralWorkplaceAccident', () => {
  const generalWorkplaceAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
    accidentType: { radioButton: AccidentTypeEnum.WORK },
  }

  const someOtherAccident: FormValue = {
    workAccident: { type: WorkAccidentTypeEnum.PROFESSIONALATHLETE },
  }

  const emptyObject = {}

  it('should return true for general workplace accidents', () => {
    expect(isGeneralWorkplaceAccident(generalWorkplaceAccident)).toEqual(true)
  })
  it('should return false for workplace accidents other than general', () => {
    expect(isGeneralWorkplaceAccident(someOtherAccident)).toEqual(false)
  })
  it('should return false for empty object', () => {
    expect(isGeneralWorkplaceAccident(emptyObject)).toEqual(false)
  })
})
