import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  Gender,
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
import { InternalCreateCaseDto } from '../../dto/internalCreateCase.dto'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseToCreate: InternalCreateCaseDto) => Promise<Then>

describe('InternalCaseController - Create', () => {
  const prosecutorNationalId = '1234567890'
  const accusedNationalId = '1234567890'
  const accusedName = 'John Doe'
  const accusedAddress = 'Some Street'
  const accusedGender = Gender.MALE
  const caseToCreate = {
    type: CaseType.CUSTODY,
    policeCaseNumbers: ['007-2021-777'],
    prosecutorNationalId,
    accusedNationalId,
    accusedName,
    accusedAddress,
    accusedGender,
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

    givenWhenThen = async (caseToCreate: InternalCreateCaseDto) => {
      const then = {} as Then

      try {
        then.result = await internalCaseController.create(caseToCreate)
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

    it('should create a case', () => {
      expect(mockUserService.findByNationalId).toHaveBeenCalledWith(
        prosecutorNationalId,
      )
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        {
          ...caseToCreate,
          origin: CaseOrigin.LOKE,
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
        {
          nationalId: accusedNationalId,
          name: accusedName,
          address: accusedAddress,
          gender: accusedGender,
        },
        transaction,
      )
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

  describe('creating user not from prosecution office', () => {
    const user = {
      id: uuid(),
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: {
        id: uuid(),
        type: InstitutionType.DISTRICT_COURT,
        defaultCourtId: uuid(),
      },
    } as User
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'Creating user not found or is not registered as a prosecution user',
      )
    })
  })

  describe('creating user is a representative', () => {
    const user = {
      id: uuid(),
      role: UserRole.PROSECUTOR_REPRESENTATIVE,
      institution: {
        id: uuid(),
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        defaultCourtId: uuid(),
      },
    } as User
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'Creating user is registered as a representative and can only create indictments',
      )
    })
  })

  describe('prosecutor representative creating indictment case', () => {
    const userId = uuid()
    const prosecutorsOfficeId = uuid()
    const courtId = uuid()
    const user = {
      id: userId,
      role: UserRole.PROSECUTOR_REPRESENTATIVE,
      institution: {
        id: prosecutorsOfficeId,
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        defaultCourtId: courtId,
      },
    } as User

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])

      await givenWhenThen({
        ...caseToCreate,
        type: CaseType.INDICTMENT,
      })
    })

    it('should create a case', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        {
          ...caseToCreate,
          type: CaseType.INDICTMENT,
          origin: CaseOrigin.LOKE,
          state: CaseState.DRAFT,
          creatingProsecutorId: userId,
          prosecutorsOfficeId,
        },
        {
          transaction,
        },
      )
    })
  })

  describe('creating case with heightened security', () => {
    const userId = uuid()
    const prosecutorsOfficeId = uuid()
    const courtId = uuid()
    const user = {
      id: userId,
      role: UserRole.PROSECUTOR,
      institution: {
        id: prosecutorsOfficeId,
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        defaultCourtId: courtId,
      },
    } as User

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])

      await givenWhenThen({ ...caseToCreate, isHeightenedSecurityLevel: true })
    })

    it('should create a case with heightened security', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        {
          ...caseToCreate,
          origin: CaseOrigin.LOKE,
          state: CaseState.NEW,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          courtId,
          isHeightenedSecurityLevel: true,
          prosecutorsOfficeId,
        },
        {
          transaction,
        },
      )
    })
  })

  describe('creating user lookup fails', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = { prosecutorNationalId } as InternalCreateCaseDto
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe(
        'Creating user not found or is not registered as a prosecution user',
      )
    })
  })

  describe('case creation fails', () => {
    const user = {
      id: uuid(),
      role: UserRole.PROSECUTOR,
      institution: {
        id: uuid(),
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        defaultCourtId: uuid(),
      },
    } as User
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Failed to create case')
    })
  })

  describe('defendant creation fails', () => {
    const user = {
      id: uuid(),
      role: UserRole.PROSECUTOR,
      institution: {
        id: uuid(),
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        defaultCourtId: uuid(),
      },
    } as User
    const createdCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Failed to create defendant')
    })
  })

  describe('case lookup fails', () => {
    const user = {
      id: uuid(),
      role: UserRole.PROSECUTOR,
      institution: {
        id: uuid(),
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
        defaultCourtId: uuid(),
      },
    } as User
    const createdCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce([user])
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockDefendantCreate =
        mockDefendantService.createForNewCase as jest.Mock
      mockDefendantCreate.mockResolvedValue({ caseId } as Defendant)

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Failed to find case')
    })
  })
})
