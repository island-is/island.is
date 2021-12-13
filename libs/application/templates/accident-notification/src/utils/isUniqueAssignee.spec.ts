import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { isUniqueAssignee } from './isUniqueAssignee'
describe('isUniqueAssignee', () => {
  const applicant = '0101051450'
  const assigneeSameAsApplicant = ['0101051450']
  const uniqueAssignee = ['0102491479']
  const isAssignee = true

  const applicationSameAsApplicant = {
    id: '123',
    state: '',
    typeId: ApplicationTypes.ACCIDENT_NOTIFICATION,
    modified: new Date(),
    created: new Date(),
    attachments: {},
    answers: {},
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
    applicant,
    assignees: assigneeSameAsApplicant,
  } as Application

  const applicationUniqueAssignee = {
    id: '123',
    state: '',
    typeId: ApplicationTypes.ACCIDENT_NOTIFICATION,
    modified: new Date(),
    created: new Date(),
    attachments: {},
    answers: {},
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
    applicant,
    assignees: uniqueAssignee,
  } as Application

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
