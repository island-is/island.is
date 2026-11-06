import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { type User, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case, CaseRepositoryService } from '../../../repository'
import { LimitedAccessCaseService } from '../../limitedAccessCase.service'

// The repository decides what a defence user sees of the linked cases from the
// national id it is handed; this service is the only place that decides which
// users get one. Both halves are pinned here, because a national id passed for
// a user who is not a defence user narrows the linked cases to parties they
// have nothing to do with, and nothing else in the suite would notice.
describe('LimitedAccessCaseService - findById', () => {
  const caseId = uuid()
  const nationalId = '1234567890'

  let limitedAccessCaseService: LimitedAccessCaseService
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction

  beforeEach(async () => {
    const { limitedAccessCaseService: service, caseRepositoryService } =
      await createTestingCaseModule()

    limitedAccessCaseService = service
    mockCaseRepositoryService = caseRepositoryService
    transaction = {} as Transaction

    const mockFindLimitedAccessById =
      mockCaseRepositoryService.findLimitedAccessById as jest.Mock
    mockFindLimitedAccessById.mockResolvedValue({ id: caseId } as Case)
  })

  it('should narrow the linked cases to a defence user', async () => {
    const user = { nationalId, role: UserRole.DEFENDER } as User

    await limitedAccessCaseService.findById(caseId, { user, transaction })

    expect(
      mockCaseRepositoryService.findLimitedAccessById,
    ).toHaveBeenCalledWith(caseId, {
      defenceUserNationalId: nationalId,
      transaction,
    })
  })

  it('should not narrow the linked cases for a user who is not a defence user', async () => {
    const user = { nationalId, role: UserRole.PROSECUTOR } as User

    await limitedAccessCaseService.findById(caseId, { user, transaction })

    expect(
      mockCaseRepositoryService.findLimitedAccessById,
    ).toHaveBeenCalledWith(caseId, {
      defenceUserNationalId: undefined,
      transaction,
    })
  })

  it('should not narrow the linked cases when there is no user', async () => {
    await limitedAccessCaseService.findById(caseId, { transaction })

    expect(
      mockCaseRepositoryService.findLimitedAccessById,
    ).toHaveBeenCalledWith(caseId, {
      defenceUserNationalId: undefined,
      transaction,
    })
  })

  it('should throw when the case does not exist', async () => {
    const mockFindLimitedAccessById =
      mockCaseRepositoryService.findLimitedAccessById as jest.Mock
    mockFindLimitedAccessById.mockResolvedValueOnce(null)

    await expect(limitedAccessCaseService.findById(caseId)).rejects.toThrow(
      `Case ${caseId} does not exist`,
    )
  })
})
