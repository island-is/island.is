import { Child } from '../types'
import { canApply } from './newPrimarySchoolUtils'
import * as kennitala from 'kennitala'

describe('canApply', () => {
  const getNationalId = (years: number) => {
    const currentDate = new Date()
    const fithteenYearsAgo = new Date(
      currentDate.getFullYear() - years,
      currentDate.getMonth(),
      currentDate.getDate(),
    )

    return kennitala.generatePerson(fithteenYearsAgo)
  }

  it('should return true if child is between 5 and 15 years old and lives with applicant', () => {
    const child = {
      nationalId: getNationalId(15),
      livesWithApplicant: true,
    } as Child
    expect(canApply(child)).toBe(true)
  })

  it('should return false if child is younger than 5 years old', () => {
    const child = {
      nationalId: getNationalId(4),
      livesWithApplicant: true,
    } as Child
    expect(canApply(child)).toBe(false)
  })

  it('should return false if child is older than 15 years old', () => {
    const child = {
      nationalId: getNationalId(16),
      livesWithApplicant: true,
    } as Child
    expect(canApply(child)).toBe(false)
  })

  it('should return false if child does not live with applicant', () => {
    const child = {
      nationalId: getNationalId(8),
      livesWithApplicant: false,
    } as Child
    expect(canApply(child)).toBe(false)
  })
})
