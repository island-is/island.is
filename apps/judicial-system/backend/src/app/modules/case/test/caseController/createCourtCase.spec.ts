import { uuid } from 'uuidv4'
import { Op } from 'sequelize'

import {
  CaseFileState,
  CaseState,
  CaseType,
  IndictmentSubType,
  isIndictmentCase,
  User as TUser,
} from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { randomEnum } from '../../../../test'
import { createTestingCaseModule } from '../createTestingCaseModule'
import { CourtService } from '../../../court'
import { Defendant } from '../../../defendant'
import { User } from '../../../user'
import { Institution } from '../../../institution'
import { CaseFile } from '../../../file'
import { Case } from '../../models/case.model'

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
    const indictmentSubType = isIndictmentCase(type)
      ? randomEnum(IndictmentSubType)
      : undefined
    const policeCaseNumbers = [uuid()]
    const courtId = uuid()
    const theCase = { id: caseId, type, policeCaseNumbers, courtId } as Case

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
        indictmentSubType,
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
        include: [
          { model: Defendant, as: 'defendants' },
          { model: Institution, as: 'court' },
          {
            model: User,
            as: 'creatingProsecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'prosecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Institution, as: 'sharedWithProsecutorsOffice' },
          {
            model: User,
            as: 'judge',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'registrar',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'courtRecordSignatory',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Case, as: 'parentCase' },
          { model: Case, as: 'childCase' },
          {
            model: CaseFile,
            as: 'caseFiles',
            required: false,
            where: {
              state: { [Op.not]: CaseFileState.DELETED },
            },
          },
        ],
        order: [[{ model: Defendant, as: 'defendants' }, 'created', 'ASC']],
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
        type: MessageType.CASE_CONNECTED_TO_COURT_CASE,
        caseId,
      })
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
