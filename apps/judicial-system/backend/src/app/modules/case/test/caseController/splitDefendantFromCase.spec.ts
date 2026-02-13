import { Op, Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  Gender,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomEnum } from '../../../../test'
import { Case, CaseRepositoryService, Defendant } from '../../../repository'
import { include } from '../../case.service'

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
  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, caseRepositoryService, caseController } =
      await createTestingCaseModule()
    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    } as unknown as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

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
      defendants: [defendantToSplit, { id: uuid() } as Defendant],
    } as Case
    const splitCaseId = uuid()
    const splitCase = {
      ...theCase,
      id: splitCaseId,
      defendants: undefined,
    } as Case
    const fullSplitCase = {
      ...splitCase,
      defendants: [defendantToSplit],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockSplit = mockCaseRepositoryService.split as jest.Mock
      mockSplit.mockResolvedValueOnce(splitCase)
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(fullSplitCase)

      then = await givenWhenThen(caseId, defendantId, theCase, defendantToSplit)
    })

    it('should create new case and transfer defendant', () => {
      expect(then.error).toBeUndefined()
      expect(mockCaseRepositoryService.split).toHaveBeenCalledWith(
        caseId,
        defendantId,
        { transaction },
      )
      expect(mockCaseRepositoryService.findOne).toHaveBeenCalledWith({
        include,
        where: {
          id: splitCaseId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
        transaction,
      })
      expect(then.result).toBe(splitCase)
    })
  })
})
