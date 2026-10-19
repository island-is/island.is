import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  CaseFileState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'
import { CreateFileDto } from '../../dto/createFile.dto'

describe('limitedAccessFileController - Create civil claimant case file', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const civilClaimantId = uuid()
  const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
  const uuId = uuid()
  const createCaseFile: CreateFileDto = {
    type: 'text/plain',
    key: `${caseId}/${uuId}/test.txt`,
    size: 99,
    category: CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  }
  const caseFile = {
    ...createCaseFile,
    id: uuid(),
    civilClaimantId,
  } as CaseFile

  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let mockTransaction: jest.Mock
  let transaction: Transaction
  let result: CaseFile

  beforeEach(async () => {
    const {
      sequelize,
      caseFileRepositoryService,
      limitedAccessFileController,
    } = await createTestingFileModule()

    mockCaseFileRepositoryService = caseFileRepositoryService

    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
    mockCreate.mockResolvedValueOnce(caseFile)

    // The route is guarded by LimitedAccessCaseExistsForUpdateGuard - see
    // createDefendantCaseFile.spec.ts.
    result = await runInRequestContext(async () => {
      await getOrCreateTransaction(sequelize)

      return limitedAccessFileController.createCivilClaimantCaseFile(
        caseId,
        civilClaimantId,
        user,
        theCase,
        createCaseFile,
      )
    })
  })

  it('should create the file for the civil claimant in the transaction the guard opened', () => {
    expect(mockTransaction).toHaveBeenCalledTimes(1)
    expect(mockCaseFileRepositoryService.create).toHaveBeenCalledWith(
      caseId,
      {
        type: 'text/plain',
        state: CaseFileState.STORED_IN_RVG,
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        category: CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        name: 'test.txt',
        userGeneratedFilename: 'test.txt',
        civilClaimantId,
      },
      { transaction },
    )
    expect(result).toBe(caseFile)
  })
})
