import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { InternalServerErrorException } from '@nestjs/common'

import { createTestingFileModule } from '../createTestingFileModule'

import { CaseFile } from '../../../repository'
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
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen
  let transaction: Transaction

  beforeEach(async () => {
    const { fileModel, fileController, sequelize } =
      await createTestingFileModule()

    mockFileModel = fileModel
    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (
      caseId: string,
      fileUpdates: UpdateFileDto[],
    ): Promise<Then> => {
      const then = {} as Then

      try {
        then.result = await fileController
          .updateFiles(caseId, { files: fileUpdates })
          .then((result) => (then.result = result))
          .catch((error) => (then.error = error))
      } catch (error) {
        then.error = error
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
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValue([1, [{}] as CaseFile[]])
      then = await givenWhenThen(caseId, fileUpdates)
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
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValue([0, [{}] as CaseFile[]]) // affected rows
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
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValue([1, [{}] as CaseFile[]])
      mockUpdate.mockResolvedValueOnce([1, [{}] as CaseFile[]]) // first call => 1 affected row
      mockUpdate.mockResolvedValueOnce([0, [] as CaseFile[]]) // secound call => 0 affected rows
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
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValue([1, [{}] as CaseFile[]])
      mockUpdate.mockResolvedValueOnce([1, [{}] as CaseFile[]]) // first call => 1 affected row
      mockUpdate.mockRejectedValueOnce(new Error('some error')) // secound call => error
      then = await givenWhenThen(caseId, fileUpdates)
    })

    it('should throw internal server error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe(`some error`)
    })
  })
})
