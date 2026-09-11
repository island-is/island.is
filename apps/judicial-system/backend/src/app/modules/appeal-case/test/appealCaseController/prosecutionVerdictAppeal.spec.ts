import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import { addMessagesToQueue } from '@island.is/judicial-system/message'
import {
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  AppealOrigin,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  InstitutionType,
  ServiceRequirement,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealEventLog,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
  DefendantRepositoryService,
  VerdictRepositoryService,
} from '../../../repository'
import { CreateAppealCaseDto } from '../../dto/createAppealCase.dto'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  dto?: CreateAppealCaseDto,
  user?: User,
) => Promise<Then>

// The public prosecution reviewer appeals the verdict regarding one defendant
// on the prosecution's behalf: the review decision confirmed on the review page
// is the appeal.
describe('AppealCaseController - Prosecution verdict appeal', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const verdictId = uuid()
  const reviewerId = uuid()

  const reviewer = {
    id: reviewerId,
    role: UserRole.PROSECUTOR,
    nationalId: '3333333333',
    name: 'Kamilla Haralz',
    title: 'saksóknari',
    institution: {
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      name: 'Ríkissaksóknari',
    },
  } as User

  const now = new Date('2026-06-04T13:34:00Z')

  const createdAppealCase = {
    id: appealCaseId,
    caseId,
    appealType: AppealCaseType.VERDICT,
    appealDate: now,
  } as AppealCase

  // Served, but not required to be: the prosecution's right does not depend on
  // service, and the deadline is not enforced here - the ruling is old.
  const verdict = {
    id: verdictId,
    serviceRequirement: ServiceRequirement.REQUIRED,
    serviceDate: new Date('2026-01-05T10:00:00Z'),
  }

  const buildCase = (overrides: Partial<Case> = {}) =>
    ({
      id: caseId,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      indictmentReviewerId: reviewerId,
      rulingDate: new Date('2026-01-05T10:00:00Z'),
      caseFiles: [],
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId: '1111111111',
          verdicts: [verdict],
        },
      ],
      ...overrides,
    } as unknown as Case)

  const dto: CreateAppealCaseDto = {
    appealType: AppealCaseType.VERDICT,
    defendantId,
  }

  const event = (
    eventType: AppealEventType,
    userRole: UserRole,
    created: string,
    forDefendantId = defendantId,
  ) =>
    ({
      defendantId: forDefendantId,
      eventType,
      userRole,
      created: new Date(created),
    } as AppealEventLog)

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockDefendantRepositoryService: DefendantRepositoryService
  let mockVerdictRepositoryService: VerdictRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      defendantRepositoryService,
      verdictRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService
    mockDefendantRepositoryService = defendantRepositoryService
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

    givenWhenThen = async (theCase, createDto = dto, user = reviewer) => {
      const then = {} as Then

      await appealCaseController
        .create(caseId, user, theCase, createDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('the reviewer appeals the verdict of a defendant', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(buildCase())
    })

    it('should create a verdict appeal case dated to now', () => {
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

    // Per defendant, and on the prosecution's side: the event names the
    // defendant whose verdict is appealed and carries the prosecution's role.
    it('should record a prosecution APPEALED event for that defendant', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.OUT_OF_COURT,
          userRole: UserRole.PROSECUTOR,
          userId: reviewerId,
          defendantId,
          nationalId: reviewer.nationalId,
          userName: reviewer.name,
          userTitle: reviewer.title,
          institutionName: reviewer.institution?.name,
        },
        { transaction },
      )
    })

    // The mirror and the appeal defender belong to the defendant's own appeal.
    it('should touch neither the verdict nor the defendant', () => {
      expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
    })

    it('should queue no messages', () => {
      expect(addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  // Both sides may appeal the same defendant's verdict; the prosecution joins
  // the case the defendant's appeal created.
  describe('the reviewer appeals a verdict the defendant has already appealed', () => {
    const existingAppealCase = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
      appealState: AppealCaseState.APPEALED,
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
        event(
          AppealEventType.APPEALED,
          UserRole.DEFENDER,
          '2026-06-02T09:00:00Z',
        ),
      ])

      then = await givenWhenThen(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId: '1111111111',
              verdicts: [
                { ...verdict, appealDate: new Date('2026-06-02T09:00:00Z') },
              ],
            },
          ],
        } as unknown as Partial<Case>),
      )
    })

    it('should join the existing appeal case', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(then.result).toBe(existingAppealCase)
    })

    it('should record its own APPEALED event', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          userRole: UserRole.PROSECUTOR,
          defendantId,
        }),
        { transaction },
      )
    })
  })

  // The deadline is the reviewer's to judge; the review page confirms a late
  // decision with them.
  describe('the reviewer appeals after the deadline has run out', () => {
    it('should register the appeal', async () => {
      const then = await givenWhenThen(
        buildCase({ rulingDate: new Date('2020-01-01T00:00:00Z') }),
      )

      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalled()
    })
  })

  // The prosecution's right to appeal does not depend on the verdict having
  // been served on the defendant.
  describe('the reviewer appeals before the verdict has been served', () => {
    it('should register the appeal', async () => {
      const then = await givenWhenThen(
        buildCase({
          defendants: [
            {
              id: defendantId,
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

      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalled()
    })
  })

  describe('appeals that are not allowed', () => {
    const expectRejected = async (
      theCase: Case,
      createDto: CreateAppealCaseDto = dto,
      user: User = reviewer,
    ) => {
      const then = await givenWhenThen(theCase, createDto, user)

      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()

      return then
    }

    it('should reject a prosecutor who is not the reviewer assigned to the case', async () => {
      await expectRejected(buildCase({ indictmentReviewerId: uuid() }))
    })

    // Seen only under the lock: the prosecution has no mirror on the verdict.
    it('should reject appealing a defendant the prosecution has already appealed', async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [
          {
            id: appealCaseId,
            appealType: AppealCaseType.VERDICT,
            appealState: AppealCaseState.APPEALED,
          } as AppealCase,
        ],
      )
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([
        event(
          AppealEventType.APPEALED,
          UserRole.PROSECUTOR,
          '2026-06-02T09:00:00Z',
        ),
      ])

      await expectRejected(buildCase())
    })

    // Once the court of appeals has received the case the decision is made.
    it('should reject an appeal once the court of appeals has received the case', async () => {
      ;(mockAppealCaseRepositoryService.findAll as jest.Mock).mockResolvedValue(
        [
          {
            id: appealCaseId,
            appealType: AppealCaseType.VERDICT,
            appealState: AppealCaseState.RECEIVED,
          } as AppealCase,
        ],
      )
      ;(
        mockAppealEventLogRepositoryService.findAll as jest.Mock
      ).mockResolvedValue([])

      await expectRejected(buildCase())
    })

    it('should reject an appeal on a case that did not end in a verdict', async () => {
      await expectRejected(
        buildCase({
          indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
        }),
      )
    })
  })
})
