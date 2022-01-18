import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize/types'

import {
  CaseCustodyRestrictions,
  CaseLegalProvisions,
  CaseType,
  Gender,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from './createTestingCaseModule'
import { DefendantService } from '../../defendant/defendant.service'
import { Defendant } from '../../defendant/models/defendant.model'
import { Case } from '../models'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Extend', () => {
  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      defendantService,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()
    mockDefendantService = defendantService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (caseId: string, user: User, theCase: Case) => {
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
    const user = { id: userId } as User
    const caseId = uuid()
    const type = CaseType.CUSTODY
    const description = 'Some details'
    const policeCaseNumber = '007-2021-777'
    const defenderName = 'John Doe'
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
    const rulingDate = new Date()
    const theCase = {
      id: caseId,
      type,
      description,
      policeCaseNumber,
      defenderName,
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
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase)
    })

    it('should extend case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          type,
          description,
          policeCaseNumber,
          defenderName,
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
        },
        { transaction },
      )
    })
  })

  describe('extended case extended', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const type = CaseType.CUSTODY
    const description = 'Some details'
    const policeCaseNumber = '007-2021-777'
    const defenderName = 'John Doe'
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
    const initialRulingDate = new Date()
    const theCase = {
      id: caseId,
      type,
      description,
      policeCaseNumber,
      defenderName,
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
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, user, theCase)
    })

    it('should extend case', () => {
      expect(mockCaseModel.create).toHaveBeenCalledWith(
        {
          type,
          description,
          policeCaseNumber,
          defenderName,
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
        },
        { transaction },
      )
    })
  })

  describe('copy defendants', () => {
    const user = {} as User
    const caseId = uuid()
    const defendantOne = {
      nationalId: '0000000000',
      name: 'Thing 1',
      gender: Gender.MALE,
      address: 'House 1',
    }
    const defendantTwo = {
      nationalId: '0000001111',
      name: 'Thing 2',
      gender: Gender.FEMALE,
      address: 'House 2',
    }
    const theCase = {
      id: caseId,
      defendants: [defendantOne, defendantTwo],
    } as Case

    beforeEach(async () => {
      const mockCreate = mockCaseModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({ id: caseId })

      await givenWhenThen(caseId, user, theCase)
    })

    it('should copy defendants', () => {
      expect(mockDefendantService.create).toHaveBeenCalledTimes(2)
      expect(mockDefendantService.create).toHaveBeenCalledWith(
        caseId,
        defendantOne,
        transaction,
      )
      expect(mockDefendantService.create).toHaveBeenCalledWith(
        caseId,
        defendantTwo,
        transaction,
      )
    })
  })
})
