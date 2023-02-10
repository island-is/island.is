import { uuid } from 'uuidv4'
import { Op } from 'sequelize'
import { Transaction } from 'sequelize/types'

import {
  CaseOrigin,
  CaseState,
  indictmentCases,
  investigationCases,
  restrictionCases,
  User as TUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'
import { DefendantService } from '../../../defendant'
import { CreateCaseDto } from '../../dto/createCase.dto'
import { Case } from '../../models/case.model'
import { include, order } from '../../case.service'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (user: TUser, caseToCreate: CreateCaseDto) => Promise<Then>

describe('CaseController - Create', () => {
  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantService,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockDefendantService = defendantService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (user: TUser, caseToCreate: CreateCaseDto) => {
      const then = {} as Then

      try {
        then.result = await caseController.create(user, caseToCreate)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([...restrictionCases, ...investigationCases])(
    '%s case created',
    (type) => {
      const userId = uuid()
      const courtId = uuid()
      const user = {
        id: userId,
        role: UserRole.PROSECUTOR,
        institution: { defaultCourtId: courtId },
      } as TUser
      const caseToCreate = {
        type,
        description: 'Some details',
        policeCaseNumbers: ['007-2021-777'],
        defenderName: 'John John',
        defenderNationalId: '0000000009',
        defenderEmail: 'john@dummy.is',
        defenderPhoneNumber: '1234567',
        sendRequestToDefender: false,
        leadInvestigator: 'The Boss',
      }

      beforeEach(async () => {
        await givenWhenThen(user, caseToCreate)
      })

      it('should create a case', () => {
        expect(mockCaseModel.create).toHaveBeenCalledWith(
          {
            ...caseToCreate,
            origin: CaseOrigin.RVG,
            creatingProsecutorId: userId,
            prosecutorId: userId,
            courtId,
          },
          { transaction },
        )
      })
    },
  )

  describe.each(indictmentCases)('%s case created', (type) => {
    const userId = uuid()
    const courtId = uuid()
    const user = {
      id: userId,
      role: UserRole.PROSECUTOR,
      institution: { defaultCourtId: courtId },
    } as TUser
    const caseToCreate = {
      type,
      description: 'Some details',
      policeCaseNumbers: ['007-2021-777'],
      sendRequestToDefender: false,
      leadInvestigator: 'The Boss',
    }

    beforeEach(async () => {
      await givenWhenThen(user, caseToCreate)
    })

    it('should create a case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          ...caseToCreate,
          state: CaseState.DRAFT,
          origin: CaseOrigin.RVG,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          courtId,
        },
        { transaction },
      )
    })
  })

  describe('defendant created', () => {
    const userId = uuid()
    const user = { id: userId } as TUser
    const caseToCreate = {} as CreateCaseDto
    const caseId = uuid()
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(user, caseToCreate)
    })

    it('should create a defendant', () => {
      expect(mockDefendantService.create).toHaveBeenCalledWith(
        caseId,
        {},
        transaction,
      )
    })
  })

  describe('case lookup', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    const caseId = uuid()
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(user, caseToCreate)
    })

    it('should lookup the newly created case', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include,
        order,
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
    const caseToCreate = {} as CreateCaseDto
    const createdCase = {} as Case
    const returnedCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should return case', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('case creation fails', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('defendant creation fails', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    const createdCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockDefendantCreate = mockDefendantService.create as jest.Mock
      mockDefendantCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case lookup fails', () => {
    const user = {} as TUser
    const caseToCreate = {} as CreateCaseDto
    const createdCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user, caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
