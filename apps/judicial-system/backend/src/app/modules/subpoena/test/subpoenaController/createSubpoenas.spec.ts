import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseOrigin,
  CaseType,
  CourtDocumentType,
  SubpoenaType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import { CourtDocumentService } from '../../../court-session'
import {
  Case,
  CaseRepositoryService,
  CourtSession,
  Defendant,
  Subpoena,
  SubpoenaRepositoryService,
} from '../../../repository'
import { CreateSubpoenasDto } from '../../dto/createSubpoenas.dto'
import { SubpoenaController } from '../../subpoena.controller'

interface Then {
  result: Subpoena[]
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  createSubpoenasDto: CreateSubpoenasDto,
) => Promise<Then>

describe('SubpoenaController - Create subpoenas', () => {
  const caseId = uuid()
  const defendantId1 = uuid()
  const defendantId2 = uuid()
  const defendantId3 = uuid()
  const defendantName1 = 'Defendant One'
  const defendantName2 = 'Defendant Two'
  const defendantName3 = 'Defendant Three'
  const arraignmentDate = new Date()
  const location = 'Court Room 1'
  const subpoenaId1 = uuid()
  const subpoenaId2 = uuid()
  const subpoena1 = {
    id: subpoenaId1,
    created: new Date(),
  } as Subpoena
  const subpoena2 = {
    id: subpoenaId2,
    created: new Date(),
  } as Subpoena

  const defendant1 = {
    id: defendantId1,
    name: defendantName1,
    isAlternativeService: false,
    subpoenaType: SubpoenaType.ARREST,
  } as Defendant
  const defendant2 = {
    id: defendantId2,
    name: defendantName2,
    isAlternativeService: false,
    subpoenaType: SubpoenaType.ABSENCE,
  } as Defendant
  const defendant3 = {
    id: defendantId3,
    name: defendantName3,
    isAlternativeService: true, // Should be filtered out
    subpoenaType: SubpoenaType.ARREST,
  } as Defendant

  let mockCaseRepositoryService: CaseRepositoryService
  let mockSubpoenaRepositoryService: SubpoenaRepositoryService
  let mockCourtDocumentService: CourtDocumentService
  let mockMessageService: MessageService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen
  let subpoenaController: SubpoenaController

  beforeEach(async () => {
    const {
      sequelize,
      caseRepositoryService,
      subpoenaRepositoryService,
      courtDocumentService,
      subpoenaController: controller,
      messageService,
    } = await createTestingSubpoenaModule()

    mockCaseRepositoryService = caseRepositoryService
    mockSubpoenaRepositoryService = subpoenaRepositoryService
    mockCourtDocumentService = courtDocumentService
    subpoenaController = controller
    mockMessageService = messageService
    jest.spyOn(mockMessageService, 'sendMessagesToQueue').mockResolvedValue()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => Promise<unknown>) => fn(transaction),
    )

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      createSubpoenasDto: CreateSubpoenasDto,
    ) => {
      const then = {} as Then

      // Reset message service mock before each test
      jest.clearAllMocks()

      try {
        then.result = await subpoenaController.createSubpoenas(
          caseId,
          theCase,
          createSubpoenasDto,
          { id: uuid() } as User,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('subpoenas created successfully', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      origin: CaseOrigin.RVG,
      defendants: [defendant1, defendant2],
      withCourtSessions: false,
    } as Case

    beforeEach(() => {
      const mockCreate = mockSubpoenaRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(subpoena1)
      mockCreate.mockResolvedValueOnce(subpoena2)
    })

    it('should create subpoenas for all eligible defendants', async () => {
      const createSubpoenasDto: CreateSubpoenasDto = {
        defendantIds: [defendantId1, defendantId2],
        arraignmentDate,
        location,
      }

      const then = await givenWhenThen(caseId, theCase, createSubpoenasDto)

      // The case is passed directly from the controller, so no need to fetch it again
      expect(mockCaseRepositoryService.findOne).not.toHaveBeenCalled()

      expect(mockSubpoenaRepositoryService.create).toHaveBeenCalledTimes(2)
      expect(mockSubpoenaRepositoryService.create).toHaveBeenNthCalledWith(
        1,
        {
          defendantId: defendantId1,
          caseId,
          arraignmentDate,
          location,
          type: SubpoenaType.ARREST,
        },
        { transaction },
      )
      expect(mockSubpoenaRepositoryService.create).toHaveBeenNthCalledWith(
        2,
        {
          defendantId: defendantId2,
          caseId,
          arraignmentDate,
          location,
          type: SubpoenaType.ABSENCE,
        },
        { transaction },
      )

      // Verify messages are queued for court and national commissioners office (not police for RVG)
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledTimes(1)
      const messagesCall = (mockMessageService.sendMessagesToQueue as jest.Mock)
        .mock.calls[0][0]
      expect(messagesCall).toHaveLength(4) // 2 defendants × 2 message types (court + national commissioners)
      expect(messagesCall).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
            caseId: theCase.id,
            elementId: [defendantId1, subpoenaId1],
          }),
          expect.objectContaining({
            type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
            caseId: theCase.id,
            elementId: [defendantId1, subpoenaId1],
          }),
          expect.objectContaining({
            type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
            caseId: theCase.id,
            elementId: [defendantId2, subpoenaId2],
          }),
          expect.objectContaining({
            type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
            caseId: theCase.id,
            elementId: [defendantId2, subpoenaId2],
          }),
        ]),
      )

      expect(then.result).toEqual([subpoena1, subpoena2])
      expect(then.error).toBeUndefined()
    })

    it('should also queue police messages for LOKE origin cases', async () => {
      const lokeCase = {
        ...theCase,
        origin: CaseOrigin.LOKE,
      } as Case

      const createSubpoenasDto: CreateSubpoenasDto = {
        defendantIds: [defendantId1, defendantId2],
        arraignmentDate,
        location,
      }

      const then = await givenWhenThen(caseId, lokeCase, createSubpoenasDto)

      // Verify messages are queued for police, court, and national commissioners office
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledTimes(1)
      const messagesCall = (mockMessageService.sendMessagesToQueue as jest.Mock)
        .mock.calls[0][0]
      expect(messagesCall).toHaveLength(6) // 2 defendants × 3 message types (police + court + national commissioners)
      expect(messagesCall).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE,
            caseId: lokeCase.id,
            elementId: [defendantId1, subpoenaId1],
          }),
          expect.objectContaining({
            type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
            caseId: lokeCase.id,
            elementId: [defendantId1, subpoenaId1],
          }),
          expect.objectContaining({
            type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
            caseId: lokeCase.id,
            elementId: [defendantId1, subpoenaId1],
          }),
        ]),
      )

      expect(then.result).toEqual([subpoena1, subpoena2])
      expect(then.error).toBeUndefined()
    })
  })

  describe('subpoenas created with court documents', () => {
    const courtSession = { id: uuid() } as CourtSession
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      origin: CaseOrigin.RVG,
      defendants: [defendant1, defendant2],
      withCourtSessions: true,
      courtSessions: [courtSession],
    } as Case

    beforeEach(() => {
      const mockCreate = mockSubpoenaRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(subpoena1)
      mockCreate.mockResolvedValueOnce(subpoena2)

      const mockCreateDocument = mockCourtDocumentService.create as jest.Mock
      mockCreateDocument.mockResolvedValue({})
    })

    it('should create court documents when court sessions exist', async () => {
      const createSubpoenasDto: CreateSubpoenasDto = {
        defendantIds: [defendantId1, defendantId2],
        arraignmentDate,
        location,
      }

      const then = await givenWhenThen(caseId, theCase, createSubpoenasDto)

      expect(mockCourtDocumentService.create).toHaveBeenCalledTimes(2)
      // Check that court documents are created (exact name format depends on formatDate)
      expect(mockCourtDocumentService.create).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          documentType: CourtDocumentType.GENERATED_DOCUMENT,
          name: expect.stringContaining(`Fyrirkall ${defendantName1}`),
          generatedPdfUri: expect.stringContaining(
            `/api/case/${caseId}/subpoena/${defendantId1}/${subpoenaId1}`,
          ),
        }),
        transaction,
      )

      expect(then.result).toEqual([subpoena1, subpoena2])
    })
  })

  describe('alternative service defendants filtered out', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      origin: CaseOrigin.RVG,
      defendants: [defendant1, defendant2, defendant3], // defendant3 has alternative service
    } as Case

    beforeEach(() => {
      const mockCreate = mockSubpoenaRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(subpoena1)
      mockCreate.mockResolvedValueOnce(subpoena2)
    })

    it('should only create subpoenas for non-alternative-service defendants', async () => {
      const createSubpoenasDto: CreateSubpoenasDto = {
        defendantIds: [defendantId1, defendantId2, defendantId3],
        arraignmentDate,
        location,
      }

      const then = await givenWhenThen(caseId, theCase, createSubpoenasDto)

      // Should only create subpoenas for defendant1 and defendant2
      expect(mockSubpoenaRepositoryService.create).toHaveBeenCalledTimes(2)
      // Verify defendant3 (alternative service) was not included
      expect(mockSubpoenaRepositoryService.create).not.toHaveBeenCalledWith(
        expect.objectContaining({
          defendantId: defendantId3,
        }),
        expect.anything(),
      )

      // Verify messages are still queued for the eligible defendants
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledTimes(1)

      expect(then.result).toEqual([subpoena1, subpoena2])
    })
  })

  describe('all defendants have alternative service', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        { ...defendant1, isAlternativeService: true },
        { ...defendant2, isAlternativeService: true },
      ],
    } as Case

    it('should return empty array when all defendants have alternative service', async () => {
      const createSubpoenasDto: CreateSubpoenasDto = {
        defendantIds: [defendantId1, defendantId2],
        arraignmentDate,
        location,
      }

      const then = await givenWhenThen(caseId, theCase, createSubpoenasDto)

      expect(mockSubpoenaRepositoryService.create).not.toHaveBeenCalled()

      // Should not queue any messages since no subpoenas were created
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()

      expect(then.result).toEqual([])
      expect(then.error).toBeUndefined()
    })
  })

  describe('error cases', () => {
    describe('case is not an indictment case', () => {
      const theCase = {
        id: caseId,
        type: CaseType.CUSTODY,
        defendants: [defendant1],
      } as Case

      it('should throw NotFoundException', async () => {
        const createSubpoenasDto: CreateSubpoenasDto = {
          defendantIds: [defendantId1],
          arraignmentDate,
        }

        const then = await givenWhenThen(caseId, theCase, createSubpoenasDto)

        expect(then.error).toBeInstanceOf(BadRequestException)
        expect(then.error.message).toContain(
          'Subpoenas can only be created for indictment cases',
        )
      })
    })

    describe('no defendants found', () => {
      const theCase: Case = {
        id: caseId,
        type: CaseType.INDICTMENT,
        defendants: [],
      } as unknown as Case

      it('should throw NotFoundException', async () => {
        const createSubpoenasDto: CreateSubpoenasDto = {
          defendantIds: [defendantId1],
          arraignmentDate,
        }

        const then = await givenWhenThen(caseId, theCase, createSubpoenasDto)

        expect(then.error).toBeInstanceOf(NotFoundException)
        expect(then.error.message).toContain('No defendants found for case')
      })
    })
  })
})
