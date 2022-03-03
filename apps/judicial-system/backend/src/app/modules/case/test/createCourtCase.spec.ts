import { uuid } from 'uuidv4'

import { CaseType } from '@island.is/judicial-system/types'

import { randomEnum } from '../../../test'
import { CourtService } from '../../court'
import { Defendant } from '../../defendant'
import { Institution } from '../../institution'
import { User } from '../../user'
import { Case } from '../models/case.model'

import { createTestingCaseModule } from './createTestingCaseModule'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('xCaseController - Create court case', () => {
  let mockCourtService: CourtService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      courtService,
      caseModel,
      caseController,
    } = await createTestingCaseModule()
    mockCourtService = courtService
    mockCaseModel = caseModel

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.createCourtCase(caseId, theCase)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court case created', () => {
    const caseId = uuid()
    const type = randomEnum(CaseType)
    const policeCaseNumber = uuid()
    const courtId = uuid()
    const theCase = { id: caseId, type, policeCaseNumber, courtId } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase)
    })

    it('should create a court case', () => {
      expect(mockCourtService.createCourtCase).toHaveBeenCalledWith(
        courtId,
        type,
        policeCaseNumber,
        false,
      )
    })
  })

  describe('court case number updated', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const courtCaseNumber = uuid()

    beforeEach(async () => {
      const mockCreateCourtCase = mockCourtService.createCourtCase as jest.Mock
      mockCreateCourtCase.mockResolvedValueOnce(courtCaseNumber)

      await givenWhenThen(caseId, theCase)
    })

    it('should update the court case number', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { courtCaseNumber },
        { where: { id: caseId } },
      )
    })
  })

  describe('case lookup', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(caseId, theCase)
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
        ],
        order: [[{ model: Defendant, as: 'defendants' }, 'created', 'ASC']],
        where: { id: caseId },
      })
    })
  })

  describe('case returned', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const returnedCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return the case', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('court case number update fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase)
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
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
