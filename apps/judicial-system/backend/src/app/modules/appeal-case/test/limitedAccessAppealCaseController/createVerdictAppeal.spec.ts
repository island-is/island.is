import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { addMessagesToQueue } from '@island.is/judicial-system/message'
import {
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  AppealOrigin,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  ServiceRequirement,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
  VerdictRepositoryService,
} from '../../../repository'
import { CreateAppealCaseDto } from '../../dto/createAppealCase.dto'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (theCase: Case, dto: CreateAppealCaseDto) => Promise<Then>

describe('LimitedAccessAppealCaseController - Create verdict appeal', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const verdictId = uuid()
  const defenderNationalId = '1111111111'

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
    name: 'Lára Lögmann',
    title: 'lögmaður',
  } as User

  const createdAppealCase = {
    id: appealCaseId,
    caseId,
    appealType: AppealCaseType.VERDICT,
    appealDate: new Date('2026-06-04T13:34:00Z'),
  } as AppealCase

  const now = new Date('2026-06-04T13:34:00Z')

  // The appeal deadline is measured against the real clock, so a verdict that
  // is still appealable has to have been served just now rather than on a fixed
  // date. The four weeks run from the service date.
  const serviceDate = new Date()

  const verdict = {
    id: verdictId,
    serviceRequirement: ServiceRequirement.REQUIRED,
    serviceDate,
  }

  const buildCase = (overrides: Partial<Case> = {}) =>
    ({
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate: serviceDate,
      caseFiles: [],
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
          verdicts: [verdict],
        },
      ],
      ...overrides,
    } as unknown as Case)

  const dto: CreateAppealCaseDto = {
    appealType: AppealCaseType.VERDICT,
    defendantId,
  }

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockVerdictRepositoryService: VerdictRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessAppealCaseController,
      appealCaseRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      verdictRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService
    mockVerdictRepositoryService = verdictRepositoryService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )
    ;(mockAppealCaseRepositoryService.create as jest.Mock).mockResolvedValue(
      createdAppealCase,
    )
    ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
      [],
    )
    ;(
      mockCaseRepositoryService.lockByIdForUpdate as jest.Mock
    ).mockResolvedValue(true)

    givenWhenThen = async (theCase, createDto) => {
      const then = {} as Then

      await limitedAccessAppealCaseController
        .create(caseId, defender, theCase, createDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('the first defendant to appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(buildCase(), dto)
    })

    it('should create a verdict appeal case', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          appealType: AppealCaseType.VERDICT,
          appealState: AppealCaseState.APPEALED,
          appealDate: now,
        },
        { transaction },
      )
      expect(then.result).toBe(createdAppealCase)
    })

    // Two defenders filing at once must not each create their own Landsréttur
    // case, so the decision is taken under the case row's write lock.
    it('should look for an existing verdict appeal under the case lock', () => {
      expect(mockCaseRepositoryService.lockByIdForUpdate).toHaveBeenCalledWith(
        caseId,
        transaction,
      )
      expect(mockAppealCaseRepositoryService.findAll).toHaveBeenCalledWith({
        where: { caseId, appealType: AppealCaseType.VERDICT },
        transaction,
      })
    })

    it('should record an APPEALED event for that defendant alone', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.OUT_OF_COURT,
          userRole: UserRole.DEFENDER,
          userId: undefined,
          defendantId,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: undefined,
        },
        { transaction },
      )
    })

    it('should mirror the appeal date onto the verdict', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        { appealDate: now },
        { transaction },
      )
    })

    // The notification to the public prosecution office is its own story, and none of the
    // ruling appeal notifications apply to a verdict appeal.
    it('should queue no messages', () => {
      expect(addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('a later defendant appealing the same case', () => {
    const existingAppealCase = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
      appealDate: new Date('2026-06-02T09:00:00Z'),
    } as AppealCase

    let then: Then

    beforeEach(async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [existingAppealCase],
      )
      // Another defendant is the standing appellant, not this one.
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          defendantId: uuid(),
          eventType: AppealEventType.APPEALED,
          created: new Date('2026-06-02T09:00:00Z'),
        },
      ])

      then = await givenWhenThen(buildCase(), dto)
    })

    // One Landsréttur case per district court case, whoever the appellants are.
    it('should join the existing appeal case instead of creating another', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(then.result).toBe(existingAppealCase)
    })

    it('should still record its own APPEALED event', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          defendantId,
        }),
        { transaction },
      )
    })

    // The mirror is per defendant, so it carries when this defendant appealed
    // rather than when the appeal case was first filed.
    it('should mirror its own appeal date onto the verdict', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        { appealDate: now },
        { transaction },
      )
    })

    it('should leave the appeal case state alone', () => {
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('appealing again after every appellant had withdrawn', () => {
    const withdrawnAppealCase = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
      appealState: AppealCaseState.WITHDRAWN,
      appealDate: new Date('2026-06-02T09:00:00Z'),
    } as AppealCase
    const reactivatedAppealCase = {
      ...withdrawnAppealCase,
      appealState: AppealCaseState.APPEALED,
      appealDate: now,
    } as AppealCase

    let then: Then

    beforeEach(async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [withdrawnAppealCase],
      )
      ;(mockAppealCaseRepositoryService.update as jest.Mock).mockResolvedValue(
        reactivatedAppealCase,
      )
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          defendantId,
          eventType: AppealEventType.APPEALED,
          created: new Date('2026-06-02T09:00:00Z'),
        },
        {
          defendantId,
          eventType: AppealEventType.APPEAL_WITHDRAWN,
          created: new Date('2026-06-03T09:00:00Z'),
        },
      ])

      then = await givenWhenThen(buildCase(), dto)
    })

    // The same Landsréttur case comes back to life; leaving it WITHDRAWN would
    // stand it withdrawn while it carries a standing appellant.
    it('should bring the appeal case back to APPEALED', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { appealState: AppealCaseState.APPEALED, appealDate: now },
        { transaction },
      )
    })

    it('should record the new APPEALED event', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          defendantId,
        }),
        { transaction },
      )
    })

    // Returning the row as it was read would tell the client the appeal it just
    // filed is withdrawn.
    it('should return the reactivated appeal case, not the stale one', () => {
      expect(then.result).toBe(reactivatedAppealCase)
    })
  })

  // The pre-lock check reads the case as it was loaded before the transaction,
  // so the same question has to be asked again once the lock is held.
  describe('a defendant that already appealed, seen only under the lock', () => {
    const existingAppealCase = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
      appealDate: new Date('2026-06-02T09:00:00Z'),
    } as AppealCase

    let then: Then

    beforeEach(async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [existingAppealCase],
      )
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        {
          defendantId,
          eventType: AppealEventType.APPEALED,
          created: new Date('2026-06-02T09:00:00Z'),
        },
      ])

      then = await givenWhenThen(buildCase(), dto)
    })

    it('should reject the second appeal rather than record it twice', () => {
      expect(then.error).toBeDefined()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
      expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('appeals that are not allowed', () => {
    const expectRejected = async (
      theCase: Case,
      createDto: CreateAppealCaseDto = dto,
    ) => {
      const then = await givenWhenThen(theCase, createDto)

      expect(then.error).toBeDefined()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
      expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
    }

    it('should reject an appeal that names no defendant', async () => {
      await expectRejected(buildCase(), {
        appealType: AppealCaseType.VERDICT,
      })
    })

    it('should reject an appeal for a defendant not on the case', async () => {
      await expectRejected(buildCase(), {
        appealType: AppealCaseType.VERDICT,
        defendantId: uuid(),
      })
    })

    it('should reject an appeal by someone who is not the confirmed defender', async () => {
      await expectRejected(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId: '2222222222',
              verdicts: [verdict],
            },
          ],
        } as unknown as Partial<Case>),
      )
    })

    it('should reject an appeal when the defender choice is not confirmed', async () => {
      await expectRejected(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: false,
              defenderNationalId,
              verdicts: [verdict],
            },
          ],
        } as unknown as Partial<Case>),
      )
    })

    it('should reject an appeal on a case that is still open', async () => {
      await expectRejected(buildCase({ state: CaseState.RECEIVED }))
    })

    it('should reject an appeal on a case that did not end in a verdict', async () => {
      await expectRejected(
        buildCase({
          indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
        }),
      )
    })

    // A default judgement is reopened, not appealed.
    it('should reject an appeal of a default judgement', async () => {
      await expectRejected(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId,
              verdicts: [{ ...verdict, isDefaultJudgement: true }],
            },
          ],
        } as unknown as Partial<Case>),
      )
    })

    it('should reject an appeal before the verdict has been served', async () => {
      await expectRejected(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId,
              verdicts: [
                {
                  id: verdictId,
                  serviceRequirement: ServiceRequirement.REQUIRED,
                },
              ],
            },
          ],
        } as unknown as Partial<Case>),
      )
    })

    it('should reject an appeal after the deadline has run out', async () => {
      await expectRejected(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId,
              verdicts: [
                {
                  ...verdict,
                  serviceDate: new Date('2020-01-01T00:00:00Z'),
                },
              ],
            },
          ],
        } as unknown as Partial<Case>),
      )
    })

    it('should reject an appeal of a verdict already appealed', async () => {
      await expectRejected(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId,
              verdicts: [{ ...verdict, appealDate: serviceDate }],
            },
          ],
        } as unknown as Partial<Case>),
      )
    })
  })
})
