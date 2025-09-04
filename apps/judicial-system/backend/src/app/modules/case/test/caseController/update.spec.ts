import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseDecision,
  CaseFileCategory,
  CaseFileState,
  CaseNotificationType,
  CaseOrigin,
  CaseState,
  CaseType,
  DateType,
  EventType,
  indictmentCases,
  InstitutionType,
  investigationCases,
  restrictionCases,
  StringType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { EventLogService } from '../../../event-log/eventLog.service'
import { FileService } from '../../../file'
import {
  Case,
  CaseRepositoryService,
  CaseString,
  DateLog,
} from '../../../repository'
import { UserService } from '../../../user'
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

  let mockMessageService: MessageService
  let mockEventLogService: EventLogService
  let mockUserService: UserService
  let mockFileService: FileService
  let transaction: Transaction
  let mockCaseRepositoryService: CaseRepositoryService
  let mockDateLogModel: typeof DateLog
  let mockCaseStringModel: typeof CaseString
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      eventLogService,
      userService,
      fileService,
      sequelize,
      caseRepositoryService,
      dateLogModel,
      caseStringModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockEventLogService = eventLogService
    mockUserService = userService
    mockFileService = fileService
    mockCaseRepositoryService = caseRepositoryService
    mockDateLogModel = dateLogModel
    mockCaseStringModel = caseStringModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue([1])
    const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
    mockFindOne.mockResolvedValue(theCase)

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
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      then = await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update the case', () => {
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseToUpdate,
        {
          where: { id: caseId },
          transaction,
        },
      )
    })

    it('should return the updated case', () => {
      expect(then.result).toEqual(updatedCase)
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
        {
          courtCaseNumber: caseToUpdate.courtCaseNumber,
          state: CaseState.RECEIVED,
        },
        { where: { id: caseId }, transaction },
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
        {
          caseResentExplanation: 'Endursending',
          courtCaseFacts: `Í greinargerð sóknaraðila er atvikum lýst svo: ${theCase.caseFacts}`,
          courtLegalArguments: `Í greinargerð er krafa sóknaraðila rökstudd þannig: ${theCase.legalArguments}`,
        },
        { where: { id: caseId }, transaction },
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
        expect.objectContaining({
          demands: 'Updated demands',
          prosecutorDemands: 'Updated demands',
          requestedValidToDate: caseToUpdate.requestedValidToDate,
          validToDate: caseToUpdate.requestedValidToDate,
        }),
        { where: { id: caseId }, transaction },
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
        expect.objectContaining({
          demands: 'Updated demands',
          prosecutorDemands: 'Updated demands',
          requestedValidToDate: caseToUpdate.requestedValidToDate,
        }),
        { where: { id: caseId }, transaction },
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
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
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
            type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
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
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
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
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
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
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.CRIMINAL_RECORD,
          },
          {
            id: costBreakdownId,
            key: uuid(),
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.COST_BREAKDOWN,
          },
          {
            id: uncategorisedId,
            key: uuid(),
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.CASE_FILE,
          },
          {
            id: uuid(),
            key: uuid(),
            state: CaseFileState.STORED_IN_COURT,
            category: CaseFileCategory.CASE_FILE,
          },
        ],
        courtCaseNumber,
      }

      beforeEach(async () => {
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, theCase, caseToUpdate)
      })

      it('should post to queue', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
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
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        await givenWhenThen(caseId, user, originalCase, caseToUdate)
      })

      it('should post modified notification to queue', async () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.NOTIFICATION,
            user,
            caseId,
            body: { type: CaseNotificationType.MODIFIED },
          },
          { type: MessageType.DELIVERY_TO_POLICE_CASE, user, caseId },
        ])
      })
    },
  )

  describe.each(restrictionCases)(
    'prosecutor statement date is updated for %s case',
    (type) => {
      const statementId = uuid()
      const fileId = uuid()
      const caseFiles = [
        {
          id: statementId,
          key: uuid(),
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        },
        {
          id: fileId,
          key: uuid(),
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
        },
      ]
      const originalCase = { ...theCase, type, caseFiles } as Case
      const caseToUdate = { prosecutorStatementDate: new Date() }
      const updatedCase = {
        ...theCase,
        type,
        prosecutorStatementDate: date,
        caseFiles,
      }
      let then: Then

      beforeEach(async () => {
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        then = await givenWhenThen(caseId, user, originalCase, caseToUdate)
      })

      it('should update the case', () => {
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
          { prosecutorStatementDate: date },
          { where: { id: caseId }, transaction },
        )
      })

      it('should queue messages', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.NOTIFICATION,
            user,
            caseId,
            body: { type: CaseNotificationType.APPEAL_STATEMENT },
          },
        ])
      })

      it('should return the updated case', () => {
        expect(then.result).toEqual(updatedCase)
      })
    },
  )

  describe('neither court case number nor defender email nor prosecutorId nor caseModifiedExplanation nor prosecutorStatementDate updated', () => {
    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, {})
    })

    it('should not post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('appeal case number updated', () => {
    const appealCaseNumber = uuid()
    const caseToUpdate = { appealCaseNumber }
    const updatedCase = {
      ...theCase,
      type: CaseType.TRAVEL_BAN,
      appealCaseNumber,
    }

    beforeEach(async () => {
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
          user,
          caseId,
        },
      ])
    })
  })

  describe('assigned appeal roles updated', () => {
    const appealCaseNumber = uuid()
    const appealAssistantId = uuid()
    const appealJudge1Id = uuid()
    const appealJudge2Id = uuid()
    const appealJudge3Id = uuid()
    const caseToUpdate = { appealCaseNumber }
    const updatedCase = {
      ...theCase,
      type: CaseType.SEARCH_WARRANT,
      appealCaseNumber,
      appealAssistantId,
      appealJudge1Id,
      appealJudge2Id,
      appealJudge3Id,
    }

    beforeEach(async () => {
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, appealCaseNumber } as Case,
        caseToUpdate,
      )
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
          user,
          caseId,
        },
      ])
    })
  })

  describe('appeal case number updated with assigned appeal roles', () => {
    const appealCaseNumber = uuid()
    const appealAssistantId = uuid()
    const appealJudge1Id = uuid()
    const appealJudge2Id = uuid()
    const appealJudge3Id = uuid()
    const caseToUpdate = { appealCaseNumber }
    const updatedCase = {
      ...theCase,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      appealCaseNumber,
      appealAssistantId,
      appealJudge1Id,
      appealJudge2Id,
      appealJudge3Id,
    }

    beforeEach(async () => {
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        {
          ...theCase,
          appealCaseNumber: uuid(),
          appealAssistantId,
          appealJudge1Id,
          appealJudge2Id,
          appealJudge3Id,
        } as Case,
        caseToUpdate,
      )
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
          user,
          caseId,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
          user,
          caseId,
        },
      ])
    })
  })

  describe('appeal case number updated with appeal files', () => {
    const appealCaseNumber = uuid()
    const caseToUpdate = { appealCaseNumber }
    const caseFile1Id = uuid()
    const caseFile2Id = uuid()
    const caseFile3Id = uuid()
    const caseFile4Id = uuid()
    const caseFile5Id = uuid()
    const caseFile6Id = uuid()
    const caseFiles = [
      caseFile,
      {
        id: caseFile1Id,
        caseId,
        category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        key: uuid(),
      },
      {
        id: caseFile2Id,
        caseId,
        category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
        key: uuid(),
      },
      {
        id: caseFile3Id,
        caseId,
        category: CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
        key: uuid(),
      },
      {
        id: caseFile4Id,
        caseId,
        category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        key: uuid(),
      },
      {
        id: caseFile5Id,
        caseId,
        category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        key: uuid(),
      },
      {
        id: caseFile6Id,
        caseId,
        category: CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        key: uuid(),
      },
    ]
    const updatedCase = {
      ...theCase,
      type: CaseType.RESTRAINING_ORDER,
      appealCaseNumber,
      caseFiles,
    }

    beforeEach(async () => {
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        {
          ...theCase,
          appealCaseNumber: uuid(),
          caseFiles,
        } as Case,
        caseToUpdate,
      )
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId,
          elementId: caseFile1Id,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId,
          elementId: caseFile2Id,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId,
          elementId: caseFile3Id,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId,
          elementId: caseFile4Id,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId,
          elementId: caseFile5Id,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId,
          elementId: caseFile6Id,
        },
        {
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
          user,
          caseId,
        },
      ])
    })
  })

  describe('arraignment date updated', () => {
    const arraignmentDate = { date: new Date(), location: uuid() }
    const caseToUpdate = { arraignmentDate }

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase, caseToUpdate)
    })

    it('should update case', () => {
      expect(mockDateLogModel.create).toHaveBeenCalledWith(
        { dateType: DateType.ARRAIGNMENT_DATE, caseId, ...arraignmentDate },
        { transaction },
      )
    })
  })

  describe('indictment arraignment date updated', () => {
    const arraignmentDate = { date: new Date(), location: uuid() }
    const caseToUpdate = { arraignmentDate }
    const subpoenaId1 = uuid()
    const subpoenaId2 = uuid()
    const updatedCase = {
      ...theCase,
      type: CaseType.INDICTMENT,
      origin: CaseOrigin.LOKE,
      dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, ...arraignmentDate }],
      defendants: [
        { id: defendantId1, subpoenas: [{ id: subpoenaId1 }] },
        { id: defendantId2, subpoenas: [{ id: subpoenaId2 }] },
      ],
    }

    beforeEach(async () => {
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.INDICTMENT } as Case,
        caseToUpdate,
      )
    })

    it('should update case', () => {
      expect(mockDateLogModel.create).toHaveBeenCalledWith(
        { dateType: DateType.ARRAIGNMENT_DATE, caseId, ...arraignmentDate },
        { transaction },
      )
      expect(mockEventLogService.createWithUser).toHaveBeenCalledWith(
        EventType.COURT_DATE_SCHEDULED,
        caseId,
        user,
        transaction,
      )
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE,
          user,
          caseId: theCase.id,
          elementId: [defendantId1, subpoenaId1],
        },
        {
          type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [defendantId1, subpoenaId1],
        },
        {
          type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [defendantId1, subpoenaId1],
        },
        {
          type: MessageType.DELIVERY_TO_POLICE_SUBPOENA_FILE,
          user,
          caseId: theCase.id,
          elementId: [defendantId2, subpoenaId2],
        },
        {
          type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [defendantId2, subpoenaId2],
        },
        {
          type: MessageType.DELIVERY_TO_COURT_SUBPOENA,
          user,
          caseId: theCase.id,
          elementId: [defendantId2, subpoenaId2],
        },
      ])
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
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

      await givenWhenThen(
        caseId,
        user,
        { ...theCase, type: CaseType.INDICTMENT } as Case,
        caseToUpdate,
      )
    })

    it('should update case', () => {
      expect(mockDateLogModel.create).toHaveBeenCalledWith(
        { dateType: DateType.COURT_DATE, caseId, ...courtDate },
        { transaction },
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
      expect(mockCaseStringModel.create).toHaveBeenCalledWith(
        {
          stringType: StringType.POSTPONED_INDEFINITELY_EXPLANATION,
          caseId,
          value: postponedIndefinitelyExplanation,
        },
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
      expect(mockCaseStringModel.create).toHaveBeenCalledWith(
        {
          stringType: StringType.CIVIL_DEMANDS,
          caseId,
          value: civilDemands,
        },
        { transaction },
      )
    })
  })
})
