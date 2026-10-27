import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  InstitutionType,
  indictmentCases,
  investigationCases,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { randomDate } from '../../../../test'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'
import { CreateFileDto } from '../../dto/createFile.dto'

interface Then {
  result: CaseFile
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  createCaseFile: CreateFileDto,
  theCase: Case,
) => Promise<Then>

describe('FileController - Create case file', () => {
  const user = { id: uuid() } as User

  let mockQueuedMessages: Message[]
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen
  let createCaseFileAs: (
    caseId: string,
    createCaseFile: CreateFileDto,
    theCase: Case,
    actingUser: User,
  ) => Promise<Then>

  beforeEach(async () => {
    const {
      queuedMessagesAfterCommit,
      sequelize,
      caseFileRepositoryService,
      fileController,
    } = await createTestingFileModule()

    mockQueuedMessages = queuedMessagesAfterCommit
    mockCaseFileRepositoryService = caseFileRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    createCaseFileAs = async (
      caseId: string,
      createCaseFile: CreateFileDto,
      theCase: Case,
      actingUser: User,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .createCaseFile(caseId, actingUser, theCase, createCaseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }

    givenWhenThen = (caseId, createCaseFile, theCase) =>
      createCaseFileAs(caseId, createCaseFile, theCase, user)
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'case file created for %s case',
    (type) => {
      const caseId = uuid()
      const appealCaseId = uuid()
      const theCase = {
        id: caseId,
        type,
        appealCase: { id: appealCaseId, appealCaseNumber: uuid() },
      } as Case
      const uuId = uuid()
      const createCaseFile: CreateFileDto = {
        type: 'text/plain',
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
      }
      const fileId = uuid()
      const timeStamp = randomDate()
      const caseFile = {
        type: 'text/plain',
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
        id: fileId,
        created: timeStamp,
        modified: timeStamp,
      }
      let then: Then

      beforeEach(async () => {
        const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
        mockCreate.mockResolvedValueOnce(caseFile)

        then = await givenWhenThen(caseId, createCaseFile, theCase)
      })

      it('should create a case file', () => {
        expect(mockCaseFileRepositoryService.create).toHaveBeenCalledWith(
          caseId,
          {
            type: 'text/plain',
            state: CaseFileState.STORED_IN_RVG,
            key: `${caseId}/${uuId}/test.txt`,
            size: 99,
            category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
            name: 'test.txt',
            userGeneratedFilename: 'test.txt',
          },
          { transaction },
        )
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
            user,
            caseId,
            elementId: [appealCaseId, fileId],
          },
        ])
        expect(then.result).toBe(caseFile)
      })
    },
  )

  describe.each(indictmentCases)('case file created for %s case', (type) => {
    const caseId = uuid()
    const theCase = { id: caseId, type } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    const fileId = uuid()
    const timeStamp = randomDate()
    const caseFile = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
      id: fileId,
      created: timeStamp,
      modified: timeStamp,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(caseFile)

      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should create a case file', () => {
      expect(mockCaseFileRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          type: 'text/plain',
          state: CaseFileState.STORED_IN_RVG,
          key: `${caseId}/${uuId}/test.txt`,
          size: 99,
          name: 'test.txt',
          userGeneratedFilename: 'test.txt',
        },
        { transaction },
      )
      expect(then.result).toBe(caseFile)
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'uncategorized case file created for ordered %s case',
    (type) => {
      const caseId = uuid()
      const theCase = { id: caseId, type } as Case
      const uuId = uuid()
      const createCaseFile: CreateFileDto = {
        type: 'text/plain',
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
      }
      const fileId = uuid()
      const timeStamp = randomDate()
      const caseFile = {
        type: 'text/plain',
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        id: fileId,
        created: timeStamp,
        modified: timeStamp,
      }
      let then: Then

      beforeEach(async () => {
        const mockGetNextOrderWithinChapterForUpdate =
          mockCaseFileRepositoryService.getNextOrderWithinChapterForUpdate as jest.Mock
        mockGetNextOrderWithinChapterForUpdate.mockResolvedValueOnce(3)

        const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
        mockCreate.mockResolvedValueOnce(caseFile)

        then = await givenWhenThen(caseId, createCaseFile, theCase)
      })

      it('should append orderWithinChapter after existing ordered files', () => {
        expect(
          mockCaseFileRepositoryService.getNextOrderWithinChapterForUpdate,
        ).toHaveBeenCalledWith(caseId, { transaction })
        expect(mockCaseFileRepositoryService.create).toHaveBeenCalledWith(
          caseId,
          expect.objectContaining({ orderWithinChapter: 3 }),
          { transaction },
        )
        expect(then.result).toBe(caseFile)
      })
    },
  )

  describe.each(indictmentCases)(
    'additional case file created for %s case',
    (type) => {
      const caseId = uuid()
      const theCase = {
        id: caseId,
        type,
        origin: CaseOrigin.LOKE,
        courtCaseNumber: uuid(),
      } as Case
      const uuId = uuid()
      const createCaseFile: CreateFileDto = {
        type: 'text/plain',
        category: CaseFileCategory.PROSECUTOR_CASE_FILE,
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
      }
      const fileId = uuid()
      const timeStamp = randomDate()
      const caseFile = {
        type: 'text/plain',
        category: CaseFileCategory.PROSECUTOR_CASE_FILE,
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        id: fileId,
        created: timeStamp,
        modified: timeStamp,
      }

      beforeEach(async () => {
        const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
        mockCreate.mockResolvedValueOnce(caseFile)

        await givenWhenThen(caseId, createCaseFile, theCase)
      })

      it('should deliver the file to court and police', () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.DELIVERY_TO_POLICE_CASE_FILE,
            user,
            caseId,
            elementId: fileId,
          },
          {
            type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
            user,
            caseId,
            elementId: fileId,
          },
        ])
      })
    },
  )

  describe('court case file created by non-court user', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: indictmentCases[0] } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
      category: CaseFileCategory.COURT_CASE_FILE,
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should forbid creation', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockCaseFileRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('court case file created by district court user', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: indictmentCases[0],
    } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
      category: CaseFileCategory.COURT_CASE_FILE,
      fileRepresentative: 'Dómari',
    }
    const fileId = uuid()
    const caseFile = {
      ...createCaseFile,
      id: fileId,
      name: 'test.txt',
      userGeneratedFilename: 'test.txt',
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.COURT_CASE_FILE,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(caseFile)

      then = await createCaseFileAs(caseId, createCaseFile, theCase, {
        id: uuid(),
        role: UserRole.DISTRICT_COURT_JUDGE,
        institution: { type: InstitutionType.DISTRICT_COURT },
      } as User)
    })

    it('should create a court case file', () => {
      expect(then.error).toBeUndefined()
      expect(then.result).toBe(caseFile)
    })
  })

  describe('malformed key', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const uuId = `-${uuid()}`
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `${caseId}/${uuId}/test.txt is not a valid key for case ${caseId}`,
      )
    })
  })

  describe('database insert fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
