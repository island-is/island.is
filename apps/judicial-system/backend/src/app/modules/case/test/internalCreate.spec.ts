import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { Gender, CaseType, UserRole } from '@island.is/judicial-system/types'

import { User, UserService } from '../../user'
import { InternalCreateCaseDto } from '../dto'
import { Case } from '../models'
import { createTestingCaseModule } from './createTestingCaseModule'
import { Institution } from '../../institution'

jest.mock('../../user/user.service')

interface Then {
  result: Case | null
  error: Error
}

type GivenWhenThen = (caseToCreate: InternalCreateCaseDto) => Promise<Then>

describe('CaseController - Internal create', () => {
  let mockUserService: UserService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      userService,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockUserService = userService
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
    } as InternalCreateCaseDto
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
        where: { id: caseId },
        include: [
          {
            model: Institution,
            as: 'court',
          },
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
      })
    })
  })

  describe('case returned', () => {
    const caseToCreate = {} as InternalCreateCaseDto
    const caseId = uuid()
    const createdCase = { id: caseId } as Case
    const returnedCase = { id: caseId } as Case
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

  describe('case lookup fails', () => {
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
})
