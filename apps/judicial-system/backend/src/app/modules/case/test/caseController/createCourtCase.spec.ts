import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseState,
  CaseTransition,
  CaseType,
  EventType,
  IndictmentSubtype,
  investigationCases,
  restrictionCases,
  User as TUser,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import {
  getTransactionContext,
  TransactionContext,
} from '../../../../middleware'
import { randomDate, randomEnum, runInRequestContext } from '../../../../test'
import { CourtService } from '../../../court'
import { EventService } from '../../../event'
import { Case, CaseRepositoryService } from '../../../repository'

jest.mock('../../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: TUser,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Create court case', () => {
  const userId = uuid()
  const user = { id: userId } as TUser
  const courtCaseNumber = uuid()

  let mockQueuedMessages: Message[]
  let mockCourtService: CourtService
  let mockEventService: EventService
  let transaction: Transaction
  let mockCaseRepositoryService: CaseRepositoryService
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      courtService,
      eventService,
      sequelize,
      caseRepositoryService,
      caseController,
    } = await createTestingCaseModule()

    mockQueuedMessages = queuedMessages
    mockCourtService = courtService
    mockEventService = eventService
    mockCaseRepositoryService = caseRepositoryService
    transactionContext = undefined

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockCreateCourtCase = mockCourtService.createCourtCase as jest.Mock
    mockCreateCourtCase.mockResolvedValue(courtCaseNumber)
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue({})

    givenWhenThen = async (caseId: string, user: TUser, theCase: Case) => {
      const then = {} as Then

      try {
        // The handler owns its transaction, but the receive event the case
        // service registers on the way needs the request's transaction slot,
        // which TransactionContextMiddleware opens for every request. Guards
        // and middleware do not run in controller unit tests, so the request
        // context is set up here instead.
        await runInRequestContext(async () => {
          transactionContext = getTransactionContext()

          then.result = await caseController.createCourtCase(
            caseId,
            user,
            theCase,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('request court case created', () => {
    const date = randomDate()
    const caseId = uuid()
    const type = CaseType.CUSTODY
    const policeCaseNumber = uuid()
    const policeCaseNumbers = [policeCaseNumber]
    const courtId = uuid()
    const theCase = {
      id: caseId,
      type,
      policeCaseNumbers,
      courtId,
    } as Case
    const returnedCase = {
      id: caseId,
      type,
      policeCaseNumbers,
      courtId,
      courtCaseNumber,
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(returnedCase)

      const mockToday = nowFactory as jest.Mock
      mockToday.mockReturnValueOnce(date)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should create a court case', () => {
      expect(mockCourtService.createCourtCase).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        type,
        date,
        policeCaseNumbers,
        false,
        undefined,
      )
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { courtCaseNumber },
        { transaction },
      )
      expect(mockCaseRepositoryService.findLiveById).toHaveBeenCalledWith(
        caseId,
        { allowDeleted: true, transaction },
      )
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('indictment court case created', () => {
    const caseId = uuid()
    const type = CaseType.INDICTMENT
    const policeCaseNumber = uuid()
    const indictmentSubtype = randomEnum(IndictmentSubtype)
    const indictmentSubtypes = { [policeCaseNumber]: [indictmentSubtype] }
    const indictmentConfirmedDate = randomDate()
    const policeCaseNumbers = [policeCaseNumber]
    const courtId = uuid()
    const theCase = {
      id: caseId,
      type,
      policeCaseNumbers,
      indictmentSubtypes,
      courtId,
      eventLogs: [
        {
          eventType: EventType.INDICTMENT_CONFIRMED,
          created: indictmentConfirmedDate,
        },
      ],
    } as Case
    const returnedCase = {
      id: caseId,
      type,
      policeCaseNumbers,
      indictmentSubtypes,
      courtId,
      courtCaseNumber,
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should create a court case', () => {
      expect(mockCourtService.createCourtCase).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        type,
        indictmentConfirmedDate,
        policeCaseNumbers,
        false,
        indictmentSubtypes,
      )
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { courtCaseNumber },
        { transaction },
      )
      expect(mockCaseRepositoryService.findLiveById).toHaveBeenCalledWith(
        caseId,
        { allowDeleted: true, transaction },
      )
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('case transitioned from SUBMITTED to RECEIVED', () => {
    const caseId = uuid()
    const type = randomEnum(CaseType)
    const courtId = uuid()
    const theCase = {
      id: caseId,
      type,
      state: CaseState.SUBMITTED,
      courtId,
    } as Case
    const returnedCase = {
      id: caseId,
      courtId,
      courtCaseNumber,
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should update the court case number', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { state: CaseState.RECEIVED, courtCaseNumber },
        { transaction },
      )
      expect(then.error).toBeUndefined()
      expect(then.result).toBe(returnedCase)
    })

    // The handler commits its own transaction and returns right after, so
    // the callback TransactionCommitInterceptor then drains runs behind that
    // commit - the same ordering the update and transition routes get from
    // the request transaction.
    it('should register the RECEIVE event rather than posting it inline', () => {
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(1)
    })

    it('should post the RECEIVE event once the callbacks run', async () => {
      await Promise.all(
        (transactionContext?.afterCommit ?? []).map((callback) => callback()),
      )

      expect(mockEventService.postEvent).toHaveBeenCalledWith(
        CaseTransition.RECEIVE,
        returnedCase,
      )
    })
  })

  describe('R-case queued', () => {
    const defendantId1 = uuid()
    const defendantId2 = uuid()
    const caseId = uuid()
    const theCase = {
      id: caseId,
    } as Case
    const returnedCase = {
      id: caseId,
      type: randomEnum([...restrictionCases, ...investigationCases]),
      defendants: [{ id: defendantId1 }, { id: defendantId2 }],
      courtCaseNumber,
    } as Case

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(returnedCase)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should post to queue', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_REQUEST,
          user,
          caseId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
          user,
          caseId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
          user,
          caseId,
          elementId: defendantId1,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_REQUEST_DEFENDANT,
          user,
          caseId,
          elementId: defendantId1,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
          user,
          caseId,
          elementId: defendantId2,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_REQUEST_DEFENDANT,
          user,
          caseId,
          elementId: defendantId2,
        },
      ])
    })
  })

  describe('indictment case queued', () => {
    const caseId = uuid()
    const policeCaseNumber1 = uuid()
    const policeCaseNumber2 = uuid()
    const criminalRecordId = uuid()
    const costBreakdownId = uuid()
    const uncategorisedId = uuid()
    const theCase = {
      id: caseId,
    } as Case
    const returnedCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      policeCaseNumbers: [policeCaseNumber1, policeCaseNumber2],
      caseFiles: [
        {
          id: criminalRecordId,
          key: uuid(),
          isKeyAccessible: true,
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.CRIMINAL_RECORD,
        },
        {
          id: costBreakdownId,
          key: uuid(),
          isKeyAccessible: true,
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.COST_BREAKDOWN,
        },
        {
          id: uncategorisedId,
          key: uuid(),
          isKeyAccessible: true,
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.CASE_FILE,
        },
        {
          id: uuid(),
          key: uuid(),
          isKeyAccessible: true,
          state: CaseFileState.STORED_IN_COURT,
          category: CaseFileCategory.CASE_FILE,
        },
      ],
      courtCaseNumber,
    } as Case

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(returnedCase)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should post to queue', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_CASE_FILES_RECORD,
          user,
          caseId,
          elementId: policeCaseNumber1,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_CASE_FILES_RECORD,
          user,
          caseId,
          elementId: policeCaseNumber2,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId,
          elementId: criminalRecordId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId,
          elementId: costBreakdownId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId,
          elementId: uncategorisedId,
        },
        { type: MessageType.DELIVERY_TO_COURT_INDICTMENT, user, caseId },
      ])
    })
  })

  describe('court case number update fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseRepositoryService.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case lookup fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
