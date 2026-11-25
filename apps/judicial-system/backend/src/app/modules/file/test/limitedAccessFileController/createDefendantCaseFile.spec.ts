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

describe('limitedAccessFileController - Create defendant case file', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const defendantId = uuid()
  const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
  const uuId = uuid()
  const createCaseFile: CreateFileDto = {
    type: 'text/plain',
    key: `${caseId}/${uuId}/test.txt`,
    size: 99,
    category: CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  }
  const caseFile = { ...createCaseFile, id: uuid(), defendantId } as CaseFile

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

    // The route is guarded by LimitedAccessCaseExistsForUpdateGuard, so the
    // request transaction is already open - and holding a lock on this case
    // row - by the time the handler runs. Guards do not execute in
    // controller unit tests, so the request context and that transaction are
    // set up here instead.
    result = await runInRequestContext(async () => {
      await getOrCreateTransaction(sequelize)

      return limitedAccessFileController.createDefendantCaseFile(
        caseId,
        defendantId,
        user,
        theCase,
        createCaseFile,
      )
    })
  })

  it('should create the file for the defendant in the transaction the guard opened', () => {
    // Once, by the stand-in for the guard above. A second call would be the
    // handler opening a transaction of its own, which would block on the
    // guard's row lock and deadlock the request.
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
        defendantId,
      },
      { transaction },
    )
    expect(result).toBe(caseFile)
  })
})
