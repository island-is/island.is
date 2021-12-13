import { FormValue } from '@island.is/application/core'
import { isUniqueAssignee } from './isUniqueAssignee'
describe('isUniqueAssignee', () => {
  // Gervimenn nationalIds:
  const applicant = '0101051450'
  const assigneeSameAsApplicant = '0101051450'
  const uniqueAssignee = '0102491479'
  const isAssignee = true

  const applicationSameAsApplicant: FormValue = {
    applicant: {
      nationalId: applicant,
    },
    representative: {
      nationalId: assigneeSameAsApplicant,
    },
  }

  const applicationUniqueAssignee: FormValue = {
    applicant: {
      nationalId: applicant,
    },
    representative: {
      nationalId: uniqueAssignee,
    },
  }

  it('should return false for assignee that is the same as applicant', () => {
    expect(isUniqueAssignee(applicationSameAsApplicant, isAssignee)).toEqual(
      false,
    )
  })
  it('should return true for assignee that is unique', () => {
    expect(isUniqueAssignee(applicationUniqueAssignee, isAssignee)).toEqual(
      true,
    )
  })
  it('should return false for not being assignee', () => {
    expect(isUniqueAssignee(applicationUniqueAssignee, !isAssignee)).toEqual(
      false,
    )
  })
})
