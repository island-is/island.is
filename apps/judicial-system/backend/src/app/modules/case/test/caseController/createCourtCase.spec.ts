import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseState,
  CaseType,
  EventType,
  IndictmentSubtype,
  investigationCases,
  restrictionCases,
  User as TUser,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate, randomEnum } from '../../../../test'
import { CourtService } from '../../../court'
import { include } from '../../case.service'
import { Case } from '../../models/case.model'

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

  let mockMessageService: MessageService
  let mockCourtService: CourtService
  let transaction: Transaction
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      courtService,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCourtService = courtService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockCreateCourtCase = mockCourtService.createCourtCase as jest.Mock
    mockCreateCourtCase.mockResolvedValue(courtCaseNumber)
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])

    givenWhenThen = async (caseId: string, user: TUser, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.createCourtCase(
          caseId,
          user,
          theCase,
        )
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
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

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
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { courtCaseNumber },
        { where: { id: caseId }, transaction },
      )
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include,
        where: {
          id: caseId,
          isArchived: false,
        },
      })
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
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

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
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { courtCaseNumber },
        { where: { id: caseId }, transaction },
      )
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include,
        where: {
          id: caseId,
          isArchived: false,
        },
      })
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

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should update the court case number', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { state: CaseState.RECEIVED, courtCaseNumber },
        { where: { id: caseId }, transaction },
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
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      await givenWhenThen(caseId, user, theCase)
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
    } as Case

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      await givenWhenThen(caseId, user, theCase)
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
  })

  describe('court case number update fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
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
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
