import { uuid } from 'uuidv4'
import { Op } from 'sequelize'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { CaseFileState, CaseState } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'
import { Defendant } from '../../../defendant'
import { Institution } from '../../../institution'
import { User } from '../../../user'
import { CaseFile } from '../../../file'
import { Case } from '../../models/case.model'
import { LimitedAccessCaseExistsGuard } from '../limitedAccessCaseExists.guard'
import { attributes } from '../../limitedAccessCase.service'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Restricted Case Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      caseModel,
      limitedAccessCaseService,
    } = await createTestingCaseModule()

    mockCaseModel = caseModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new LimitedAccessCaseExistsGuard(limitedAccessCaseService)
      const then = {} as Then

      try {
        then.result = await guard.canActivate(({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown) as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('database lookup', () => {
    const caseId = uuid()

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))

      await givenWhenThen()
    })

    it('should query the database', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        attributes,
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
          { model: Case, as: 'parentCase', attributes },
          { model: Case, as: 'childCase', attributes },
          {
            model: CaseFile,
            as: 'caseFiles',
            required: false,
            where: {
              state: { [Op.not]: CaseFileState.DELETED },
              category: { [Op.not]: null },
            },
          },
        ],
        order: [[{ model: Defendant, as: 'defendants' }, 'created', 'ASC']],
        where: {
          id: caseId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
      })
    })
  })

  describe('case exists', () => {
    const caseId = uuid()
    const theCase = { id: caseId }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('case does not exist', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))

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
      mockRequest.mockImplementationOnce(() => ({ params: {} }))

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case id')
    })
  })
})
