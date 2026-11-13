import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { InternalServerErrorException } from '@nestjs/common'

import { createTestingFileModule } from '../createTestingFileModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { CaseFile, CaseFileRepositoryService } from '../../../repository'
import { UpdateFileDto } from '../../dto/updateFile.dto'

interface Then {
  result: CaseFile[]
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileUpdates: UpdateFileDto[],
) => Promise<Then>

describe('FileController - Update case file order', () => {
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let givenWhenThen: GivenWhenThen
  let mockTransaction: jest.Mock
  let transaction: Transaction

  beforeEach(async () => {
    const { caseFileRepositoryService, fileController, sequelize } =
      await createTestingFileModule()

    mockCaseFileRepositoryService = caseFileRepositoryService
    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (
      caseId: string,
      fileUpdates: UpdateFileDto[],
    ): Promise<Then> => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return fileController.updateFiles(caseId, { files: fileUpdates })
        })
      } catch (error) {
        then.error = error as Error
      }
      return then
    }
  })

  describe('when called with empty list of updates', () => {
    const caseId = uuid()
    const fileUpdates: UpdateFileDto[] = []

    let then: Then
    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileUpdates)
    })

    it('should return empty list of CaseFiles', () => {
      expect(then.result).toHaveLength(0)
    })
  })

  describe('when all file updates are successful', () => {
    const caseId = uuid()
    const fileUpdates: UpdateFileDto[] = [
      { id: uuid(), orderWithinChapter: 0, chapter: 0 },
      { id: uuid(), orderWithinChapter: 1, chapter: 0 },
      { id: uuid(), orderWithinChapter: 3, chapter: 0 },
    ]

    let then: Then
    beforeEach(async () => {
      const mockUpdate =
        mockCaseFileRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValue({
        numberOfAffectedRows: 1,
        caseFiles: [{}] as CaseFile[],
      })
      then = await givenWhenThen(caseId, fileUpdates)
    })

    it('should update every file in the transaction the guard opened', () => {
      // Once, by the stand-in for the guard above. A second call would be the
      // handler opening a transaction of its own, which would block on the
      // guard's row lock and deadlock the request.
      expect(mockTransaction).toHaveBeenCalledTimes(1)
      fileUpdates.forEach((update) =>
        expect(
          mockCaseFileRepositoryService.updateByIdAndCase,
        ).toHaveBeenCalledWith(update.id, caseId, update, { transaction }),
      )
    })

    it('should return all case files', () => {
      expect(then.result).toHaveLength(3)
    })
  })

  describe('when a file updates dose not update a single row', () => {
    const caseId = uuid()
    const fileUpdates: UpdateFileDto[] = [
      { id: uuid(), orderWithinChapter: 0, chapter: 0 },
    ]

    let then: Then
    beforeEach(async () => {
      const mockUpdate =
        mockCaseFileRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValue({
        numberOfAffectedRows: 0,
        caseFiles: [{}] as CaseFile[],
      }) // affected rows
      then = await givenWhenThen(caseId, fileUpdates)
    })

    it('should throw internal server error', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe(
        `Could not update file ${fileUpdates[0].id} of case ${caseId}`,
      )
    })
  })

  describe('when not all updates affect a single row', () => {
    const caseId = uuid()
    const fileUpdates: UpdateFileDto[] = [
      { id: uuid(), orderWithinChapter: 0, chapter: 0 },
      { id: uuid(), orderWithinChapter: 1, chapter: 0 },
    ]

    let then: Then
    beforeEach(async () => {
      const mockUpdate =
        mockCaseFileRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValue({
        numberOfAffectedRows: 1,
        caseFiles: [{}] as CaseFile[],
      })
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        caseFiles: [{}] as CaseFile[],
      }) // first call => 1 affected row
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 0,
        caseFiles: [] as CaseFile[],
      }) // secound call => 0 affected rows
      then = await givenWhenThen(caseId, fileUpdates)
    })

    it('should throw internal server error', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe(
        `Could not update file ${fileUpdates[1].id} of case ${caseId}`,
      )
    })
  })

  describe('when not all updates are successful', () => {
    const caseId = uuid()
    const fileUpdates: UpdateFileDto[] = [
      { id: uuid(), orderWithinChapter: 0, chapter: 0 },
      { id: uuid(), orderWithinChapter: 1, chapter: 0 },
    ]

    let then: Then
    beforeEach(async () => {
      const mockUpdate =
        mockCaseFileRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValue({
        numberOfAffectedRows: 1,
        caseFiles: [{}] as CaseFile[],
      })
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        caseFiles: [{}] as CaseFile[],
      }) // first call => 1 affected row
      mockUpdate.mockRejectedValueOnce(new Error('some error')) // secound call => error
      then = await givenWhenThen(caseId, fileUpdates)
    })

    it('should throw internal server error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe(`some error`)
    })
  })
})
