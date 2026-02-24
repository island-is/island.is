import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { DefendantService } from '../../../defendant/defendant.service'
import {
  Case,
  CaseRepositoryService,
  Defendant,
  User,
} from '../../../repository'
import { UserService } from '../../../user'
import { InternalCreateCaseV2Dto } from '../../dto/internalCreateCaseV2.dto'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseToCreate: InternalCreateCaseV2Dto) => Promise<Then>

describe('InternalCaseController - CreateV2', () => {
  const prosecutorNationalId = '1234567890'
  const caseToCreate: InternalCreateCaseV2Dto = {
    type: CaseType.CUSTODY,
    policeCaseNumbers: ['007-2021-777'],
    prosecutorNationalId,
    leadInvestigator: 'The Boss',
  }
  const caseId = uuid()
  let mockUserService: UserService
  let mockDefendantService: DefendantService
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      userService,
      defendantService,
      sequelize,
      caseRepositoryService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockUserService = userService
    mockDefendantService = defendantService
    mockCaseRepositoryService = caseRepositoryService

    const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
    mockFindByNationalId.mockRejectedValue(new Error('Failed to find user'))
    const mockCreate = mockCaseRepositoryService.create as jest.Mock
    mockCreate.mockRejectedValue(new Error('Failed to create case'))
    const mockDefendantCreate =
      mockDefendantService.createForNewCase as jest.Mock
    mockDefendantCreate.mockRejectedValue(
      new Error('Failed to create defendant'),
    )
    const mockFindById = mockCaseRepositoryService.findById as jest.Mock
    mockFindById.mockRejectedValue(new Error('Failed to find case'))

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (caseToCreate: InternalCreateCaseV2Dto) => {
      const then = {} as Then

      try {
        then.result = await internalCaseController.createV2(caseToCreate)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('creating case', () => {
    const userId = uuid()
    const prosecutorsOfficeId = uuid()
    const courtId = uuid()
    const user = {
      id: userId,
      role: UserRole.PROSECUTOR,
      institution: {
        id: prosecutorsOfficeId,
        nationalId: '1234567890',
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        defaultCourtId: courtId,
      },
    } as User
    const createdCase = { id: caseId } as Case
    const returnedCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockDefendantCreate =
        mockDefendantService.createForNewCase as jest.Mock
      mockDefendantCreate.mockResolvedValue({ caseId } as Defendant)
      const mockFindByPk = mockCaseRepositoryService.findById as jest.Mock
      mockFindByPk.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseToCreate)
    })

    it('should create a case without policeDefendantNationalId', () => {
      expect(mockUserService.findByNationalId).toHaveBeenCalledWith(
        prosecutorNationalId,
      )
      const createCall = (mockCaseRepositoryService.create as jest.Mock).mock
        .calls[0][0]
      expect(createCall).toMatchObject({
        ...caseToCreate,
        origin: CaseOrigin.LOKE,
        state: CaseState.NEW,
        creatingProsecutorId: userId,
        prosecutorId: userId,
        courtId,
        prosecutorsOfficeId,
      })
      expect(createCall.policeDefendantNationalId).toBeUndefined()
    })

    it('should create one defendant from fetched accused (mock)', () => {
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({
          nationalId: '0000000000',
          name: 'Dummy Accused',
          address: '',
        }),
        transaction,
      )
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledTimes(1)
    })

    it('should return the created case', () => {
      expect(mockCaseRepositoryService.findById).toHaveBeenCalledWith(caseId, {
        transaction,
      })
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('creating user not found', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(undefined)

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'Creating user not found or is not registered as a prosecution user',
      )
    })
  })
})
