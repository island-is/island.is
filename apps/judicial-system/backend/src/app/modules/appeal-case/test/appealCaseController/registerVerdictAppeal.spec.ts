import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

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
  dto: CreateAppealCaseDto,
  user?: User,
) => Promise<Then>

// The public prosecution office registers a verdict appeal that reached it
// outside the system - by letter or email from a defender who is not in the
// system - on the defendant's behalf.
describe('AppealCaseController - Register verdict appeal', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const verdictId = uuid()
  const defenderNationalId = '1111111111'

  const publicProsecutorStaff = {
    id: uuid(),
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    nationalId: '3333333333',
    name: 'Skrifstofa Ríkissaksóknara',
    title: 'skrifstofa',
    institution: {
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      name: 'Ríkissaksóknari',
    },
  } as User

  const now = new Date('2026-06-04T13:34:00Z')
  const appealDate = new Date('2026-06-02T00:00:00Z')

  const createdAppealCase = {
    id: appealCaseId,
    caseId,
    appealType: AppealCaseType.VERDICT,
    appealDate,
  } as AppealCase

  // Served long ago: the office registers appeals after the deadline as well,
  // so unlike the defender's filing this fixture need not be inside it.
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
      rulingDate: new Date('2026-01-05T10:00:00Z'),
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

  const appealDefender = {
    appealDefenderName: 'Lára Landsréttarlögmaður',
    appealDefenderNationalId: '4444444444',
    appealDefenderEmail: 'lara@logmenn.is',
    appealDefenderPhoneNumber: '5555555',
  }

  const dto: CreateAppealCaseDto = {
    appealType: AppealCaseType.VERDICT,
    defendantId,
    appealDate,
    ...appealDefender,
  }

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

    givenWhenThen = async (
      theCase,
      createDto,
      user = publicProsecutorStaff,
    ) => {
      const then = {} as Then

      await appealCaseController
        .create(caseId, user, theCase, createDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('the office registers the first appeal of the verdict', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(buildCase(), dto)
    })

    // The appeal happened when the filing was made, not when the office got
    // round to registering it.
    it('should create a verdict appeal case dated to the filing', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          appealType: AppealCaseType.VERDICT,
          appealState: AppealCaseState.APPEALED,
          appealDate,
        },
        { transaction },
      )
      expect(then.result).toBe(createdAppealCase)
    })

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

    // The event records who registered the appeal - the office - and for whom.
    it('should record an APPEALED event for the defendant, by the office', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEALED,
          appealOrigin: AppealOrigin.OUT_OF_COURT,
          userRole: UserRole.PUBLIC_PROSECUTOR_STAFF,
          userId: publicProsecutorStaff.id,
          defendantId,
          nationalId: publicProsecutorStaff.nationalId,
          userName: publicProsecutorStaff.name,
          userTitle: publicProsecutorStaff.title,
          institutionName: publicProsecutorStaff.institution?.name,
        },
        { transaction },
      )
    })

    // A new appeal defender is unconfirmed until the court of appeals says
    // otherwise, whatever it had decided about a previous one.
    it('should record the defender who filed the appeal on the defendant, unconfirmed', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        { ...appealDefender, isAppealDefenderConfirmed: false },
        { transaction },
      )
    })

    it('should mirror the filing date onto the verdict', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        { appealDate },
        { transaction },
      )
    })

    it('should queue no messages', () => {
      expect(addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('the office registers an appeal for a defendant whose co-defendant appealed', () => {
    const existingAppealCase = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
      appealDate: new Date('2026-05-30T09:00:00Z'),
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
          defendantId: uuid(),
          eventType: AppealEventType.APPEALED,
          created: new Date('2026-05-30T09:00:00Z'),
        },
      ])

      then = await givenWhenThen(buildCase(), dto)
    })

    it('should join the existing appeal case', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(then.result).toBe(existingAppealCase)
    })

    it('should mirror this filing date, not the appeal case date, onto the verdict', () => {
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        { appealDate },
        { transaction },
      )
    })
  })

  // The web sends the date as an ISO string and the validation pipe does not
  // transform the body, so that is what the service gets, whatever the DTO says.
  describe('the office registers with the filing date as a string', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(buildCase(), {
        ...dto,
        appealDate: appealDate.toISOString() as unknown as Date,
      })
    })

    it('should read it as the filing date', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({ appealDate }),
        { transaction },
      )
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        verdictId,
        { appealDate },
        { transaction },
      )
    })
  })

  // The fields describe one person, so the ones left out are cleared rather
  // than kept from whoever was recorded before.
  describe('the office names the defender by name only', () => {
    beforeEach(async () => {
      await givenWhenThen(buildCase(), {
        appealType: AppealCaseType.VERDICT,
        defendantId,
        appealDate,
        appealDefenderName: 'Lára Landsréttarlögmaður',
      })
    })

    it('should clear the other defender fields', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        {
          appealDefenderName: 'Lára Landsréttarlögmaður',
          appealDefenderNationalId: null,
          appealDefenderEmail: null,
          appealDefenderPhoneNumber: null,
          isAppealDefenderConfirmed: false,
        },
        { transaction },
      )
    })
  })

  describe('the office registers without naming the defender', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(buildCase(), {
        appealType: AppealCaseType.VERDICT,
        defendantId,
        appealDate,
      })
    })

    it('should register and leave the defendant untouched', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalled()
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('registrations that are not allowed', () => {
    const expectRejected = async (
      theCase: Case,
      createDto: CreateAppealCaseDto,
      user?: User,
    ) => {
      const then = await givenWhenThen(theCase, createDto, user)

      expect(then.error).toBeDefined()
      expect(mockAppealCaseRepositoryService.create).not.toHaveBeenCalled()
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
      expect(mockVerdictRepositoryService.update).not.toHaveBeenCalled()

      return then
    }

    // The office records when the filing was made; without that there is
    // nothing to register.
    it('should reject a registration that does not say when the appeal was filed', async () => {
      const then = await expectRejected(buildCase(), {
        appealType: AppealCaseType.VERDICT,
        defendantId,
      })

      expect(then.error).toBeInstanceOf(BadRequestException)
    })

    it('should reject a filing date that is not a date', async () => {
      const then = await expectRejected(buildCase(), {
        ...dto,
        appealDate: 'not a date' as unknown as Date,
      })

      expect(then.error).toBeInstanceOf(BadRequestException)
    })

    it('should reject a filing date in the future', async () => {
      const then = await expectRejected(buildCase(), {
        ...dto,
        appealDate: new Date('2026-06-05T00:00:00Z'),
      })

      expect(then.error).toBeInstanceOf(BadRequestException)
    })

    it('should reject a registration for a verdict that has already been appealed', async () => {
      await expectRejected(
        buildCase({
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId,
              verdicts: [{ ...verdict, appealDate: new Date() }],
            },
          ],
        } as unknown as Partial<Case>),
        dto,
      )
    })

    it('should reject a registration before the verdict has been served', async () => {
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
        dto,
      )
    })

    // A prosecutor at a police prosecutor's office is neither the defence nor the
    // public prosecution office.
    it('should reject a registration by a prosecutor', async () => {
      const then = await expectRejected(buildCase(), dto, {
        id: uuid(),
        role: UserRole.PROSECUTOR,
        nationalId: '0000000000',
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      } as User)

      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  // A defender appealing in the system appeals now and for their own client;
  // the registration fields are the office's and are ignored for them.
  describe('a defender filing with registration fields set', () => {
    const defender = {
      id: uuid(),
      role: UserRole.DEFENDER,
      nationalId: defenderNationalId,
      name: 'Lára Lögmann',
      title: 'lögmaður',
    } as User

    let then: Then

    beforeEach(async () => {
      // Inside the deadline, measured against the real clock at test time.
      const servedNow = {
        ...verdict,
        serviceDate: new Date(),
      }

      then = await givenWhenThen(
        buildCase({
          rulingDate: new Date(),
          defendants: [
            {
              id: defendantId,
              isDefenderChoiceConfirmed: true,
              defenderNationalId,
              verdicts: [servedNow],
            },
          ],
        } as unknown as Partial<Case>),
        dto,
        defender,
      )
    })

    it('should date the appeal to now, not the supplied date', () => {
      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        expect.objectContaining({ appealDate: now }),
        { transaction },
      )
    })

    it('should not record an appeal defender', () => {
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
    })
  })
})
