import { FormValue } from '@island.is/application/types'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import exp from 'constants'
import { isSportAccidentAndEmployee } from './isSportAccidentAndEmployee'
import { accidentType } from '../lib/messages'

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
