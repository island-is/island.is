import { uuid } from 'uuidv4'
import { Op, Transaction } from 'sequelize'

import {
  CaseFileCategory,
  CaseFileState,
  CaseState,
  CaseType,
  indictmentCases,
  IndictmentSubtype,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
  User as TUser,
} from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { randomEnum } from '../../../../test'
import { createTestingCaseModule } from '../createTestingCaseModule'
import { CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { order, include } from '../../case.service'

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

  describe('court case created', () => {
    const user = { id: uuid() } as TUser
    const caseId = uuid()
    const type = randomEnum(CaseType)
    const policeCaseNumber = uuid()
    const indictmentSubtype = isIndictmentCase(type)
      ? randomEnum(IndictmentSubtype)
      : undefined
    const indictmentSubtypes = isIndictmentCase(type)
      ? { [policeCaseNumber]: [indictmentSubtype] }
      : undefined
    const policeCaseNumbers = [policeCaseNumber]
    const courtId = uuid()
    const theCase = {
      id: caseId,
      type,
      policeCaseNumbers,
      indictmentSubtypes,
      courtId,
    } as Case
    const returnedCase = {
      id: caseId,
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
        policeCaseNumbers,
        false,
        indictmentSubtypes,
      )
    })

    it('should update the court case number', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { courtCaseNumber },
        { where: { id: caseId }, transaction },
      )
    })

    it('should lookup the updated case', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include,
        order,
        where: {
          id: caseId,
          isArchived: false,
          state: { [Op.not]: CaseState.Deleted },
        },
      })
    })

    it('should return the case', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('court case received', () => {
    const user = { id: uuid() } as TUser
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

  describe.each([...restrictionCases, ...investigationCases])(
    '%s case queued',
    (type) => {
      const user = {} as TUser
      const defendantId1 = uuid()
      const defendantId2 = uuid()
      const caseId = uuid()
      const theCase = {
        id: caseId,
      } as Case
      const returnedCase = {
        id: caseId,
        type,
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
            type: MessageType.DELIVER_REQUEST_TO_COURT,
            caseId,
          },
          {
            type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
            caseId,
            userId: user.id,
          },
          {
            type: MessageType.DELIVER_DEFENDANT_TO_COURT,
            caseId,
            defendantId: defendantId1,
            userId: user.id,
          },
          {
            type: MessageType.DELIVER_DEFENDANT_TO_COURT,
            caseId,
            defendantId: defendantId2,
            userId: user.id,
          },
        ])
      })
    },
  )

  describe.each(indictmentCases)('%s case queued', (type) => {
    const user = {} as TUser
    const caseId = uuid()
    const policeCaseNumber1 = uuid()
    const policeCaseNumber2 = uuid()
    const coverLetterId = uuid()
    const indictmentId = uuid()
    const criminalRecordId = uuid()
    const costBreakdownId = uuid()
    const uncategorisedId = uuid()
    const theCase = {
      id: caseId,
    } as Case
    const returnedCase = {
      id: caseId,
      type,
      policeCaseNumbers: [policeCaseNumber1, policeCaseNumber2],
      caseFiles: [
        {
          id: coverLetterId,
          key: uuid(),
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.COVER_LETTER,
        },
        {
          id: indictmentId,
          key: uuid(),
          state: CaseFileState.STORED_IN_RVG,
          category: CaseFileCategory.INDICTMENT,
        },
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
          type: MessageType.DELIVER_PROSECUTOR_TO_COURT,
          caseId: theCase.id,
          userId: user.id,
        },
        {
          type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
          caseId,
          policeCaseNumber: policeCaseNumber1,
        },
        {
          type: MessageType.DELIVER_CASE_FILES_RECORD_TO_COURT,
          caseId,
          policeCaseNumber: policeCaseNumber2,
        },
        {
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          caseId,
          caseFileId: coverLetterId,
        },
        {
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          caseId,
          caseFileId: indictmentId,
        },
        {
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          caseId,
          caseFileId: criminalRecordId,
        },
        {
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          caseId,
          caseFileId: costBreakdownId,
        },
        {
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          caseId,
          caseFileId: uncategorisedId,
        },
      ])
    })
  })

  describe('court case number update fails', () => {
    const user = {} as TUser
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
    const user = {} as TUser
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
