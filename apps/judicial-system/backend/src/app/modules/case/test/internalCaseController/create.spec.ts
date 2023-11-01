import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import {
  CaseOrigin,
  CaseType,
  Gender,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { DefendantService } from '../../../defendant/defendant.service'
import { Defendant } from '../../../defendant/models/defendant.model'
import { Institution } from '../../../institution'
import { User, UserService } from '../../../user'
import { InternalCreateCaseDto } from '../../dto/internalCreateCase.dto'
import { Case } from '../../models/case.model'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseToCreate: InternalCreateCaseDto) => Promise<Then>

describe('InternalCaseController - Create', () => {
  const caseId = uuid()
  let mockUserService: UserService
  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      userService,
      defendantService,
      sequelize,
      caseModel,
      internalCaseController,
    } = await createTestingCaseModule()

    mockUserService = userService
    mockDefendantService = defendantService
    mockCaseModel = caseModel

    const mockDefendantCreate =
      mockDefendantService.createForNewCase as jest.Mock
    mockDefendantCreate.mockResolvedValue({ caseId } as Defendant)

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

  describe('no prosecutor', () => {
    const caseToCreate = {} as InternalCreateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseToCreate)
    })

    it('should not perform a prosecutor lookup', () => {
      expect(mockUserService.findByNationalId).not.toHaveBeenCalled()
    })
  })

  describe('prosecutor assigned', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = { prosecutorNationalId } as InternalCreateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseToCreate)
    })

    it('should perform a prosecutor lookup', () => {
      expect(mockUserService.findByNationalId).toHaveBeenCalledWith(
        prosecutorNationalId,
      )
    })
  })

  describe('case created without a prosecutor', () => {
    const caseToCreate = {
      type: CaseType.AUTOPSY,
      policeCaseNumbers: ['007-2021-777'],
      accusedNationalId: '1234567890',
      accusedName: 'John Doe',
      accusedAddress: 'Some Street',
      accusedGender: Gender.MALE,
      leadInvestigator: 'The Boss',
    }

    beforeEach(async () => {
      await givenWhenThen(caseToCreate)
    })

    it('should create a case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        { ...caseToCreate, origin: CaseOrigin.LOKE },
        {
          transaction,
        },
      )
    })
  })

  describe('case created with a prosecutor', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = {
      type: CaseType.AUTOPSY,
      policeCaseNumbers: ['007-2021-777'],
      prosecutorNationalId,
      accusedNationalId: '1234567890',
      accusedName: 'John Doe',
      accusedAddress: 'Some Street',
      accusedGender: Gender.MALE,
      leadInvestigator: 'The Boss',
    }
    const userId = uuid()
    const courtId = uuid()
    const user = {
      id: userId,
      role: UserRole.PROSECUTOR,
      institution: { defaultCourtId: courtId },
    } as User

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(user)

      await givenWhenThen(caseToCreate)
    })

    it('should create a case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          ...caseToCreate,
          origin: CaseOrigin.LOKE,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          courtId,
          heightenedSecurityLevel: true,
        },
        {
          transaction,
        },
      )
    })
  })

  describe('case created with heigthened security', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = {
      type: CaseType.TRAVEL_BAN,
      policeCaseNumbers: ['007-2021-777'],
      prosecutorNationalId,
      accusedNationalId: '1234567890',
      accusedName: 'John Doe',
      accusedAddress: 'Some Street',
      accusedGender: Gender.MALE,
      leadInvestigator: 'The Boss',
    }
    const userId = uuid()
    const courtId = uuid()
    const user = {
      id: userId,
      role: UserRole.PROSECUTOR,
      institution: { defaultCourtId: courtId },
    } as User

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(user)

      await givenWhenThen(caseToCreate)
    })

    it('should create a case with heightened security', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          ...caseToCreate,
          origin: CaseOrigin.LOKE,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          courtId,
        },
        {
          transaction,
        },
      )
    })
  })

  describe('defendant created', () => {
    const accusedNationalId = '1234567890'
    const accusedName = 'John Doe'
    const accusedAddress = 'Some Street'
    const accusedGender = Gender.MALE
    const caseToCreate = {
      accusedNationalId,
      accusedName,
      accusedAddress,
      accusedGender,
    } as InternalCreateCaseDto
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(caseToCreate)
    })

    it('should create a defendant', () => {
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
    })
  })

  describe('case lookup', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(caseToCreate)
    })

    it('should lookup the newly created case', () => {
      expect(mockCaseModel.findByPk).toHaveBeenCalledWith(caseId, {
        include: [
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
        ],
        transaction,
      })
    })
  })

  describe('case returned', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    const createdCase = { id: caseId } as Case
    const returnedCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindByPk = mockCaseModel.findByPk as jest.Mock
      mockFindByPk.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseToCreate)
    })

    it('should return case', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('prosecutor lookup fails', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = { prosecutorNationalId } as InternalCreateCaseDto
    const createdCase = { id: caseId } as Case
    const returnedCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockRejectedValueOnce(new Error('Some error'))
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindByPk = mockCaseModel.findByPk as jest.Mock
      mockFindByPk.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseToCreate)
    })

    it('should return a case without a prosecutor', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('assigned prosecutor not registered as a prosecutor', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = { prosecutorNationalId } as InternalCreateCaseDto
    const createdCase = { id: caseId } as Case
    const returnedCase = { id: caseId } as Case
    const userId = uuid()
    const user = { id: userId } as User
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(user)
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindByPk = mockCaseModel.findByPk as jest.Mock
      mockFindByPk.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseToCreate)
    })

    it('should return a case without a prosecutor', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('case creation fails', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('defendant creation fails', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    const createdCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockDefendantCreate =
        mockDefendantService.createForNewCase as jest.Mock
      mockDefendantCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case lookup fails', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    const createdCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindByPk = mockCaseModel.findByPk as jest.Mock
      mockFindByPk.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
