import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import {
  capitalize,
  formatDate,
  lowercase,
} from '@island.is/judicial-system/formatters'
import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseState,
  CaseDecision,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseState,
  CaseTransition,
  CaseType,
  DateType,
  DefendantEventType,
  DefendantNotificationType,
  DefenderChoice,
  EventType,
  IndictmentCaseNotificationType,
  indictmentCases,
  IndictmentDecision,
  InstitutionType,
  investigationCases,
  RequestCaseNotificationType,
  RequestSharedWithDefender,
  restrictionCases,
  ServiceStatus,
  StringType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { DefendantService } from '../../../defendant'
import { EventService } from '../../../event'
import { EventLogService } from '../../../event-log/eventLog.service'
import { FileService } from '../../../file'
import {
  AppealCase,
  Case,
  CaseRepositoryService,
  CaseStringRepositoryService,
  DateLogRepositoryService,
  DefendantEventLogRepositoryService,
  Verdict,
} from '../../../repository'
import { UserService } from '../../../user'
import { VerdictService } from '../../../verdict'
import { UpdateCaseDto } from '../../dto/updateCase.dto'

jest.mock('../../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
  caseToUpdate: UpdateCaseDto,
) => Promise<Then>

describe('CaseController - Update', () => {
  const date = randomDate()
  const userId = uuid()
  const user = { id: userId } as User
  const defendantId1 = uuid()
  const defendantId2 = uuid()
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtCaseNumber = uuid()
  const policeCaseNumbers = [uuid(), policeCaseNumber, uuid()]
  const caseFileId = uuid()
  const caseFile = { id: caseFileId, caseId, policeCaseNumber }
  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId1 }, { id: defendantId2 }],
    policeCaseNumbers,
    caseFiles: [caseFile],
    courtCaseNumber,
    caseFacts: uuid(),
    legalArguments: uuid(),
  } as Case

  let mockQueuedMessages: Message[]
  let mockEventLogService: EventLogService
  let mockEventService: EventService
  let mockUserService: UserService
  let mockFileService: FileService
  let transaction: Transaction
  let mockCaseRepositoryService: CaseRepositoryService
  let mockDefendantEventLogRepositoryService: DefendantEventLogRepositoryService
  let mockDefendantService: DefendantService
  let mockVerdictService: VerdictService
  let mockCaseStringRepositoryService: CaseStringRepositoryService
  let mockDateLogRepositoryService: DateLogRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      eventLogService,
      eventService,
      userService,
      fileService,
      sequelize,
      caseRepositoryService,
      defendantEventLogRepositoryService,
      defendantService,
      verdictService,
      caseStringRepositoryService,
      dateLogRepositoryService,
      caseController,
    } = await createTestingCaseModule()

    mockQueuedMessages = queuedMessages
    mockEventLogService = eventLogService
    mockEventService = eventService
    mockUserService = userService
    mockFileService = fileService
    mockCaseRepositoryService = caseRepositoryService
    mockDefendantEventLogRepositoryService = defendantEventLogRepositoryService
    mockDefendantService = defendantService
    mockVerdictService = verdictService
    mockCaseStringRepositoryService = caseStringRepositoryService
    mockDateLogRepositoryService = dateLogRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
    mockTransaction.mockResolvedValueOnce(transaction)

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue(theCase)
    const mockFindLiveById = mockCaseRepositoryService.findLiveById as jest.Mock
    mockFindLiveById.mockResolvedValue(theCase)

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      caseToUpdate: UpdateCaseDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.update(
          caseId,
          user,
          theCase,
          caseToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case updated', () => {
    const caseToUpdate = { field1: uuid(), field2: uuid() } as UpdateCaseDto
    const updatedCase = {
      ...theCase,
      ...caseToUpdate,
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      then = await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        caseToUpdate,
        {
          transaction,
        },
      )
    })

    it('should not enqueue the completed for some notification', () => {
      expect(mockQueuedMessages).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            body: {
              type: DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
            },
          }),
        ]),
      )
    })

    it('should return the updated case', () => {
      expect(then.result).toEqual(updatedCase)
    })
  })

  describe('indictment completed for some defendants', () => {
    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
    } as Case

    const caseToUpdate = {
      indictmentDecision: IndictmentDecision.COMPLETING_FOR_SOME,
      defendantEventLogDecisions: [
        {
          defendantId: defendantId1,
          rulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
        },
        {
          defendantId: defendantId2,
          rulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
        },
      ],
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should not persist defendant event log decisions on the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { indictmentDecision: IndictmentDecision.COMPLETING_FOR_SOME },
        { transaction },
      )
    })

    it('should create defendant event logs from the transient decisions', () => {
      expect(
        mockDefendantEventLogRepositoryService.createWithUser,
      ).toHaveBeenNthCalledWith(
        1,
        DefendantEventType.INDICTMENT_DISMISSED,
        caseId,
        defendantId1,
        user,
        transaction,
        undefined,
      )

      expect(
        mockDefendantEventLogRepositoryService.createWithUser,
      ).toHaveBeenNthCalledWith(
        2,
        DefendantEventType.INDICTMENT_CANCELLED,
        caseId,
        defendantId2,
        user,
        transaction,
        undefined,
      )
    })

    it('should enqueue a completed for some notification per concluded defendant', () => {
      expect(mockQueuedMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: MessageType.DEFENDANT_NOTIFICATION,
            caseId,
            elementId: defendantId1,
            body: expect.objectContaining({
              type: DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
            }),
          }),
          expect.objectContaining({
            type: MessageType.DEFENDANT_NOTIFICATION,
            caseId,
            elementId: defendantId2,
            body: expect.objectContaining({
              type: DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
            }),
          }),
        ]),
      )
    })
  })

  describe('indictment completed for some — last remaining defendant (indictmentDecision set to null by frontend)', () => {
    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
    } as Case

    const caseToUpdate = {
      indictmentDecision: null,
      defendantEventLogDecisions: [
        {
          defendantId: defendantId1,
          rulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
        },
      ],
    } as unknown as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should enqueue the completed for some notification even when indictmentDecision is null', () => {
      expect(mockQueuedMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: MessageType.DEFENDANT_NOTIFICATION,
            caseId,
            elementId: defendantId1,
            body: expect.objectContaining({
              type: DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
            }),
          }),
        ]),
      )
    })
  })

  describe('indictment completed for some defendants with ruling dates', () => {
    const rulingDate = '2026-02-23'
    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
    } as Case

    const caseToUpdate = {
      indictmentDecision: IndictmentDecision.COMPLETING_FOR_SOME,
      defendantEventLogDecisions: [
        {
          defendantId: defendantId1,
          rulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
          rulingDate,
        },
        {
          defendantId: defendantId2,
          rulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
        },
      ],
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should set created to 23:59:59.999 UTC on the ruling date when provided', () => {
      const expectedCreated = new Date(rulingDate)
      expectedCreated.setUTCHours(23, 59, 59, 999)

      expect(
        mockDefendantEventLogRepositoryService.createWithUser,
      ).toHaveBeenNthCalledWith(
        1,
        DefendantEventType.INDICTMENT_DISMISSED,
        caseId,
        defendantId1,
        user,
        transaction,
        { created: expectedCreated },
      )

      expect(
        mockDefendantEventLogRepositoryService.createWithUser,
      ).toHaveBeenNthCalledWith(
        2,
        DefendantEventType.INDICTMENT_CANCELLED,
        caseId,
        defendantId2,
        user,
        transaction,
        undefined,
      )
    })

    it('should queue indictment conclusion messages only when ruling date is set', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CONCLUSION,
          user,
          caseId,
          body: {
            defendantId: defendantId1,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            rulingDate,
          },
        },
        {
          type: MessageType.DEFENDANT_NOTIFICATION,
          caseId,
          elementId: defendantId1,
          body: {
            type: DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
          },
        },
        {
          type: MessageType.DEFENDANT_NOTIFICATION,
          caseId,
          elementId: defendantId2,
          body: {
            type: DefendantNotificationType.INDICTMENT_COMPLETED_FOR_SOME,
          },
        },
      ])
    })
  })

  describe('indictment case completed', () => {
    const rulingDate = randomDate()
    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      origin: CaseOrigin.LOKE,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
    } as Case

    const caseToUpdate = { state: CaseState.COMPLETED } as UpdateCaseDto
    const updatedCase = {
      ...indictmentCase,
      state: CaseState.COMPLETED,
    } as Case

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should queue indictment conclusion message to court', () => {
      expect(mockQueuedMessages).toEqual(
        expect.arrayContaining([
          {
            type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CONCLUSION,
            user,
            caseId,
          },
        ]),
      )
    })
  })

  describe('indictment case completed after cancellation request', () => {
    const rulingDate = randomDate()
    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.WAITING_FOR_CANCELLATION,
      indictmentRulingDecision: CaseIndictmentRulingDecision.CANCELLATION,
      rulingDate,
    } as Case

    const caseToUpdate = { state: CaseState.COMPLETED } as UpdateCaseDto
    const updatedCase = {
      ...indictmentCase,
      state: CaseState.COMPLETED,
    } as Case

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should queue only indictment conclusion message to court', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CONCLUSION,
          user,
          caseId,
        },
      ])
    })
  })

  describe('indictment case completed without ruling date', () => {
    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
      origin: CaseOrigin.LOKE,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    } as Case

    const caseToUpdate = { state: CaseState.COMPLETED } as UpdateCaseDto
    const updatedCase = {
      ...indictmentCase,
      state: CaseState.COMPLETED,
    } as Case

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should not queue indictment conclusion message to court', () => {
      expect(
        mockQueuedMessages.filter(
          (message) =>
            message.type ===
            MessageType.DELIVERY_TO_COURT_INDICTMENT_CONCLUSION,
        ),
      ).toEqual([])
    })
  })

  describe('split indictment case court case number assigned', () => {
    const splitCaseId = uuid()
    const splitDefendantId = uuid()
    const newCourtCaseNumber = uuid()
    const created = new Date('2026-01-15T10:00:00.000Z')

    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      courtCaseNumber: undefined,
      splitCaseId,
      defendants: [{ id: splitDefendantId }],
      policeCaseNumbers: [policeCaseNumber],
      caseFiles: [],
    } as Case

    const caseToUpdate = {
      courtCaseNumber: newCourtCaseNumber,
    } as UpdateCaseDto
    const updatedCase = {
      ...indictmentCase,
      courtCaseNumber: newCourtCaseNumber,
      created,
    } as Case

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should queue split-off conclusion message to parent case', () => {
      expect(mockQueuedMessages).toEqual(
        expect.arrayContaining([
          {
            type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CONCLUSION,
            user,
            caseId: splitCaseId,
            body: {
              defendantId: splitDefendantId,
              splitCaseNumber: newCourtCaseNumber,
              rulingDate: created.toISOString(),
            },
          },
        ]),
      )
    })
  })

  describe('indictment completed for some defendants with invalid defendant id', () => {
    const indictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
    } as Case

    const caseToUpdate = {
      indictmentDecision: IndictmentDecision.COMPLETING_FOR_SOME,
      defendantEventLogDecisions: [
        {
          defendantId: uuid(),
          rulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
        },
      ],
    } as UpdateCaseDto

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, indictmentCase, caseToUpdate)
    })

    it('should reject updates for defendants that do not belong to the case', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toContain('does not belong to case')
    })
  })

  describe('court case number added', () => {
    const caseToUpdate = {
      state: CaseState.RECEIVED,
      courtCaseNumber: 'R-2020-1234',
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should transition the case from SUBMITTED to RECEIVED', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        {
          courtCaseNumber: caseToUpdate.courtCaseNumber,
          state: CaseState.RECEIVED,
        },
        { transaction },
      )
    })
  })

  describe('police case number removed', () => {
    const caseToUpdate = {
      policeCaseNumbers: [policeCaseNumbers[0], policeCaseNumbers[2]],
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should delete a case file', () => {
      expect(mockFileService.deleteCaseFile).toHaveBeenCalledWith(
        theCase,
        caseFile,
        transaction,
      )
    })
  })

  describe('police case number changed', () => {
    const newPoliceCaseNumber = uuid()
    const caseToUpdate = {
      policeCaseNumbers: [
        policeCaseNumbers[0],
        newPoliceCaseNumber,
        policeCaseNumbers[2],
      ],
    } as UpdateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update a case file', () => {
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId,
        { policeCaseNumber: newPoliceCaseNumber },
        transaction,
      )
    })
  })

  describe('case is resent by prosecutor', () => {
    const caseToUpdate = {
      caseResentExplanation: 'Endursending',
    }

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update court case facts and court legal arguments', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        {
          caseResentExplanation: 'Endursending',
          courtCaseFacts: `Í greinargerð sóknaraðila er atvikum lýst svo: ${theCase.caseFacts}`,
          courtLegalArguments: `Í greinargerð er krafa sóknaraðila rökstudd þannig: ${theCase.legalArguments}`,
        },
        { transaction },
      )
    })
  })

  describe('case is resent by prosecutor with changed dates', () => {
    const caseToUpdate = {
      caseResentExplanation: 'Endursending',
      demands: 'Updated demands',
      requestedValidToDate: new Date(),
    }

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update prosecutor demands and valid to date', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          demands: 'Updated demands',
          prosecutorDemands: 'Updated demands',
          requestedValidToDate: caseToUpdate.requestedValidToDate,
          validToDate: caseToUpdate.requestedValidToDate,
        }),
        { transaction },
      )
    })
  })

  describe('case is resent by prosecutor with changed dates after decision', () => {
    const caseToUpdate = {
      caseResentExplanation: 'Endursending',
      demands: 'Updated demands',
      requestedValidToDate: new Date(),
    }

    const acceptingCase = {
      ...theCase,
      decision: CaseDecision.ACCEPTING,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, user, acceptingCase, caseToUpdate)
    })

    it('should update prosecutor demands but not valid to date', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          demands: 'Updated demands',
          prosecutorDemands: 'Updated demands',
          requestedValidToDate: caseToUpdate.requestedValidToDate,
        }),
        { transaction },
      )
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'court case number updated for %s case',
    (type) => {
      const courtCaseNumber = uuid()
      const caseToUpdate = { courtCaseNumber }
      const updatedCase = { ...theCase, type, courtCaseNumber }

      beforeEach(async () => {
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
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
    },
  )

  describe.each([...restrictionCases, ...investigationCases])(
    'defender email updated for %s case',
    (type) => {
      const defenderEmail = uuid()
      const caseToUpdate = { defenderEmail }
      const updatedCase = { ...theCase, type, defenderEmail }

      beforeEach(async () => {
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockQueuedMessages).toEqual([
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
    },
  )

  describe('prosecutor updated for case', () => {
    const prosecutorId = uuid()
    const caseToUpdate = { prosecutorId }
    const updatedCase = { ...theCase, prosecutorId }

    beforeEach(async () => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        id: prosecutorId,
        role: UserRole.PROSECUTOR,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      })
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should post to queue', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_PROSECUTOR,
          user,
          caseId,
        },
      ])
    })
  })

  describe.each(indictmentCases)(
    'court case number updated for %s case',
    (type) => {
      const courtCaseNumber = uuid()
      const caseToUpdate = { courtCaseNumber }
      const policeCaseNumber1 = uuid()
      const policeCaseNumber2 = uuid()
      const criminalRecordId = uuid()
      const costBreakdownId = uuid()
      const uncategorisedId = uuid()
      const updatedCase = {
        ...theCase,
        type,
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
      }

      beforeEach(async () => {
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
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
          {
            type: MessageType.DELIVERY_TO_COURT_INDICTMENT,
            user,
            caseId,
          },
        ])
      })
    },
  )

  describe.each(restrictionCases)(
    'case modified explanation is updated for %s case',
    (type) => {
      const originalCase = { ...theCase, type } as Case
      const caseToUdate = { caseModifiedExplanation: 'some explanation' }
      const updatedCase = {
        ...theCase,
        type,
        origin: CaseOrigin.LOKE,
        caseModifiedExplanation: 'some explanation',
      }

      beforeEach(async () => {
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, originalCase, caseToUdate)
      })

      it('should post modified notification to queue', async () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.NOTIFICATION,
            user,
            caseId,
            body: { type: RequestCaseNotificationType.MODIFIED },
          },
          { type: MessageType.DELIVERY_TO_POLICE_CASE, user, caseId },
        ])
      })
    },
  )

  describe.each([CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY])(
    'valid to date is updated for accepted %s case',
    (type) => {
      const validToDate = randomDate()
      const modifiedValidToDate = new Date(validToDate.getTime() + 1000)
      const originalCase = {
        ...theCase,
        type,
        state: CaseState.ACCEPTED,
        validToDate,
      } as Case
      const caseToUdate = {
        caseModifiedExplanation: 'some explanation',
        validToDate: modifiedValidToDate,
      }
      const updatedCase = {
        ...originalCase,
        origin: CaseOrigin.LOKE,
        caseModifiedExplanation: 'some explanation',
        validToDate: modifiedValidToDate,
      }

      beforeEach(async () => {
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, originalCase, caseToUdate)
      })

      it('should post the case update and the custody notice to queue', async () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.NOTIFICATION,
            user,
            caseId,
            body: { type: RequestCaseNotificationType.MODIFIED },
          },
          { type: MessageType.DELIVERY_TO_POLICE_CASE, user, caseId },
          {
            type: MessageType.DELIVERY_TO_POLICE_CUSTODY_NOTICE,
            user,
            caseId,
          },
        ])
      })
    },
  )

  describe('isolation to date is updated for accepted custody case', () => {
    const isolationToDate = randomDate()
    const modifiedIsolationToDate = new Date(isolationToDate.getTime() + 1000)
    const originalCase = {
      ...theCase,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      validToDate: randomDate(),
      isolationToDate,
    } as Case
    const caseToUdate = {
      caseModifiedExplanation: 'some explanation',
      isolationToDate: modifiedIsolationToDate,
    }
    const updatedCase = {
      ...originalCase,
      origin: CaseOrigin.LOKE,
      caseModifiedExplanation: 'some explanation',
      isolationToDate: modifiedIsolationToDate,
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, originalCase, caseToUdate)
    })

    it('should post the case update and the custody notice to queue', async () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: RequestCaseNotificationType.MODIFIED },
        },
        { type: MessageType.DELIVERY_TO_POLICE_CASE, user, caseId },
        {
          type: MessageType.DELIVERY_TO_POLICE_CUSTODY_NOTICE,
          user,
          caseId,
        },
      ])
    })
  })

  describe('custody dates are not updated for accepted custody case', () => {
    const originalCase = {
      ...theCase,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      validToDate: randomDate(),
      isolationToDate: randomDate(),
    } as Case
    const caseToUdate = { caseModifiedExplanation: 'some explanation' }
    const updatedCase = {
      ...originalCase,
      origin: CaseOrigin.LOKE,
      caseModifiedExplanation: 'some explanation',
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, originalCase, caseToUdate)
    })

    it('should not post the custody notice to queue', async () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: RequestCaseNotificationType.MODIFIED },
        },
        { type: MessageType.DELIVERY_TO_POLICE_CASE, user, caseId },
      ])
    })
  })

  describe('valid to date is updated for accepted travel ban case', () => {
    const validToDate = randomDate()
    const modifiedValidToDate = new Date(validToDate.getTime() + 1000)
    const originalCase = {
      ...theCase,
      type: CaseType.TRAVEL_BAN,
      state: CaseState.ACCEPTED,
      validToDate,
    } as Case
    const caseToUdate = {
      caseModifiedExplanation: 'some explanation',
      validToDate: modifiedValidToDate,
    }
    const updatedCase = {
      ...originalCase,
      origin: CaseOrigin.LOKE,
      caseModifiedExplanation: 'some explanation',
      validToDate: modifiedValidToDate,
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, originalCase, caseToUdate)
    })

    it('should not post a custody notice to queue', async () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: RequestCaseNotificationType.MODIFIED },
        },
        { type: MessageType.DELIVERY_TO_POLICE_CASE, user, caseId },
      ])
    })
  })

  describe('neither court case number nor defender email nor prosecutorId nor caseModifiedExplanation updated', () => {
    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, {})
    })

    it('should not post to queue', () => {
      expect(mockQueuedMessages).toEqual([])
    })
  })

  describe('arraignment date updated', () => {
    const arraignmentDate = { date: new Date(), location: uuid() }
    const caseToUpdate = { arraignmentDate }
    const updatedCase = {
      ...theCase,
      type: CaseType.CUSTODY,
      dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, ...arraignmentDate }],
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.CUSTODY } as Case,
        caseToUpdate,
      )
    })

    it('should update case', () => {
      expect(mockDateLogRepositoryService.createForCase).toHaveBeenCalledWith(
        caseId,
        DateType.ARRAIGNMENT_DATE,
        arraignmentDate,
        {
          transaction,
        },
      )
    })

    it('should log a court date scheduled event, which drives court date notifications', () => {
      expect(mockEventLogService.createWithUser).toHaveBeenCalledWith(
        EventType.COURT_DATE_SCHEDULED,
        caseId,
        user,
        transaction,
      )
    })
  })

  describe('arraignment date unchanged', () => {
    const arraignmentDate = { date: new Date(), location: uuid() }
    const updatedCase = {
      ...theCase,
      type: CaseType.CUSTODY,
      dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, ...arraignmentDate }],
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        {
          ...theCase,
          type: CaseType.CUSTODY,
          dateLogs: [
            { dateType: DateType.ARRAIGNMENT_DATE, ...arraignmentDate },
          ],
        } as Case,
        {},
      )
    })

    it('should not log a court date scheduled event', () => {
      expect(mockEventLogService.createWithUser).not.toHaveBeenCalledWith(
        EventType.COURT_DATE_SCHEDULED,
        caseId,
        user,
        transaction,
      )
    })
  })

  describe('indictment arraignment date updated', () => {
    const arraignmentDate = { date: new Date(), location: uuid() }
    const caseToUpdate = { arraignmentDate }
    const updatedCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      origin: CaseOrigin.LOKE,
      dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, ...arraignmentDate }],
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.INDICTMENT } as Case,
        caseToUpdate,
      )
    })

    it('should update case', () => {
      expect(mockDateLogRepositoryService.createForCase).toHaveBeenCalledWith(
        caseId,
        DateType.ARRAIGNMENT_DATE,
        arraignmentDate,
        {
          transaction,
        },
      )
      expect(mockEventLogService.createWithUser).toHaveBeenCalledWith(
        EventType.COURT_DATE_SCHEDULED,
        caseId,
        user,
        transaction,
      )
      // Subpoenas are no longer created automatically when updating arraignment date.
      // They must be created via the separate createSubpoenas endpoint.
      // However, the arraignment date notification to court should still be sent
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_INDICTMENT_ARRAIGNMENT_DATE,
          user,
          caseId: theCase.id,
        },
      ])
    })
  })

  describe('indictment arraignment date updated while summons skipped', () => {
    const arraignmentDate = { date: new Date(), location: uuid() }
    const caseToUpdate = {
      arraignmentDate,
      isArraignmentSummonsSkipped: true,
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({
        ...theCase,
        type: CaseType.INDICTMENT,
        dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, ...arraignmentDate }],
      })

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.INDICTMENT } as Case,
        caseToUpdate,
      )
    })

    it('should clear the skipped summons flag', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { isArraignmentSummonsSkipped: false },
        { transaction },
      )
    })
  })

  describe('indictment arraignment date cleared while summons skipped', () => {
    const caseToUpdate = {
      arraignmentDate: null,
      isArraignmentSummonsSkipped: true,
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({
        ...theCase,
        type: CaseType.INDICTMENT,
        isArraignmentSummonsSkipped: true,
      })

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.INDICTMENT } as Case,
        caseToUpdate,
      )
    })

    it('should keep the skipped summons flag', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { isArraignmentSummonsSkipped: true },
        { transaction },
      )
    })
  })

  describe('indictment arraignment location updated while summons skipped', () => {
    const caseToUpdate = {
      arraignmentDate: { location: uuid() },
      isArraignmentSummonsSkipped: true,
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({
        ...theCase,
        type: CaseType.INDICTMENT,
        isArraignmentSummonsSkipped: true,
      })

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.INDICTMENT } as Case,
        caseToUpdate,
      )
    })

    it('should keep the skipped summons flag', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { isArraignmentSummonsSkipped: true },
        { transaction },
      )
    })
  })

  describe('indictment court date updated', () => {
    const courtDate = { date: new Date(), location: uuid() }
    const caseToUpdate = { courtDate }
    const updatedCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      dateLogs: [{ dateType: DateType.COURT_DATE, ...courtDate }],
    }

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.INDICTMENT } as Case,
        caseToUpdate,
      )
    })

    it('should update case', () => {
      expect(mockDateLogRepositoryService.createForCase).toHaveBeenCalledWith(
        caseId,
        DateType.COURT_DATE,
        courtDate,
        {
          transaction,
        },
      )
      expect(mockEventLogService.createWithUser).toHaveBeenCalledWith(
        EventType.COURT_DATE_SCHEDULED,
        caseId,
        user,
        transaction,
      )
    })
  })

  describe('postponed indefinitely explanation updated', () => {
    const postponedIndefinitelyExplanation = uuid()
    const caseToUpdate = { postponedIndefinitelyExplanation }

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update case', () => {
      expect(
        mockCaseStringRepositoryService.upsertByCaseAndType,
      ).toHaveBeenCalledWith(
        caseId,
        StringType.POSTPONED_INDEFINITELY_EXPLANATION,
        postponedIndefinitelyExplanation,
        { transaction },
      )
    })
  })

  describe('civil demands updated', () => {
    const civilDemands = uuid()
    const caseToUpdate = { civilDemands }

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update case', () => {
      expect(
        mockCaseStringRepositoryService.upsertByCaseAndType,
      ).toHaveBeenCalledWith(caseId, StringType.CIVIL_DEMANDS, civilDemands, {
        transaction,
      })
    })
  })

  describe('merge parent chosen for a received case', () => {
    const receivedCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
    } as Case
    const caseToUpdate = { mergeCaseId: uuid() } as UpdateCaseDto
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, receivedCase, caseToUpdate)
    })

    it('should update the case', () => {
      expect(then.error).toBeUndefined()
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        caseToUpdate,
        { transaction },
      )
    })
  })

  // The court sends the merged case's parent back with every conclusion save,
  // including while correcting a case that was concluded by merging.
  describe('merge parent sent for a case that is not received', () => {
    const parentCaseId = uuid()
    const correctingCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.CORRECTING,
      indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
      mergeCaseId: parentCaseId,
    } as Case

    describe('that is the existing parent', () => {
      const caseToUpdate = { mergeCaseId: parentCaseId } as UpdateCaseDto
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(caseId, user, correctingCase, caseToUpdate)
      })

      it('should update the case', () => {
        expect(then.error).toBeUndefined()
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
          caseId,
          caseToUpdate,
          { transaction },
        )
      })
    })

    describe('that is a different parent', () => {
      const caseToUpdate = { mergeCaseId: uuid() } as UpdateCaseDto
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(caseId, user, correctingCase, caseToUpdate)
      })

      it('should refuse the merge', () => {
        expect(then.error).toBeInstanceOf(BadRequestException)
        expect(mockCaseRepositoryService.update).not.toHaveBeenCalled()
      })
    })
  })

  describe('reopenReason on non-indictment case', () => {
    const nonIndictmentCase = {
      ...theCase,
      type: CaseType.CUSTODY,
      state: CaseState.COMPLETED,
    } as Case

    const caseToUpdate = { reopenReason: uuid() } as UpdateCaseDto

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, nonIndictmentCase, caseToUpdate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
    })
  })

  describe('reopenReason on non-completed indictment case', () => {
    const receivedIndictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.RECEIVED,
    } as Case

    const caseToUpdate = { reopenReason: uuid() } as UpdateCaseDto

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseId,
        user,
        receivedIndictmentCase,
        caseToUpdate,
      )
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe.each(['', '   ', '\n\t '])(
    'reopen indictment case with empty reopenReason %p',
    (emptyReason) => {
      const completedIndictmentCase = {
        ...theCase,
        type: CaseType.INDICTMENT,
        state: CaseState.COMPLETED,
      } as Case

      const caseToUpdate = { reopenReason: emptyReason } as UpdateCaseDto

      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(
          caseId,
          user,
          completedIndictmentCase,
          caseToUpdate,
        )
      })

      it('should throw BadRequestException', () => {
        expect(then.error).toBeInstanceOf(BadRequestException)
      })
    },
  )

  describe('reopen indictment case with active appeal', () => {
    const completedIndictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      appealCase: {
        appealState: AppealCaseState.RECEIVED,
      } as AppealCase,
    } as Case

    const caseToUpdate = { reopenReason: uuid() } as UpdateCaseDto

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        caseId,
        user,
        completedIndictmentCase,
        caseToUpdate,
      )
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('reopen indictment case with withdrawn appeal', () => {
    const completedIndictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      appealCase: {
        appealState: AppealCaseState.WITHDRAWN,
      } as AppealCase,
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockUpdateDatabaseDefendant =
        mockDefendantService.updateDatabaseDefendant as jest.Mock
      mockUpdateDatabaseDefendant.mockResolvedValue({})

      then = await givenWhenThen(caseId, user, completedIndictmentCase, {
        reopenReason: uuid(),
      } as UpdateCaseDto)
    })

    it('should not throw', () => {
      expect(then.error).toBeUndefined()
    })
  })

  describe('reopen indictment case with completed appeal', () => {
    const completedIndictmentCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      appealCase: {
        appealState: AppealCaseState.COMPLETED,
      } as AppealCase,
    } as Case

    let caseToUpdate: UpdateCaseDto
    let originalReopenReason: string
    let then: Then

    beforeEach(async () => {
      originalReopenReason = uuid()
      caseToUpdate = { reopenReason: originalReopenReason } as UpdateCaseDto

      const mockUpdateDatabaseDefendant =
        mockDefendantService.updateDatabaseDefendant as jest.Mock
      mockUpdateDatabaseDefendant.mockResolvedValue({})

      then = await givenWhenThen(
        caseId,
        user,
        completedIndictmentCase,
        caseToUpdate,
      )
    })

    it('should not throw', () => {
      expect(then.error).toBeUndefined()
    })

    it('should reset defendant fields', () => {
      const resetPayload = {
        isSentToPrisonAdmin: false,
        isClosedWithoutEnforcement: false,
        indictmentReviewDecision: null,
        publicProsecutorIsRegisteredInPoliceSystem: null,
        isDrivingLicenseSuspended: null,
      }
      expect(mockDefendantService.updateDatabaseDefendant).toHaveBeenCalledWith(
        caseId,
        defendantId1,
        resetPayload,
        transaction,
      )
      expect(mockDefendantService.updateDatabaseDefendant).toHaveBeenCalledWith(
        caseId,
        defendantId2,
        resetPayload,
        transaction,
      )
    })

    it('should store reopenReason with header prepended', () => {
      const expectedHeader = `${capitalize(formatDate(date, 'PPPPp'))} - ${
        user.name
      } ${lowercase(user.title)}.`
      expect(
        mockCaseStringRepositoryService.upsertByCaseAndType,
      ).toHaveBeenCalledWith(
        caseId,
        StringType.REOPEN_REASON,
        `${expectedHeader}\n${originalReopenReason}`,
        { transaction },
      )
    })
  })

  describe('reopen indictment case - queues INDICTMENT_REOPENED notification', () => {
    const reopeningCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
    } as Case

    const caseToUpdate = { reopenReason: uuid() } as UpdateCaseDto

    beforeEach(async () => {
      const mockUpdateDatabaseDefendant =
        mockDefendantService.updateDatabaseDefendant as jest.Mock
      mockUpdateDatabaseDefendant.mockResolvedValue({})
      ;(mockCaseRepositoryService.update as jest.Mock).mockResolvedValueOnce({
        ...reopeningCase,
        state: CaseState.RECEIVED,
      })
      ;(
        mockCaseRepositoryService.findLiveById as jest.Mock
      ).mockResolvedValueOnce({
        ...reopeningCase,
        state: CaseState.RECEIVED,
      })

      await givenWhenThen(caseId, user, reopeningCase, caseToUpdate)
    })

    it('should queue INDICTMENT_REOPENED notification', () => {
      expect(mockQueuedMessages).toContainEqual({
        type: MessageType.NOTIFICATION,
        user,
        caseId,
        body: { type: IndictmentCaseNotificationType.INDICTMENT_REOPENED },
      })
    })

    it('should create INDICTMENT_REOPENED event log', () => {
      expect(mockEventLogService.createWithUser).toHaveBeenCalledWith(
        EventType.INDICTMENT_REOPENED,
        caseId,
        user,
        transaction,
      )
    })

    it('should post a REOPEN Slack event', () => {
      expect(mockEventService.postEvent).toHaveBeenCalledWith(
        CaseTransition.REOPEN,
        expect.objectContaining({ id: caseId, state: CaseState.RECEIVED }),
      )
    })
  })

  describe('appeal prosecutor assigned - queues APPEAL_PROSECUTOR_ASSIGNED', () => {
    const appealProsecutorId = uuid()
    const validAppealProsecutor = {
      id: appealProsecutorId,
      role: UserRole.PROSECUTOR,
      active: true,
      institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
    }

    describe.each([
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ])('for indictment ruling decision %s', (indictmentRulingDecision) => {
      const originalCase = {
        ...theCase,
        type: CaseType.INDICTMENT,
        indictmentRulingDecision,
      } as Case
      const caseToUpdate = { appealProsecutorId } as UpdateCaseDto
      const updatedCase = {
        ...originalCase,
        appealProsecutorId,
      }

      beforeEach(async () => {
        ;(mockUserService.findById as jest.Mock).mockResolvedValueOnce(
          validAppealProsecutor,
        )
        ;(mockCaseRepositoryService.update as jest.Mock).mockResolvedValueOnce(
          updatedCase,
        )
        ;(
          mockCaseRepositoryService.findLiveById as jest.Mock
        ).mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, originalCase, caseToUpdate)
      })

      it('should queue APPEAL_PROSECUTOR_ASSIGNED notification', () => {
        expect(mockQueuedMessages).toContainEqual({
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.APPEAL_PROSECUTOR_ASSIGNED,
          },
        })
      })
    })

    describe('when appeal prosecutor is unchanged', () => {
      const originalCase = {
        ...theCase,
        type: CaseType.INDICTMENT,
        appealProsecutorId,
      } as Case
      const caseToUpdate = { appealProsecutorId } as UpdateCaseDto
      const updatedCase = {
        ...originalCase,
        appealProsecutorId,
      }

      beforeEach(async () => {
        ;(mockUserService.findById as jest.Mock).mockResolvedValueOnce(
          validAppealProsecutor,
        )
        ;(mockCaseRepositoryService.update as jest.Mock).mockResolvedValueOnce(
          updatedCase,
        )
        ;(
          mockCaseRepositoryService.findLiveById as jest.Mock
        ).mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, originalCase, caseToUpdate)
      })

      it('should not queue APPEAL_PROSECUTOR_ASSIGNED notification', () => {
        expect(mockQueuedMessages).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              body: {
                type: IndictmentCaseNotificationType.APPEAL_PROSECUTOR_ASSIGNED,
              },
            }),
          ]),
        )
      })
    })

    describe('when case is not an indictment', () => {
      const originalCase = {
        ...theCase,
        type: CaseType.CUSTODY,
      } as Case
      const caseToUpdate = { appealProsecutorId } as UpdateCaseDto
      const updatedCase = {
        ...originalCase,
        appealProsecutorId,
      }

      beforeEach(async () => {
        ;(mockUserService.findById as jest.Mock).mockResolvedValueOnce(
          validAppealProsecutor,
        )
        ;(mockCaseRepositoryService.update as jest.Mock).mockResolvedValueOnce(
          updatedCase,
        )
        ;(
          mockCaseRepositoryService.findLiveById as jest.Mock
        ).mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, originalCase, caseToUpdate)
      })

      it('should not queue APPEAL_PROSECUTOR_ASSIGNED notification', () => {
        expect(mockQueuedMessages).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              body: {
                type: IndictmentCaseNotificationType.APPEAL_PROSECUTOR_ASSIGNED,
              },
            }),
          ]),
        )
      })
    })

    describe('when assigned user is inactive', () => {
      let then: Then

      beforeEach(async () => {
        ;(mockUserService.findById as jest.Mock).mockResolvedValueOnce({
          ...validAppealProsecutor,
          active: false,
        })

        then = await givenWhenThen(caseId, user, theCase, {
          appealProsecutorId,
        } as UpdateCaseDto)
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(mockCaseRepositoryService.update).not.toHaveBeenCalled()
      })
    })

    describe('when assigned user is not a prosecutor', () => {
      let then: Then

      beforeEach(async () => {
        ;(mockUserService.findById as jest.Mock).mockResolvedValueOnce({
          ...validAppealProsecutor,
          role: UserRole.PUBLIC_PROSECUTOR_STAFF,
        })

        then = await givenWhenThen(caseId, user, theCase, {
          appealProsecutorId,
        } as UpdateCaseDto)
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(mockCaseRepositoryService.update).not.toHaveBeenCalled()
      })
    })

    describe('when assigned user is not from Ríkissaksóknari', () => {
      let then: Then

      beforeEach(async () => {
        ;(mockUserService.findById as jest.Mock).mockResolvedValueOnce({
          ...validAppealProsecutor,
          institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
        })

        then = await givenWhenThen(caseId, user, theCase, {
          appealProsecutorId,
        } as UpdateCaseDto)
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(mockCaseRepositoryService.update).not.toHaveBeenCalled()
      })
    })
  })

  describe('reopen indictment case - resets verdict data on each verdict', () => {
    const verdict1 = { id: uuid() } as Verdict
    const verdict2 = { id: uuid() } as Verdict
    const reopeningCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      defendants: [
        { id: defendantId1, verdicts: [verdict1] },
        { id: defendantId2, verdicts: [verdict2] },
      ],
    } as Case

    const caseToUpdate = { reopenReason: uuid() } as UpdateCaseDto

    beforeEach(async () => {
      ;(
        mockDefendantService.updateDatabaseDefendant as jest.Mock
      ).mockResolvedValue({})

      await givenWhenThen(caseId, user, reopeningCase, caseToUpdate)
    })

    it('should reset verdict data for each verdict', () => {
      expect(mockVerdictService.resetVerdictDataForReopen).toHaveBeenCalledWith(
        verdict1,
        transaction,
      )
      expect(mockVerdictService.resetVerdictDataForReopen).toHaveBeenCalledWith(
        verdict2,
        transaction,
      )
    })
  })

  describe('dual-write defender to defendants for request cases', () => {
    const defenderName = 'Jane Doe'
    const defenderNationalId = '1234567890'
    const defenderEmail = 'jane@example.is'
    const defenderPhoneNumber = '5551234'
    const requestCase = {
      ...theCase,
      type: CaseType.CUSTODY,
      defenderName: 'Old Name',
      defenderNationalId: '0000000000',
      defenderEmail: 'old@example.is',
      defenderPhoneNumber: '0000000',
      defendantWaivesRightToCounsel: false,
    } as Case

    describe('syncs defender fields when defenderName changes on a request case', () => {
      beforeEach(async () => {
        await givenWhenThen(caseId, user, requestCase, {
          defenderName,
          defenderNationalId,
          defenderEmail,
          defenderPhoneNumber,
        } as UpdateCaseDto)
      })

      it('should call syncDefenderToAllDefendants with merged contact fields', () => {
        expect(
          mockDefendantService.syncDefenderToAllDefendants,
        ).toHaveBeenCalledWith(
          caseId,
          {
            defenderName,
            defenderNationalId,
            defenderEmail,
            defenderPhoneNumber,
            defenderChoice: null,
            requestSharedWithDefender: undefined,
          },
          transaction,
        )
      })
    })

    describe('clears defender fields when defenderName is set to null', () => {
      beforeEach(async () => {
        await givenWhenThen(caseId, user, requestCase, {
          defenderName: null,
        } as unknown as UpdateCaseDto)
      })

      it('should call syncDefenderToAllDefendants with null name and remaining contacts', () => {
        expect(
          mockDefendantService.syncDefenderToAllDefendants,
        ).toHaveBeenCalledWith(
          caseId,
          {
            defenderName: null,
            defenderNationalId: '0000000000',
            defenderEmail: 'old@example.is',
            defenderPhoneNumber: '0000000',
            defenderChoice: null,
            requestSharedWithDefender: undefined,
          },
          transaction,
        )
      })
    })

    describe('sets WAIVE when defendantWaivesRightToCounsel is true', () => {
      beforeEach(async () => {
        await givenWhenThen(caseId, user, requestCase, {
          defendantWaivesRightToCounsel: true,
        } as UpdateCaseDto)
      })

      it('should sync contact fields with defenderChoice WAIVE', () => {
        expect(
          mockDefendantService.syncDefenderToAllDefendants,
        ).toHaveBeenCalledWith(
          caseId,
          {
            defenderName: 'Old Name',
            defenderNationalId: '0000000000',
            defenderEmail: 'old@example.is',
            defenderPhoneNumber: '0000000',
            defenderChoice: DefenderChoice.WAIVE,
            requestSharedWithDefender: undefined,
          },
          transaction,
        )
      })
    })

    describe('does not sync for indictment cases', () => {
      const indictmentCase = {
        ...theCase,
        type: CaseType.INDICTMENT,
      } as Case

      beforeEach(async () => {
        await givenWhenThen(caseId, user, indictmentCase, {
          defenderName: 'Someone',
        } as UpdateCaseDto)
      })

      it('should not call syncDefenderToAllDefendants', () => {
        expect(
          mockDefendantService.syncDefenderToAllDefendants,
        ).not.toHaveBeenCalled()
      })
    })

    describe('does not sync when non-defender fields change', () => {
      beforeEach(async () => {
        await givenWhenThen(caseId, user, requestCase, {
          courtLocation: 'Some court',
        } as UpdateCaseDto)
      })

      it('should not call syncDefenderToAllDefendants', () => {
        expect(
          mockDefendantService.syncDefenderToAllDefendants,
        ).not.toHaveBeenCalled()
      })
    })

    describe('syncs when requestSharedWithDefender changes on a request case', () => {
      beforeEach(async () => {
        await givenWhenThen(caseId, user, requestCase, {
          requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
        } as UpdateCaseDto)
      })

      it('should call syncDefenderToAllDefendants with sharing and contact fields', () => {
        expect(
          mockDefendantService.syncDefenderToAllDefendants,
        ).toHaveBeenCalledWith(
          caseId,
          {
            defenderName: 'Old Name',
            defenderNationalId: '0000000000',
            defenderEmail: 'old@example.is',
            defenderPhoneNumber: '0000000',
            defenderChoice: null,
            requestSharedWithDefender:
              RequestSharedWithDefender.READY_FOR_COURT,
          },
          transaction,
        )
      })
    })
  })

  describe.each([
    {
      role: 'judge',
      userRole: UserRole.DISTRICT_COURT_JUDGE,
      notificationType:
        IndictmentCaseNotificationType.DISTRICT_COURT_JUDGE_ASSIGNED,
    },
    {
      role: 'registrar',
      userRole: UserRole.DISTRICT_COURT_REGISTRAR,
      notificationType:
        IndictmentCaseNotificationType.DISTRICT_COURT_REGISTRAR_ASSIGNED,
    },
  ])(
    'district court $role assigned to an indictment case',
    ({ role, userRole, notificationType }) => {
      const assignee = {
        id: uuid(),
        nationalId: '0101017890',
        email: `${role}@court.is`,
        role: userRole,
      }
      const caseToUpdate = { [`${role}Id`]: assignee.id } as UpdateCaseDto

      const givenAssignment = async (state: CaseState) => {
        const originalCase = {
          ...theCase,
          type: CaseType.INDICTMENT,
          state,
        } as Case
        const updatedCase = {
          ...originalCase,
          ...caseToUpdate,
          [role]: assignee,
        } as Case

        const mockFindById = mockUserService.findById as jest.Mock
        mockFindById.mockResolvedValueOnce(assignee)
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, originalCase, caseToUpdate)
      }

      describe('while the case is submitted', () => {
        beforeEach(() => givenAssignment(CaseState.SUBMITTED))

        it(`should queue the ${notificationType} notification and nothing else`, () => {
          expect(mockQueuedMessages).toEqual([
            {
              type: MessageType.NOTIFICATION,
              user,
              caseId,
              body: { type: notificationType },
            },
          ])
        })
      })

      describe('after the case has been received', () => {
        beforeEach(() => givenAssignment(CaseState.RECEIVED))

        it('should queue the notification and deliver the court role to the court', () => {
          expect(mockQueuedMessages).toEqual([
            {
              type: MessageType.NOTIFICATION,
              user,
              caseId,
              body: { type: notificationType },
            },
            {
              type: MessageType.DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES,
              user,
              caseId,
              elementId: assignee.nationalId,
            },
          ])
        })
      })

      // Pins the state filter: court users never see a draft indictment, so
      // this is not a path a request takes
      describe('before the case has been submitted', () => {
        beforeEach(() => givenAssignment(CaseState.DRAFT))

        it('should queue nothing', () => {
          expect(mockQueuedMessages).toEqual([])
        })
      })
    },
  )

  describe('district court judge and registrar assigned together to a received indictment case', () => {
    const judge = {
      id: uuid(),
      nationalId: '0101017890',
      email: 'judge@court.is',
      role: UserRole.DISTRICT_COURT_JUDGE,
    }
    const registrar = {
      id: uuid(),
      nationalId: '0202027890',
      email: 'registrar@court.is',
      role: UserRole.DISTRICT_COURT_REGISTRAR,
    }
    const caseToUpdate = {
      judgeId: judge.id,
      registrarId: registrar.id,
    } as UpdateCaseDto

    beforeEach(async () => {
      const originalCase = {
        ...theCase,
        type: CaseType.INDICTMENT,
        state: CaseState.RECEIVED,
      } as Case
      const updatedCase = {
        ...originalCase,
        ...caseToUpdate,
        judge,
        registrar,
      } as Case

      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce(judge).mockResolvedValueOnce(registrar)
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, originalCase, caseToUpdate)
    })

    // The delivery resolves one role per message, so both assignments must be
    // delivered - the judge first, matching the notifications above and the
    // order the controller validates the two assignees in
    it('should deliver both court roles to the court', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.DISTRICT_COURT_JUDGE_ASSIGNED,
          },
        },
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: {
            type: IndictmentCaseNotificationType.DISTRICT_COURT_REGISTRAR_ASSIGNED,
          },
        },
        {
          type: MessageType.DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES,
          user,
          caseId,
          elementId: judge.nationalId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES,
          user,
          caseId,
          elementId: registrar.nationalId,
        },
      ])
    })
  })

  describe('public prosecutor reviewer assigned', () => {
    const indictmentReviewerId = uuid()
    const caseToUpdate = { indictmentReviewerId } as UpdateCaseDto

    const givenAssignment = async (
      indictmentRulingDecision: CaseIndictmentRulingDecision,
    ) => {
      const originalCase = {
        ...theCase,
        type: CaseType.INDICTMENT,
        state: CaseState.COMPLETED,
        indictmentRulingDecision,
      } as Case
      const updatedCase = { ...originalCase, indictmentReviewerId } as Case

      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, originalCase, caseToUpdate)
    }

    describe('on a fine', () => {
      beforeEach(() => givenAssignment(CaseIndictmentRulingDecision.FINE))

      it('should queue the PUBLIC_PROSECUTOR_REVIEWER_ASSIGNED notification and nothing else', () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.NOTIFICATION,
            user,
            caseId,
            body: {
              type: IndictmentCaseNotificationType.PUBLIC_PROSECUTOR_REVIEWER_ASSIGNED,
            },
          },
        ])
      })
    })

    describe('on a ruling', () => {
      beforeEach(() => givenAssignment(CaseIndictmentRulingDecision.RULING))

      it('should queue nothing', () => {
        expect(mockQueuedMessages).toEqual([])
      })
    })
  })

  describe('indictment arraignment completed', () => {
    const servedSubpoenaId1 = uuid()
    const servedSubpoenaId2 = uuid()
    const defendants = [
      {
        id: defendantId1,
        subpoenas: [
          { id: servedSubpoenaId1, serviceStatus: ServiceStatus.IN_PERSON },
          { id: uuid(), serviceStatus: ServiceStatus.FAILED },
        ],
      },
      {
        id: defendantId2,
        subpoenas: [
          { id: servedSubpoenaId2, serviceStatus: ServiceStatus.DEFENDER },
          { id: uuid() },
        ],
      },
    ]
    const caseToUpdate = {
      indictmentDecision: IndictmentDecision.POSTPONING,
    } as UpdateCaseDto

    const givenCompletion = async (origin: CaseOrigin) => {
      const originalCase = {
        ...theCase,
        type: CaseType.INDICTMENT,
        state: CaseState.RECEIVED,
        origin,
        defendants,
      } as Case
      const updatedCase = { ...originalCase, ...caseToUpdate } as Case

      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, originalCase, caseToUpdate)
    }

    describe('for a LÖKE case', () => {
      beforeEach(() => givenCompletion(CaseOrigin.LOKE))

      it('should deliver a service certificate to the court and the police for each served subpoena', () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE,
            user,
            caseId,
            elementId: [defendantId1, servedSubpoenaId1],
          },
          {
            type: MessageType.DELIVERY_TO_POLICE_SERVICE_CERTIFICATE,
            user,
            caseId,
            elementId: [defendantId1, servedSubpoenaId1],
          },
          {
            type: MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE,
            user,
            caseId,
            elementId: [defendantId2, servedSubpoenaId2],
          },
          {
            type: MessageType.DELIVERY_TO_POLICE_SERVICE_CERTIFICATE,
            user,
            caseId,
            elementId: [defendantId2, servedSubpoenaId2],
          },
        ])
      })
    })

    describe('for a case not from LÖKE', () => {
      beforeEach(() => givenCompletion(CaseOrigin.RVG))

      it('should deliver the service certificates to the court only', () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE,
            user,
            caseId,
            elementId: [defendantId1, servedSubpoenaId1],
          },
          {
            type: MessageType.DELIVERY_TO_COURT_SERVICE_CERTIFICATE,
            user,
            caseId,
            elementId: [defendantId2, servedSubpoenaId2],
          },
        ])
      })
    })
  })
})
