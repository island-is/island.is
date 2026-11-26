import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  indictmentCases,
  InstitutionType,
  investigationCases,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { randomDate, runInRequestContext } from '../../../../test'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'
import { CreateFileDto } from '../../dto/createFile.dto'
import { CreateFile } from '../../file.service'

interface Then {
  result: CaseFile
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  createCaseFile: CreateFile,
  theCase: Case,
) => Promise<Then>

describe('FileController - Create case file', () => {
  const user = { id: uuid() } as User

  let mockQueuedMessages: Message[]
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let mockTransaction: jest.Mock
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen
  let createCaseFileAs: (
    caseId: string,
    createCaseFile: CreateFile,
    theCase: Case,
    actingUser: User,
  ) => Promise<Then>
  let createDefendantCaseFileAs: (
    caseId: string,
    defendantId: string,
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

    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    // The route is guarded by CaseExistsForUpdateGuard, so the request
    // transaction is already open - and holding a lock on this case row - by
    // the time the handler runs. Guards do not execute in controller unit
    // tests, so the request context and that transaction are set up here
    // instead.
    createCaseFileAs = async (
      caseId: string,
      createCaseFile: CreateFile,
      theCase: Case,
      actingUser: User,
    ): Promise<Then> => {
      const then = {} as Then

      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return fileController.createCaseFile(
            caseId,
            actingUser,
            theCase,
            createCaseFile,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }

    createDefendantCaseFileAs = async (
      caseId: string,
      defendantId: string,
      createCaseFile: CreateFileDto,
      theCase: Case,
      actingUser: User,
    ): Promise<Then> => {
      const then = {} as Then

      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return fileController.createDefendantCaseFile(
            caseId,
            defendantId,
            actingUser,
            theCase,
            createCaseFile,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }

    givenWhenThen = (caseId, createCaseFile, theCase) =>
      createCaseFileAs(caseId, createCaseFile, theCase, user)
  })

  // Once, by the stand-in for the guard above. A second call would be the
  // handler opening a transaction of its own, which would block on the
  // guard's row lock and deadlock the request.
  const expectTheGuardsTransactionOnly = () =>
    expect(mockTransaction).toHaveBeenCalledTimes(1)

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
        expectTheGuardsTransactionOnly()
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
      expectTheGuardsTransactionOnly()
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

  describe('verdict appeal ruling', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: indictmentCases[0],
      verdictAppealCase: { id: uuid() },
    } as Case
    const createCaseFile: CreateFileDto = {
      type: 'application/pdf',
      key: `${caseId}/${uuid()}/test.pdf`,
      size: 99,
      category: CaseFileCategory.VERDICT_APPEAL_RULING,
    }
    const courtOfAppealsUser = {
      id: uuid(),
      role: UserRole.COURT_OF_APPEALS_ASSISTANT,
      institution: { type: InstitutionType.COURT_OF_APPEALS },
    } as User

    describe.each([
      [UserRole.PROSECUTOR, InstitutionType.POLICE_PROSECUTORS_OFFICE],
      [UserRole.PROSECUTOR, InstitutionType.PUBLIC_PROSECUTORS_OFFICE],
      [UserRole.DISTRICT_COURT_JUDGE, InstitutionType.DISTRICT_COURT],
    ])('created by %s at %s', (role, type) => {
      let then: Then

      beforeEach(async () => {
        then = await createCaseFileAs(caseId, createCaseFile, theCase, {
          id: uuid(),
          role,
          institution: { type },
        } as User)
      })

      it('should forbid creation', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(mockCaseFileRepositoryService.create).not.toHaveBeenCalled()
      })
    })

    describe('created by a court of appeals user', () => {
      const caseFile = {
        ...createCaseFile,
        id: uuid(),
        name: 'test.pdf',
        state: CaseFileState.STORED_IN_RVG,
      }
      let then: Then

      beforeEach(async () => {
        const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
        mockCreate.mockResolvedValueOnce(caseFile)

        then = await createCaseFileAs(
          caseId,
          createCaseFile,
          theCase,
          courtOfAppealsUser,
        )
      })

      it('should create the file', () => {
        expect(then.error).toBeUndefined()
        expect(then.result).toBe(caseFile)
      })

      it('should not queue any messages', () => {
        expect(mockQueuedMessages).toEqual([])
      })
    })

    describe('created once the verdict appeal has been completed', () => {
      let then: Then

      beforeEach(async () => {
        const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
        mockCreate.mockResolvedValueOnce({
          ...createCaseFile,
          id: uuid(),
          name: 'test.pdf',
          state: CaseFileState.STORED_IN_RVG,
        })

        then = await createCaseFileAs(
          caseId,
          createCaseFile,
          {
            ...theCase,
            verdictAppealCase: {
              id: uuid(),
              appealState: AppealCaseState.COMPLETED,
            },
          } as Case,
          courtOfAppealsUser,
        )
      })

      // The court can still replace its document: the outcome stays with it
      // until it is released.
      it('should create the case file', () => {
        expect(then.error).toBeUndefined()
        expect(mockCaseFileRepositoryService.create).toHaveBeenCalled()
      })
    })

    describe('created on a case without a verdict appeal', () => {
      let then: Then

      beforeEach(async () => {
        then = await createCaseFileAs(
          caseId,
          createCaseFile,
          { id: caseId, type: indictmentCases[0] } as Case,
          courtOfAppealsUser,
        )
      })

      it('should refuse creation', () => {
        expect(then.error).toBeInstanceOf(BadRequestException)
        expect(mockCaseFileRepositoryService.create).not.toHaveBeenCalled()
      })
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

  describe('verdict appeal statement with rulingFileId', () => {
    const caseId = uuid()
    const rulingFileId = uuid()
    const defendantId = uuid()
    const openDeadline = new Date()
    openDeadline.setDate(openDeadline.getDate() + 14)
    const theCase = {
      id: caseId,
      verdictAppealCase: {
        id: uuid(),
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.RECEIVED,
        statementDeadlines: [{ defendantId, deadline: openDeadline }],
        appealEventLogs: [],
      },
    } as Case
    const uuId = uuid()
    const createCaseFile: CreateFile = {
      type: 'text/plain',
      category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
      key: `${caseId}/${uuId}/statement.pdf`,
      size: 99,
      rulingFileId,
    }
    let then: Then

    beforeEach(async () => {
      then = await createDefendantCaseFileAs(
        caseId,
        defendantId,
        createCaseFile,
        theCase,
        user,
      )
    })

    it('should reject the ruling order reference', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Verdict appeal file ${createCaseFile.key} cannot reference a ruling order`,
      )
    })
  })

  describe('verdict appeal statement on a completed verdict appeal', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      verdictAppealCase: {
        id: uuid(),
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.COMPLETED,
      },
    } as Case
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
      key: `${caseId}/${uuId}/statement.pdf`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should reject the upload', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Cannot upload a verdict appeal statement when the verdict appeal of case ${caseId} is missing, completed, or withdrawn`,
      )
    })
  })

  describe('verdict appeal statement after the party has filed', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const openDeadline = new Date()
    openDeadline.setDate(openDeadline.getDate() + 14)
    const theCase = {
      id: caseId,
      verdictAppealCase: {
        id: uuid(),
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.RECEIVED,
        statementDeadlines: [{ defendantId, deadline: openDeadline }],
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            defendantId,
          },
        ],
      },
    } as Case
    const createCaseFile: CreateFile = {
      type: 'text/plain',
      category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
      key: `${caseId}/${uuid()}/statement.pdf`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      then = await createDefendantCaseFileAs(
        caseId,
        defendantId,
        createCaseFile,
        theCase,
        user,
      )
    })

    it('should reject the upload', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Cannot upload a verdict appeal statement after case ${caseId} party has already filed`,
      )
    })
  })

  describe('verdict appeal statement after the deadline has expired', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const theCase = {
      id: caseId,
      verdictAppealCase: {
        id: uuid(),
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.RECEIVED,
        statementDeadlines: [{ defendantId, deadline: new Date('2020-01-01') }],
        appealEventLogs: [],
      },
    } as Case
    const createCaseFile: CreateFile = {
      type: 'text/plain',
      category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
      key: `${caseId}/${uuid()}/statement.pdf`,
      size: 99,
    }
    const caseFile = {
      ...createCaseFile,
      id: uuid(),
      state: CaseFileState.STORED_IN_RVG,
      defendantId,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseFileRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(caseFile)

      then = await createDefendantCaseFileAs(
        caseId,
        defendantId,
        createCaseFile,
        theCase,
        user,
      )
    })

    it('should allow the upload', () => {
      expect(then.error).toBeUndefined()
      expect(mockCaseFileRepositoryService.create).toHaveBeenCalled()
    })
  })

  describe('verdict appeal defence statement without a party id', () => {
    const caseId = uuid()
    const openDeadline = new Date()
    openDeadline.setDate(openDeadline.getDate() + 14)
    const theCase = {
      id: caseId,
      verdictAppealCase: {
        id: uuid(),
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.RECEIVED,
        statementDeadlines: [{ deadline: openDeadline }],
        appealEventLogs: [],
      },
    } as Case
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
      key: `${caseId}/${uuid()}/statement.pdf`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, createCaseFile, theCase)
    })

    it('should reject the unscoped defence upload', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Verdict appeal defence statement files for case ${caseId} require exactly one of defendantId or civilClaimantId`,
      )
    })
  })
})
