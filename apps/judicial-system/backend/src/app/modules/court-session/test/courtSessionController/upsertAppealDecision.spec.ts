import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  AppealDecision,
  AppealDecisionRepositoryService,
  Case,
  CourtSession,
} from '../../../repository'
import { CourtSessionAppealDecisionDto } from '../../dto/courtSessionAppealDecision.dto'

interface Then {
  result: AppealDecision
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  courtSession: CourtSession,
  update: CourtSessionAppealDecisionDto,
) => Promise<Then>

describe('CourtSessionController - Upsert appeal decision', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const rulingFileId = uuid()
  const defendantId = uuid()
  const civilClaimantId = uuid()

  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId }],
    civilClaimants: [{ id: civilClaimantId }],
  } as Case

  const orderSession = {
    id: courtSessionId,
    caseId,
    rulingType: CourtSessionRulingType.ORDER,
    rulingFileId,
  } as CourtSession

  let transaction: Transaction
  let mockAppealDecisionRepositoryService: AppealDecisionRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      appealDecisionRepositoryService,
      courtSessionController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockAppealDecisionRepositoryService = appealDecisionRepositoryService
    const mockUpsert = mockAppealDecisionRepositoryService.upsert as jest.Mock
    mockUpsert.mockImplementation((party) =>
      Promise.resolve({ id: uuid(), ...party } as AppealDecision),
    )

    givenWhenThen = async (theCase, courtSession, update) => {
      const then = {} as Then

      try {
        then.result = await courtSessionController.upsertAppealDecision(
          caseId,
          courtSession.id,
          update,
          theCase,
          courtSession,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('prosecutor decision', () => {
    beforeEach(async () => {
      await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
        decision: CaseAppealDecision.APPEAL,
        announcement: 'Sækjandi kærir',
      })
    })

    it('should upsert a prosecutor decision keyed on the session ruling file', () => {
      expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
        {
          caseId,
          rulingFileId,
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          defendantId: undefined,
          civilClaimantId: undefined,
        },
        { decision: CaseAppealDecision.APPEAL, announcement: 'Sækjandi kærir' },
        { transaction },
      )
    })
  })

  describe('defendant decision', () => {
    beforeEach(async () => {
      await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.DEFENDANT,
        defendantId,
        decision: CaseAppealDecision.POSTPONE,
      })
    })

    it('should upsert a defendant decision tied to the defendant', () => {
      expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
        {
          caseId,
          rulingFileId,
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId,
          civilClaimantId: undefined,
        },
        { decision: CaseAppealDecision.POSTPONE, announcement: null },
        { transaction },
      )
    })
  })

  describe('civil claimant decision', () => {
    beforeEach(async () => {
      await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
        civilClaimantId,
        decision: CaseAppealDecision.NOT_APPLICABLE,
      })
    })

    it('should upsert a civil claimant decision tied to the civil claimant', () => {
      expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
        {
          caseId,
          rulingFileId,
          partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
          defendantId: undefined,
          civilClaimantId,
        },
        { decision: CaseAppealDecision.NOT_APPLICABLE, announcement: null },
        { transaction },
      )
    })
  })

  describe('announcement entered before a decision', () => {
    beforeEach(async () => {
      await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
        announcement: 'Drög að yfirlýsingu',
      })
    })

    it('should upsert with a null decision', () => {
      expect(mockAppealDecisionRepositoryService.upsert).toHaveBeenCalledWith(
        expect.anything(),
        { decision: null, announcement: 'Drög að yfirlýsingu' },
        { transaction },
      )
    })
  })

  describe('session is not a pronounced ruling order', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          id: courtSessionId,
          rulingType: CourtSessionRulingType.NONE,
        } as CourtSession,
        { partyRole: AppealDecisionPartyRole.PROSECUTOR },
      )
    })

    it('should throw BadRequestException and not upsert', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })
  })

  describe('ORDER session without a ruling file', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          id: courtSessionId,
          rulingType: CourtSessionRulingType.ORDER,
        } as CourtSession,
        { partyRole: AppealDecisionPartyRole.PROSECUTOR },
      )
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
    })
  })

  describe('defendant role without a defendant id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.DEFENDANT,
      })
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })
  })

  describe('prosecutor role with a party id', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
        defendantId,
      })
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
    })
  })

  describe('defendant not on the case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.DEFENDANT,
        defendantId: uuid(),
      })
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(mockAppealDecisionRepositoryService.upsert).not.toHaveBeenCalled()
    })
  })

  describe('civil claimant not on the case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, orderSession, {
        partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
        civilClaimantId: uuid(),
      })
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })
})
