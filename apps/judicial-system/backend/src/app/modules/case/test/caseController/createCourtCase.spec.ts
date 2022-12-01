import { uuid } from 'uuidv4'
import { Op } from 'sequelize'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
  IndictmentSubtype,
  isIndictmentCase,
  User as TUser,
} from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { randomEnum } from '../../../../test'
import { createTestingCaseModule } from '../createTestingCaseModule'
import { CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { defendantsOrder, includes } from '../../case.service'

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
  let mockMessageService: MessageService
  let mockCourtService: CourtService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      courtService,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCourtService = courtService
    mockCaseModel = caseModel

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

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase)
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
  })

  describe('court case number updated', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const courtCaseNumber = uuid()

    beforeEach(async () => {
      const mockCreateCourtCase = mockCourtService.createCourtCase as jest.Mock
      mockCreateCourtCase.mockResolvedValueOnce(courtCaseNumber)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should update the court case number', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { courtCaseNumber },
        { where: { id: caseId } },
      )
    })
  })

  describe('case lookup', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(caseId, user, theCase)
    })

    it('should lookup the updated case', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include: includes,
        order: [defendantsOrder],
        where: {
          id: caseId,
          isArchived: false,
          state: { [Op.not]: CaseState.DELETED },
        },
      })
    })
  })

  describe('case returned', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const returnedCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should return the case', () => {
      expect(then.result).toBe(returnedCase)
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessageToQueue).toHaveBeenCalledWith({
        type: MessageType.DELIVER_REQUEST_TO_COURT,
        caseId,
      })
    })
  })

  describe('indictment case queued', () => {
    const user = {} as TUser
    const caseId = uuid()
    const policeCaseNumber1 = uuid()
    const policeCaseNumber2 = uuid()
    const coverLetterId = uuid()
    const indictmentId = uuid()
    const criminalRecordId = uuid()
    const costBreakdownId = uuid()
    const theCase = {
      id: caseId,
    } as Case
    const returnedCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      policeCaseNumbers: [policeCaseNumber1, policeCaseNumber2],
      caseFiles: [
        { id: coverLetterId, category: CaseFileCategory.COVER_LETTER },
        { id: indictmentId, category: CaseFileCategory.INDICTMENT },
        { id: criminalRecordId, category: CaseFileCategory.CRIMINAL_RECORD },
        { id: costBreakdownId, category: CaseFileCategory.COST_BREAKDOWN },
      ],
    } as Case

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should post to queue', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
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
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
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
