import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import {
  CaseRepositoryService,
  DateLog,
  Defendant,
  Institution,
  Subpoena,
  User,
  Verdict,
} from '../../../repository'
import { IndictmentCaseExistsForDefendantGuard } from '../indictmentCaseExistsForDefendant.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Indictment Case Exists For Defendant Guard', () => {
  const mockRequest = jest.fn()
  let mockCaseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseRepositoryService, internalCaseService } =
      await createTestingCaseModule()

    mockCaseRepositoryService = caseRepositoryService

    givenWhenThen = async (): Promise<Then> => {
      const guard = new IndictmentCaseExistsForDefendantGuard(
        internalCaseService,
      )
      const then = {} as Then

      try {
        then.result = await guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case exists', () => {
    const caseId = uuid()
    const defendantNationalId = uuid()
    const theCase = { id: caseId }
    const request = { params: { caseId, defendantNationalId }, case: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(mockCaseRepositoryService.findOne).toHaveBeenCalledWith({
        include: [
          {
            model: Defendant,
            as: 'defendants',
            include: [
              {
                model: Subpoena,
                as: 'subpoenas',
                order: [['created', 'DESC']],
              },
              {
                model: Verdict,
                as: 'verdict',
                required: false,
              },
            ],
          },
          { model: Institution, as: 'court' },
          { model: Institution, as: 'prosecutorsOffice' },
          { model: User, as: 'judge' },
          {
            model: User,
            as: 'prosecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: DateLog, as: 'dateLogs' },
        ],
        attributes: [
          'courtCaseNumber',
          'id',
          'state',
          'indictmentRulingDecision',
          'rulingDate',
        ],
        where: {
          type: CaseType.INDICTMENT,
          id: caseId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
          '$defendants.national_id$':
            normalizeAndFormatNationalId(defendantNationalId),
        },
      })
      expect(then.result).toBe(true)
      expect(request.case).toBe(theCase)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    const defendantNationalId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({
        params: { caseId, defendantNationalId },
      })

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`Case ${caseId} does not exist`)
    })
  })

  describe('missing case id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: {} })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case id')
    })
  })

  describe('missing defendant national id', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({ params: { caseId } })

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing defendant national id')
    })
  })
})
