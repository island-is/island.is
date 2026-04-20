import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseCustodyRestrictions,
  CaseLegalProvisions,
  CaseOrigin,
  CaseState,
  CaseType,
  Gender,
  User as TUser,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate, randomEnum } from '../../../../test'
import { DefendantService } from '../../../defendant'
import { Case, CaseRepositoryService } from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: TUser,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Extend', () => {
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

    givenWhenThen = async (caseId: string, user: TUser, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.extend(caseId, user, theCase)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case extended', () => {
    const userId = uuid()
    const prosecutorsOfficeId = uuid()
    const user = {
      id: userId,
      institution: { id: prosecutorsOfficeId },
    } as TUser
    const caseId = uuid()
    const origin = randomEnum(CaseOrigin)
    const type = CaseType.CUSTODY
    const description = 'Some details'
    const policeCaseNumbers = ['007-2021-777']
    const defenderName = 'John Doe'
    const defenderNationalId = '0000000009'
    const defenderEmail = 'john@dummy.is'
    const defenderPhoneNumber = '1234567'
    const leadInvestigator = 'The Boss'
    const courtId = uuid()
    const translator = 'Bob Smith'
    const lawsBroken = 'Broken laws'
    const legalBasis = 'Legal basis for custody'
    const legalProvisions = [CaseLegalProvisions._100_1]
    const requestedCustodyRestrictions = [CaseCustodyRestrictions.ISOLATION]
    const caseFacts = 'This happened'
    const legalArguments = 'This is why custody is needed'
    const requestProsecutorOnlySession = false
    const prosecutorOnlySessionRequest = 'The prosecutors wants an exclusive'
    const rulingDate = randomDate()
    const defendantOne = {
      nationalId: '0000000000',
      name: 'Thing 1',
      gender: Gender.MALE,
      address: 'House 1',
      citizenship: 'Citizenship 1',
    }
    const defendantTwo = {
      nationalId: '0000001111',
      name: 'Thing 2',
      gender: Gender.FEMALE,
      address: 'House 2',
      citizenship: 'Citizenship 2',
    }
    const theCase = {
      id: caseId,
      origin,
      type,
      description,
      policeCaseNumbers,
      defenderName,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
      leadInvestigator,
      courtId,
      translator,
      lawsBroken,
      legalBasis,
      legalProvisions,
      requestedCustodyRestrictions,
      caseFacts,
      legalArguments,
      requestProsecutorOnlySession,
      prosecutorOnlySessionRequest,
      rulingDate,
      defendants: [defendantOne, defendantTwo],
    } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)

      await givenWhenThen(caseId, user, theCase)
    })

    it('should extend case', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        {
          origin,
          type,
          state: CaseState.NEW,
          description,
          policeCaseNumbers,
          defenderName,
          defenderNationalId,
          defenderEmail,
          defenderPhoneNumber,
          leadInvestigator,
          courtId,
          translator,
          lawsBroken,
          legalBasis,
          legalProvisions,
          requestedCustodyRestrictions,
          caseFacts,
          legalArguments,
          requestProsecutorOnlySession,
          prosecutorOnlySessionRequest,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          parentCaseId: caseId,
          initialRulingDate: rulingDate,
          prosecutorsOfficeId,
        },
        { transaction },
      )
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledTimes(2)
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledWith(
        extendedCaseId,
        defendantOne,
        transaction,
      )
      expect(mockDefendantService.createForNewCase).toHaveBeenCalledWith(
        extendedCaseId,
        defendantTwo,
        transaction,
      )
    })
  })

  describe('case returned', () => {
    const user = {} as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should return case', () => {
      expect(then.result).toBe(extendedCase)
    })
  })

  describe('extended case extended', () => {
    const userId = uuid()
    const prosecutorsOfficeId = uuid()
    const user = {
      id: userId,
      institution: { id: prosecutorsOfficeId },
    } as TUser
    const caseId = uuid()
    const origin = randomEnum(CaseOrigin)
    const type = CaseType.CUSTODY
    const description = 'Some details'
    const policeCaseNumbers = ['007-2021-777']
    const defenderName = 'John Doe'
    const defenderNationalId = '0000000009'
    const defenderEmail = 'john@dummy.is'
    const defenderPhoneNumber = '1234567'
    const leadInvestigator = 'The Boss'
    const courtId = uuid()
    const translator = 'Bob Smith'
    const lawsBroken = 'Broken laws'
    const legalBasis = 'Legal basis for custody'
    const legalProvisions = [CaseLegalProvisions._100_1]
    const requestedCustodyRestrictions = [CaseCustodyRestrictions.ISOLATION]
    const caseFacts = 'This happened'
    const legalArguments = 'This is why custody is needed'
    const requestProsecutorOnlySession = false
    const prosecutorOnlySessionRequest = 'The prosecutors wants an exclusive'
    const initialRulingDate = randomDate()
    const theCase = {
      id: caseId,
      origin,
      type,
      state: CaseState.NEW,
      description,
      policeCaseNumbers,
      defenderName,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
      leadInvestigator,
      courtId,
      translator,
      lawsBroken,
      legalBasis,
      legalProvisions,
      requestedCustodyRestrictions,
      caseFacts,
      legalArguments,
      requestProsecutorOnlySession,
      prosecutorOnlySessionRequest,
      initialRulingDate,
      parentCaseId: uuid(),
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase)
    })

    it('should extend case', () => {
      expect(mockCaseRepositoryService.create).toHaveBeenCalledWith(
        {
          origin,
          type,
          state: CaseState.NEW,
          description,
          policeCaseNumbers,
          defenderName,
          defenderNationalId,
          defenderEmail,
          defenderPhoneNumber,
          leadInvestigator,
          courtId,
          translator,
          lawsBroken,
          legalBasis,
          legalProvisions,
          requestedCustodyRestrictions,
          caseFacts,
          legalArguments,
          requestProsecutorOnlySession,
          prosecutorOnlySessionRequest,
          creatingProsecutorId: userId,
          prosecutorId: userId,
          parentCaseId: caseId,
          initialRulingDate,
          prosecutorsOfficeId,
        },
        { transaction },
      )
    })
  })

  describe('case creation fails', () => {
    const user = { id: uuid() } as TUser
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('defendant creation fails', () => {
    const user = { id: uuid() } as TUser
    const caseId = uuid()
    const theCase = { id: caseId, defendants: [{}] } as Case
    const extendedCaseId = uuid()
    const extendedCase = { id: extendedCaseId }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCaseRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValueOnce(extendedCase)
      const mockDefendantCreate =
        mockDefendantService.createForNewCase as jest.Mock
      mockDefendantCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
