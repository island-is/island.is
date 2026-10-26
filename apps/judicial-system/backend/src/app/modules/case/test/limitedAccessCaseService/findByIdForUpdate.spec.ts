import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { type User, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case, CaseRepositoryService } from '../../../repository'
import { LimitedAccessCaseService } from '../../limitedAccessCase.service'

// The locking twin of findById: the same decision about whose view of the
// linked cases is narrowed, handed to the for-update read along with the
// transaction the lock lives in.
describe('LimitedAccessCaseService - findByIdForUpdate', () => {
  const caseId = uuid()
  const nationalId = '1234567890'
  const transaction = {} as Transaction

  let limitedAccessCaseService: LimitedAccessCaseService
  let mockCaseRepositoryService: CaseRepositoryService

  beforeEach(async () => {
    const { limitedAccessCaseService: service, caseRepositoryService } =
      await createTestingCaseModule()

    limitedAccessCaseService = service
    mockCaseRepositoryService = caseRepositoryService

    const mockFindLimitedAccessByIdForUpdate =
      mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
    mockFindLimitedAccessByIdForUpdate.mockResolvedValue({ id: caseId } as Case)
  })

  it('should narrow the linked cases to a defence user', async () => {
    const user = { nationalId, role: UserRole.DEFENDER } as User

    const result = await limitedAccessCaseService.findByIdForUpdate(
      caseId,
      transaction,
      user,
    )

    expect(
      mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
    ).toHaveBeenCalledWith(caseId, {
      defenceUserNationalId: nationalId,
      transaction,
    })
    expect(result).toEqual({ id: caseId })
  })

  it('should not narrow the linked cases for a user who is not a defence user', async () => {
    const user = { nationalId, role: UserRole.PRISON_SYSTEM_STAFF } as User

    await limitedAccessCaseService.findByIdForUpdate(caseId, transaction, user)

    expect(
      mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
    ).toHaveBeenCalledWith(caseId, {
      defenceUserNationalId: undefined,
      transaction,
    })
  })

  it('should not narrow the linked cases when there is no user', async () => {
    await limitedAccessCaseService.findByIdForUpdate(caseId, transaction)

    expect(
      mockCaseRepositoryService.findLimitedAccessByIdForUpdate,
    ).toHaveBeenCalledWith(caseId, {
      defenceUserNationalId: undefined,
      transaction,
    })
  })

  it('should throw when the case does not exist', async () => {
    const mockFindLimitedAccessByIdForUpdate =
      mockCaseRepositoryService.findLimitedAccessByIdForUpdate as jest.Mock
    mockFindLimitedAccessByIdForUpdate.mockResolvedValueOnce(null)

    await expect(
      limitedAccessCaseService.findByIdForUpdate(caseId, transaction),
    ).rejects.toThrow(`Case ${caseId} does not exist`)
  })
})
