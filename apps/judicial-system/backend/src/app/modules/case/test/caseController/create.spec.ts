import { Op } from 'sequelize'
import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  User as TUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { DefendantService } from '../../../defendant'
import { include } from '../../case.service'
import { CreateCaseDto } from '../../dto/createCase.dto'
import { Case } from '../../models/case.model'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (type: CaseType) => Promise<Then>

describe('CaseController - Create', () => {
  const userId = uuid()
  const prosecutorsOfficeId = uuid()
  const courtId = uuid()
  const user = {
    id: userId,
    role: UserRole.PROSECUTOR,
    institution: { id: prosecutorsOfficeId, defaultCourtId: courtId },
  } as TUser
  const createProperties = {
    property1: uuid(),
    property2: uuid(),
    property3: uuid(),
  }

  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { defendantService, sequelize, caseModel, caseController } =
      await createTestingCaseModule()

    mockDefendantService = defendantService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )
    const mockCreate = mockCaseModel.create as jest.Mock
    mockCreate.mockRejectedValue(new Error('Some error'))
    const mockFindOne = mockCaseModel.findOne as jest.Mock
    mockFindOne.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (type: CaseType) => {
      const then = {} as Then

      try {
        then.result = await caseController.create(user, {
          ...createProperties,
          type,
          prosecutorId: userId,
        } as unknown as CreateCaseDto)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case created', () => {
    const caseId = uuid()
    const createdCase = { id: caseId }
    const returnedCase = { id: uuid() }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(CaseType.CUSTODY)
    })

    it('should create a case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          ...createProperties,
          type: CaseType.CUSTODY,
          origin: CaseOrigin.RVG,
          state: CaseState.NEW,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          courtId,
          prosecutorsOfficeId,
        },
        { transaction },
      )
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledWith(
        caseId,
        {},
        transaction,
      )
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include,

        where: {
          id: caseId,
          isArchived: false,
          state: { [Op.not]: CaseState.DELETED },
        },
      })
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('indictment case created', () => {
    beforeEach(async () => {
      await givenWhenThen(CaseType.INDICTMENT)
    })

    it('should create a case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          ...createProperties,
          type: CaseType.INDICTMENT,
          state: CaseState.DRAFT,
          origin: CaseOrigin.RVG,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          prosecutorsOfficeId,
        },
        { transaction },
      )
    })
  })

  describe('case creation fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(CaseType.TELECOMMUNICATIONS)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('defendant creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({})
      const mockDefendantCreate =
        mockDefendantService.createForNewCase as jest.Mock
      mockDefendantCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(
        CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case lookup fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({})

      then = await givenWhenThen(CaseType.TRAVEL_BAN)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
