import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  User as TUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { DefendantService } from '../../../defendant'
import { CreateDefendantDto } from '../../../defendant/dto/createDefendant.dto'
import { Case, CaseRepositoryService } from '../../../repository'
import { CreateCaseDto } from '../../dto/createCase.dto'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  type: CaseType,
  defendants?: CreateDefendantDto[],
) => Promise<Then>

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
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantService,
      sequelize,
      caseRepositoryService,
      caseController,
    } = await createTestingCaseModule()

    mockDefendantService = defendantService
    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockCreate = mockCaseRepositoryService.create as jest.Mock
    mockCreate.mockRejectedValue(new Error('Some error'))
    const mockFindLiveById = mockCaseRepositoryService.findLiveById as jest.Mock
    mockFindLiveById.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      type: CaseType,
      defendants?: CreateDefendantDto[],
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.create(user, {
          ...createProperties,
          type,
          prosecutorId: userId,
          ...(defendants ? { defendants } : {}),
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
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(CaseType.CUSTODY)
    })

    it('should create a case', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
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
      expect(mockCaseRepositoryService.findLiveById).toHaveBeenCalledWith(
        caseId,
        { allowDeleted: false, transaction },
      )
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('indictment case created', () => {
    beforeEach(async () => {
      await givenWhenThen(CaseType.INDICTMENT)
    })

    it('should create a case', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        {
          ...createProperties,
          type: CaseType.INDICTMENT,
          state: CaseState.DRAFT,
          origin: CaseOrigin.RVG,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          prosecutorsOfficeId,
          withCourtSessions: true,
        },
        { transaction },
      )
    })
  })

  describe('indictment case created with defendants', () => {
    const caseId = uuid()
    const defendants = [
      { name: 'Defendant 1' },
      { name: 'Defendant 2' },
    ] as CreateDefendantDto[]

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce({ id: caseId })
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({ id: caseId })

      await givenWhenThen(CaseType.INDICTMENT, defendants)
    })

    it('should create the case without the defendants', () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      const [createdCase] = mockCreate.mock.calls[0]

      expect(createdCase).not.toHaveProperty('defendants')
      expect(createdCase).toMatchObject({
        ...createProperties,
        type: CaseType.INDICTMENT,
      })
    })

    it('should create every defendant in order, in the same transaction', () => {
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledTimes(2)
      expect(mockDefendantService.createForNewCase).toHaveBeenNthCalledWith(
        1,
        caseId,
        defendants[0],
        transaction,
      )
      expect(mockDefendantService.createForNewCase).toHaveBeenNthCalledWith(
        2,
        caseId,
        defendants[1],
        transaction,
      )
    })
  })

  describe('case created with an empty defendant list', () => {
    const caseId = uuid()

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce({ id: caseId })
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({ id: caseId })

      await givenWhenThen(CaseType.INDICTMENT, [])
    })

    it('should create a single empty defendant', () => {
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledTimes(1)
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledWith(
        caseId,
        {},
        transaction,
      )
    })
  })

  describe('a later defendant fails to be created', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce({ id: uuid() })
      const mockDefendantCreate =
        mockDefendantService.createForNewCase as jest.Mock
      mockDefendantCreate
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(CaseType.INDICTMENT, [
        { name: 'Defendant 1' },
        { name: 'Defendant 2' },
      ] as CreateDefendantDto[])
    })

    it('should throw Error so the whole creation is rolled back', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
      expect(mockCaseRepositoryService.findLiveById).not.toHaveBeenCalled()
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
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
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
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce({})

      then = await givenWhenThen(CaseType.TRAVEL_BAN)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
