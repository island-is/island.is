import { AccidentNotificationAnswers } from '..'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import { shouldRequestReview } from './shouldRequestReview'
describe('shouldRequestReview', () => {
  const agricultureAccident: Partial<AccidentNotificationAnswers> = {
    workAccident: { type: WorkAccidentTypeEnum.AGRICULTURE },
  }

  const accidentAtHome: Partial<AccidentNotificationAnswers> = {
    accidentType: { radioButton: AccidentTypeEnum.HOMEACTIVITIES },
  }

  const normalWorkAccident: Partial<AccidentNotificationAnswers> = {
    workAccident: { type: WorkAccidentTypeEnum.GENERAL },
  }

  it('should return true for work accidents', () => {
    expect(shouldRequestReview(agricultureAccident)).toEqual(false)
  })
  it('should return true for general work accident', () => {
    expect(shouldRequestReview(normalWorkAccident)).toEqual(true)
  })
  it('should return false for home accident', () => {
    expect(shouldRequestReview(accidentAtHome)).toEqual(false)
  })
})
