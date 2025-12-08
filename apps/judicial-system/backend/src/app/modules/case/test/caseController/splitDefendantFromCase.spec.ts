import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  Gender,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomEnum } from '../../../../test'
import { DefendantService } from '../../../defendant'
import { Case, CaseRepositoryService, Defendant } from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  defendantId: string,
  theCase: Case,
  defendant: Defendant,
) => Promise<Then>

describe('CaseController - Split defendant from case', () => {
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
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
    mockTransaction.mockResolvedValueOnce(transaction)

    givenWhenThen = async (
      caseId: string,
      defendantId: string,
      theCase: Case,
      defendant: Defendant,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.splitDefendantFromCase(
          caseId,
          defendantId,
          theCase,
          defendant,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant split from case', () => {
    const caseId = uuid()
    const defendantId = uuid()
    const origin = randomEnum(CaseOrigin)
    const type = CaseType.INDICTMENT
    const description = 'Some details'
    const policeCaseNumbers = ['007-2021-777']
    const courtId = uuid()
    const demands = 'Test demands'
    const comments = 'Test comments'
    const creatingProsecutorId = uuid()
    const prosecutorId = uuid()
    const defendantToSplit = {
      id: defendantId,
      caseId,
      nationalId: '0000000000',
      name: 'Thing 1',
      gender: Gender.MALE,
      address: 'House 1',
      citizenship: 'Citizenship 1',
    } as Defendant
    const theCase = {
      id: caseId,
      origin,
      type,
      description,
      policeCaseNumbers,
      courtId,
      demands,
      comments,
      creatingProsecutorId,
      prosecutorId,
    } as Case
    const splitCaseId = uuid()
    const splitCase = { ...theCase, id: splitCaseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(splitCase)

      then = await givenWhenThen(caseId, defendantId, theCase, defendantToSplit)
    })

    it('should create new case and transfer defendant', () => {
      expect(then.error).toBeUndefined()
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        {
          origin,
          type,
          state: CaseState.DRAFT,
          withCourtSessions: true,
          description,
          policeCaseNumbers,
          courtId,
          demands,
          comments,
          creatingProsecutorId,
          prosecutorId,
        },
        { transaction },
      )
      expect(mockDefendantService.transferDefendantToCase).toHaveBeenCalledWith(
        splitCase,
        defendantToSplit,
        transaction,
      )
      expect(then.result).toBe(splitCase)
    })
  })
})
