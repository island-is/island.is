import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { Gender, CaseType, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from './createTestingCaseModule'
import { User, UserService } from '../../user'
import { Institution } from '../../institution'
import { DefendantService } from '../../defendant/defendant.service'
import { Defendant } from '../../defendant/models/defendant.model'
import { InternalCreateCaseDto } from '../dto'
import { Case } from '../models'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseToCreate: InternalCreateCaseDto) => Promise<Then>

describe('CaseController - Internal create', () => {
  let mockLogger: Logger
  let mockUserService: UserService
  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      logger,
      userService,
      defendantService,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockLogger = logger
    mockUserService = userService
    mockDefendantService = defendantService
    mockCaseModel = caseModel

    givenWhenThen = async (caseToCreate: InternalCreateCaseDto) => {
      const then = {} as Then

      try {
        then.result = await caseController.internalCreate(caseToCreate)
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
      policeCaseNumber: '007-2021-777',
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
      expect(mockCaseModel.create).toHaveBeenCalledWith(caseToCreate)
    })
  })

  describe('case created with a prosecutor', () => {
    const prosecutorNationalId = '9876543210'
    const caseToCreate = {
      type: CaseType.AUTOPSY,
      policeCaseNumber: '007-2021-777',
      prosecutorNationalId,
      accusedNationalId: '1234567890',
      accusedName: 'John Doe',
      accusedAddress: 'Some Street',
      accusedGender: Gender.MALE,
      leadInvestigator: 'The Boss',
    }
    const userId = uuid()
    const user = { id: userId, role: UserRole.PROSECUTOR } as User

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(user)

      await givenWhenThen(caseToCreate)
    })

    it('should create a case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith({
        ...caseToCreate,
        creatingProsecutorId: userId,
        prosecutorId: userId,
      })
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
    const caseId = uuid()
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(caseToCreate)
    })

    it('should create a defendant', () => {
      expect(mockDefendantService.create).toHaveBeenCalledWith(caseId, {
        nationalId: accusedNationalId,
        name: accusedName,
        address: accusedAddress,
        gender: accusedGender,
      })
    })
  })

  describe('case lookup', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    const caseId = uuid()
    const createdCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)

      await givenWhenThen(caseToCreate)
    })

    it('should lookup the newly created case', () => {
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
    const caseToCreate = {} as InternalCreateCaseDto
    const createdCase = {} as Case
    const returnedCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseToCreate)
    })

    it('should return case', () => {
      expect(then.result).toBe(returnedCase)
    })
  })

  describe('prosecutor not found', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = { prosecutorNationalId } as InternalCreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(null)

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Person with national id ${caseToCreate.prosecutorNationalId} is not registered as a prosecutor`,
      )
    })
  })

  describe('assigned prosecutor not registered as a prosecutor', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = { prosecutorNationalId } as InternalCreateCaseDto
    const user = {} as User
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(user)

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `Person with national id ${caseToCreate.prosecutorNationalId} is not registered as a prosecutor`,
      )
    })
  })

  describe('prosecutor lookup fails', () => {
    const prosecutorNationalId = '1234567890'
    const caseToCreate = { prosecutorNationalId } as InternalCreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockUserService.findByNationalId as jest.Mock
      mockFindByNationalId.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
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
    let then: Then
    const caseId = uuid()
    const createdCase = { id: caseId } as Case
    const error = new Error('Some error')
    const returnedCase = {} as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockDefendantCreate = mockDefendantService.create as jest.Mock
      mockDefendantCreate.mockRejectedValueOnce(error)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(returnedCase)

      then = await givenWhenThen(caseToCreate)
    })

    it('should log and ignore the error', () => {
      expect(then.error).toBeUndefined()
      expect(
        mockLogger.error,
      ).toHaveBeenCalledWith(
        `Failed to create a defendant for case ${caseId}`,
        { error },
      )
    })
  })

  describe('case lookup fails', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    const createdCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(createdCase)
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
