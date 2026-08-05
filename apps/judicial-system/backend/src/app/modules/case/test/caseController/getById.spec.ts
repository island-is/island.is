import { v4 as uuid } from 'uuid'

import {
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case, CaseRepositoryService } from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Get by id', () => {
  let mockCaseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseRepositoryService, caseController } =
      await createTestingCaseModule()
    mockCaseRepositoryService = caseRepositoryService

    givenWhenThen = async (caseId: string, user: User, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.getById(caseId, theCase, user)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case exists', () => {
    const caseId = uuid()
    const user = { id: uuid() } as User
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should return the case', () => {
      expect(then.result).toBe(theCase)
    })
  })

  describe('district court user requests an indictment with defendants', () => {
    const caseId = uuid()
    const user = {
      id: uuid(),
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: { type: InstitutionType.DISTRICT_COURT },
    } as User
    const defendant1 = { id: uuid(), nationalId: '0101010101' }
    const defendant2 = { id: uuid(), nationalId: '0202020202' }
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [defendant1, defendant2],
    } as Case
    const connectedCase1 = {
      id: uuid(),
      defendants: [{ nationalId: '0101010101' }],
    } as Case
    const connectedCase2 = {
      id: uuid(),
      defendants: [{ nationalId: '0202020202' }],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockCaseRepositoryService.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([connectedCase1, connectedCase2])
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should attach the matching connected cases to each defendant', () => {
      expect(then.result).toBe(theCase)
      expect(then.result.defendants?.[0].connectedCases).toEqual([
        connectedCase1,
      ])
      expect(then.result.defendants?.[1].connectedCases).toEqual([
        connectedCase2,
      ])
    })
  })
})
