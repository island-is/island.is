import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'

import {
  DEFENDER_INDICTMENT_CASE_ROUTE,
  PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  AppealCaseNotificationType,
  CaseType,
  TrackedNotificationType,
  type User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import {
  AppealCase,
  AppealStatementDeadline,
  Case,
  CivilClaimant,
  Defendant,
  NotificationRepositoryService,
} from '../../../repository'
import { AppealCaseNotificationDto } from '../../dto/appealCaseNotification.dto'

jest.mock('../../../../factories')

/**
 * The mails that follow the court of appeals giving a party its deadline to
 * file a statement, or more time for it: one to the party's advocate, another
 * to everyone else with a part in the appeal.
 */
describe('InternalNotificationController - Send appeal statement deadline notifications', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const civilClaimantId = uuid()
  const { prosecutor, defender, spokesperson } = createTestUsers([
    'prosecutor',
    'defender',
    'spokesperson',
  ])
  const user = { id: uuid() } as User

  let mockEmailService: EmailService
  let mockNotificationRepositoryService: NotificationRepositoryService
  let clientUrl: string
  let send: (
    dto: Partial<AppealCaseNotificationDto>,
    overrides?: {
      defendant?: Partial<Defendant>
      secondDefendant?: Partial<Defendant>
      civilClaimant?: Partial<CivilClaimant>
      statementDeadlines?: Partial<AppealStatementDeadline>[]
      appealProsecutor?: Case['appealProsecutor']
    },
  ) => Promise<unknown>

  beforeEach(async () => {
    const {
      emailService,
      notificationRepositoryService,
      notificationConfig,
      internalNotificationController,
    } = await createTestingNotificationModule()

    mockEmailService = emailService
    mockNotificationRepositoryService = notificationRepositoryService
    clientUrl = (notificationConfig as { clientUrl: string }).clientUrl

    send = (dto, overrides = {}) => {
      const defendant = {
        id: defendantId,
        name: 'Gervimaður Jónsson',
        isAppealDefenderConfirmed: true,
        appealDefenderName: defender.name,
        appealDefenderEmail: defender.email,
        ...overrides.defendant,
      } as Defendant
      const civilClaimant = {
        id: civilClaimantId,
        name: 'Fyrsti Kröfuhafi',
        isAppealSpokespersonConfirmed: true,
        appealSpokespersonIsLawyer: false,
        appealSpokespersonName: spokesperson.name,
        appealSpokespersonEmail: spokesperson.email,
        ...overrides.civilClaimant,
      } as CivilClaimant
      const appealCase = {
        id: appealCaseId,
        appealCaseNumber: '77/2026',
        statementDeadlines: (overrides.statementDeadlines ?? [
          { defendantId, deadline: new Date(2026, 9, 20) },
        ]) as AppealStatementDeadline[],
      } as AppealCase
      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        courtCaseNumber: 'S-4275/2025',
        appealProsecutor:
          'appealProsecutor' in overrides
            ? overrides.appealProsecutor
            : ({
                name: prosecutor.name,
                email: prosecutor.email,
              } as Case['appealProsecutor']),
        defendants: overrides.secondDefendant
          ? [defendant, overrides.secondDefendant as Defendant]
          : [defendant],
        civilClaimants: [civilClaimant],
        verdictAppealCase: appealCase,
      } as Case

      return internalNotificationController.sendAppealCaseNotification(
        caseId,
        appealCaseId,
        theCase,
        appealCase,
        {
          user,
          type: AppealCaseNotificationType.APPEAL_STATEMENT_DEADLINE_SET,
          defendantId,
          ...dto,
        } as AppealCaseNotificationDto,
      )
    }
  })

  it('tells the defender it has time, and the others that it does', async () => {
    await send({})

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Landsréttur - greinargerðarfrestur í máli 77/2026',
        html:
          'Landsréttur hefur veitt þér frest til að skila greinargerð vegna máls nr. 77/2026.<br/>' +
          'Frestur til 20. október 2026.<br/><br/>' +
          `<a href="${clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${caseId}">Sjá nánar á yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Landsréttur - greinargerðarfrestur í máli 77/2026',
        html:
          `${defender.name} verjandi hefur fengið frest til að skila greinargerð vegna máls nr. 77/2026. Frestur til 20. október 2026.<br/><br/>` +
          `<a href="${clientUrl}${PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE}/${caseId}">Sjá nánar á yfirlitssíðu málsins í Réttarvörslugátt.</a>`,
        to: [{ name: prosecutor.name, address: prosecutor.email }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(
          `${defender.name} verjandi hefur fengið frest`,
        ),
        to: [{ name: spokesperson.name, address: spokesperson.email }],
      }),
    )
  })

  it('records one notification with everyone written to', async () => {
    await send({})

    expect(mockNotificationRepositoryService.create).toHaveBeenCalledWith({
      caseId,
      type: TrackedNotificationType.APPEAL_STATEMENT_DEADLINE_SET,
      recipients: [
        { address: prosecutor.email, success: true },
        { address: defender.email, success: true },
        { address: spokesperson.email, success: true },
      ],
    })
  })

  it('words an extension as more time, and records it as one', async () => {
    await send(
      { type: AppealCaseNotificationType.APPEAL_STATEMENT_DEADLINE_EXTENDED },
      {
        statementDeadlines: [{ defendantId, deadline: new Date(2026, 9, 27) }],
      },
    )

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject:
          'Landsréttur - framlengdur greinargerðarfrestur í máli 77/2026',
        html: expect.stringContaining(
          'Landsréttur hefur veitt þér aukinn frest til að skila greinargerð vegna máls nr. 77/2026.<br/>Frestur til 27. október 2026.',
        ),
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(
          `${defender.name} verjandi hefur fengið aukinn frest`,
        ),
        to: [{ name: prosecutor.name, address: prosecutor.email }],
      }),
    )
    expect(mockNotificationRepositoryService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TrackedNotificationType.APPEAL_STATEMENT_DEADLINE_EXTENDED,
      }),
    )
  })

  // The prosecution is a party like the others: its own mail when the
  // deadline is its own, named by the prosecutor and role to the rest.
  it('writes to the prosecutor as the party given the time', async () => {
    await send(
      { defendantId: undefined },
      {
        statementDeadlines: [{ deadline: new Date(2026, 9, 20) }],
      },
    )

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Landsréttur hefur veitt þér frest'),
        to: [{ name: prosecutor.name, address: prosecutor.email }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(
          `${prosecutor.name} saksóknari hefur fengið frest`,
        ),
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
  })

  it("names a claimant's advocate by the role the court settled on", async () => {
    await send(
      { defendantId: undefined, civilClaimantId },
      {
        civilClaimant: { appealSpokespersonIsLawyer: true },
        statementDeadlines: [
          { civilClaimantId, deadline: new Date(2026, 9, 20) },
        ],
      },
    )

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(
          `${spokesperson.name} lögmaður hefur fengið frest`,
        ),
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
  })

  // A party without an advocate gets a deadline all the same (owner's
  // decision); there is nobody to tell, but the others are told who it is.
  it('names the party itself when it has no advocate to write to', async () => {
    await send({}, { defendant: { isAppealDefenderWaived: true } })

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(
          'Ákærði Gervimaður Jónsson hefur fengið frest',
        ),
        to: [{ name: prosecutor.name, address: prosecutor.email }],
      }),
    )
  })

  // One lawyer defending two of the accused hears once, as the advocate
  // of the one given the time, and is not told about herself.
  it('writes once to a defender shared by two of the accused', async () => {
    await send(
      {},
      {
        secondDefendant: {
          id: uuid(),
          name: 'Annar Ákærði',
          isAppealDefenderConfirmed: true,
          appealDefenderName: defender.name,
          appealDefenderEmail: defender.email,
        },
      },
    )

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(3)
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('Landsréttur hefur veitt þér frest'),
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('hefur fengið frest'),
        to: [{ name: defender.name, address: defender.email }],
      }),
    )
  })

  it('sends nothing, and records nothing, when there is nobody to write to', async () => {
    const result = await send(
      {},
      {
        appealProsecutor: undefined,
        defendant: { isAppealDefenderConfirmed: false },
        civilClaimant: { isAppealSpokespersonConfirmed: false },
      },
    )

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    expect(mockNotificationRepositoryService.create).not.toHaveBeenCalled()
    expect(result).toEqual({ delivered: true })
  })

  it('leaves out an advocate the court has not confirmed', async () => {
    await send({}, { civilClaimant: { isAppealSpokespersonConfirmed: false } })

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
    expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ name: spokesperson.name, address: spokesperson.email }],
      }),
    )
  })

  // The message runs after commit, so the row is there; one that is not is a
  // message about nothing, and retrying it would not change that.
  it('sends nothing, without failing, when the appeal holds no such deadline', async () => {
    const result = await send({}, { statementDeadlines: [] })

    expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    expect(result).toEqual({ delivered: true })
  })
})
