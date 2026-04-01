import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { SmsService } from '@island.is/nova-sms'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseNotificationType,
  CaseType,
  getStatementDeadline,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

// ─── Shared indictment case fixtures ────────────────────────────────────────

const defender1NationalId = '1111111111'
const defender2NationalId = '2222222222'
const spokespersonNationalId = '3333333333'

const defendants = [
  {
    defenderName: 'Defender One',
    defenderEmail: 'defender1@omnitrix.is',
    defenderNationalId: defender1NationalId,
    isDefenderChoiceConfirmed: true,
  },
  {
    defenderName: 'Defender Two',
    defenderEmail: 'defender2@omnitrix.is',
    defenderNationalId: defender2NationalId,
    isDefenderChoiceConfirmed: true,
  },
]

const civilClaimants = [
  {
    spokespersonName: 'Spokesperson One',
    spokespersonEmail: 'spokesperson1@omnitrix.is',
    spokespersonNationalId: spokespersonNationalId,
  },
]

// ─── 1. APPEAL_TO_COURT_OF_APPEALS for indictment case ─────────────────────

describe('InternalNotificationController - Send indictment appeal to court of appeals notifications', () => {
  const { prosecutor, judge, registrar, court } = createTestUsers([
    'prosecutor',
    'judge',
    'registrar',
    'court',
  ])

  const caseId = uuid()
  const courtCaseNumber = uuid()

  let mockEmailService: EmailService
  let mockSmsService: SmsService

  type GivenWhenThen = (user: User) => Promise<Then>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_ASSISTANT_MOBILE_NUMBERS = `{"${court.id}": "${court.mobile}"}`
    process.env.COURTS_EMAILS = `{"${court.id}": "${court.email}"}`

    const { emailService, smsService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockSmsService = smsService

    givenWhenThen = async (user: User) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            prosecutor: {
              name: prosecutor.name,
              email: prosecutor.email,
              mobileNumber: prosecutor.mobile,
            },
            judge: { name: judge.name, email: judge.email },
            registrar: { name: registrar.name, email: registrar.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            courtCaseNumber,
            courtId: court.id,
            defendants,
            civilClaimants,
            appealCase: {
              appealedByNationalId: defender1NationalId,
              appealState: CaseAppealState.APPEALED,
            },
          } as Case,
          {
            user,
            type: CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('case appealed by prosecution', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.PROSECUTOR,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      } as User)
    })

    it('should send emails to judge, registrar, court, and all defence recipients', () => {
      // Judge
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Registrar
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrar.name, address: registrar.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Court
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Héraðsdómur Reykjavíkur', address: court.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Defender 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender One', address: 'defender1@omnitrix.is' }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Defender 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // 6 emails total: judge + registrar + court + defender1 + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(6)
    })

    it('should send SMS to court assistant', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [court.mobile],
        expect.stringContaining(courtCaseNumber),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('case appealed by defence (defender1)', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.DEFENDER,
        nationalId: defender1NationalId,
      } as User)
    })

    it('should send emails to judge, registrar, court, prosecutor, defender2 and spokesperson (NOT defender1)', () => {
      // Judge
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Registrar
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrar.name, address: registrar.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
        }),
      )
      // Court
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Héraðsdómur Reykjavíkur', address: court.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
        }),
      )
      // Prosecutor
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Defender 2 (NOT defender 1 — excluded as appealer)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: `Kæra í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // 6 emails: judge + registrar + court + prosecutor + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(6)
    })

    it('should send SMS to court assistant and prosecutor', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [court.mobile],
        expect.stringContaining(courtCaseNumber),
      )
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [prosecutor.mobile],
        expect.stringContaining(courtCaseNumber),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})

// ─── 2. APPEAL_RECEIVED_BY_COURT for indictment case ───────────────────────

describe('InternalNotificationController - Send indictment appeal received by court notifications', () => {
  const { coa, prosecutor, coaAssistant1, coaAssistant2 } = createTestUsers([
    'coa',
    'prosecutor',
    'coaAssistant1',
    'coaAssistant2',
  ])

  const caseId = uuid()
  const courtCaseNumber = uuid()
  const receivedDate = new Date()

  let mockEmailService: EmailService
  let mockSmsService: SmsService

  type GivenWhenThen = () => Promise<Then>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"4676f08b-aab4-4b4f-a366-697540788088":"${coa.email}"}`
    process.env.COURT_OF_APPEALS_ASSISTANT_EMAILS = `${coaAssistant1.email}, ${coaAssistant2.email}`

    const { emailService, smsService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService
    mockSmsService = smsService

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            prosecutor: {
              name: prosecutor.name,
              email: prosecutor.email,
              mobileNumber: prosecutor.mobile,
            },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            courtCaseNumber,
            defendants,
            civilClaimants,
            appealCase: {
              appealReceivedByCourtDate: receivedDate,
              appealState: CaseAppealState.RECEIVED,
            },
          } as Case,
          {
            user: { id: uuid() } as User,
            type: CaseNotificationType.APPEAL_RECEIVED_BY_COURT,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('appeal received by court', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should send emails to CoA, prosecutor, all defenders and spokesperson', () => {
      // CoA email
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Landsréttur', address: coa.email }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // CoA assistant 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Landsréttur', address: coaAssistant1.email }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // CoA assistant 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Landsréttur', address: coaAssistant2.email }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // Prosecutor
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Defender 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender One', address: 'defender1@omnitrix.is' }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Defender 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: `Upplýsingar vegna kæru í máli ${courtCaseNumber}`,
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // 7 emails: coa + assistant1 + assistant2 + prosecutor + defender1 + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(7)
    })

    it('should send SMS to prosecutor', () => {
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        [prosecutor.mobile],
        expect.stringContaining(courtCaseNumber),
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })
})

// ─── 3. APPEAL_STATEMENT for indictment case ───────────────────────────────

describe('InternalNotificationController - Send indictment appeal statement notifications', () => {
  const { prosecutor, assistant, judge1, judge2, judge3 } = createTestUsers([
    'prosecutor',
    'assistant',
    'judge1',
    'judge2',
    'judge3',
  ])

  const caseId = uuid()
  const courtCaseNumber = uuid()
  const appealCaseNumber = 'L-123/2026'

  let mockEmailService: EmailService

  type GivenWhenThen = (user: User) => Promise<Then>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (user: User) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            prosecutor: { name: prosecutor.name, email: prosecutor.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            courtCaseNumber,
            defendants,
            civilClaimants,
            appealCase: {
              appealCaseNumber,
              appealAssistant: {
                name: assistant.name,
                email: assistant.email,
              },
              appealJudge1: { name: judge1.name, email: judge1.email },
              appealJudge2: { name: judge2.name, email: judge2.email },
              appealJudge3: { name: judge3.name, email: judge3.email },
            },
          } as Case,
          {
            user,
            type: CaseNotificationType.APPEAL_STATEMENT,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('defence submits statement', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.DEFENDER,
        nationalId: defender1NationalId,
      } as User)
    })

    it('should send emails to CoA team, prosecutor, defender2 and spokesperson (NOT defender1)', () => {
      // CoA assistant
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: assistant.name, address: assistant.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // CoA judge 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge1.name, address: judge1.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // CoA judge 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge2.name, address: judge2.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // CoA judge 3
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge3.name, address: judge3.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // Prosecutor
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Defender 2 (defender1 excluded as submitter)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // 7 emails: assistant + judge1 + judge2 + judge3 + prosecutor + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(7)
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('prosecution submits statement', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        role: UserRole.PROSECUTOR,
        institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
      } as User)
    })

    it('should send emails to CoA team and all defence recipients', () => {
      // CoA assistant
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: assistant.name, address: assistant.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/landsrettur/yfirlit/${caseId}`),
        }),
      )
      // CoA judge 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge1.name, address: judge1.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Defender 1 (NOT excluded when prosecution submits)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender One', address: 'defender1@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Defender 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // 7 emails: assistant + judge1 + judge2 + judge3 + defender1 + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(7)
      expect(then.result).toEqual({ delivered: true })
    })
  })
})

// ─── 4. APPEAL_COMPLETED for indictment case ────────────────────────────────

describe('InternalNotificationController - Send indictment appeal completed notifications', () => {
  const { prosecutor, judge } = createTestUsers(['prosecutor', 'judge'])

  const caseId = uuid()
  const courtCaseNumber = uuid()
  const appealCaseNumber = uuid()

  let mockEmailService: EmailService

  type GivenWhenThen = () => Promise<Then>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            prosecutor: { name: prosecutor.name, email: prosecutor.email },
            judge: { name: judge.name, email: judge.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            courtCaseNumber,
            defendants,
            civilClaimants,
            appealCase: {
              appealState: CaseAppealState.COMPLETED,
              appealCaseNumber,
              appealRulingDecision: CaseAppealRulingDecision.ACCEPTING,
            },
          } as Case,
          {
            user: { id: uuid() } as User,
            type: CaseNotificationType.APPEAL_COMPLETED,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('appeal completed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should send emails to judge, prosecutor, all defenders and spokesperson (NO prison)', () => {
      // Judge
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Prosecutor
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/akaera/yfirlit/${caseId}`),
        }),
      )
      // Defender 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender One', address: 'defender1@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Defender 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: expect.stringContaining(courtCaseNumber),
          html: expect.stringContaining(`/verjandi/akaera/${caseId}`),
        }),
      )
      // 5 emails: judge + prosecutor + defender1 + defender2 + spokesperson (NO prison)
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(5)
      expect(then.result).toEqual({ delivered: true })
    })
  })
})

// ─── 5. APPEAL_WITHDRAWN for indictment case ───────────────────────────────

describe('InternalNotificationController - Send indictment appeal withdrawn notifications', () => {
  const { court, judge, prosecutor, registrar } = createTestUsers([
    'court',
    'judge',
    'prosecutor',
    'registrar',
  ])

  const caseId = uuid()
  const courtCaseNumber = uuid()

  let mockEmailService: EmailService

  type GivenWhenThen = (userRole: UserRole) => Promise<Then>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    process.env.COURTS_EMAILS = `{"${court.id}": "${court.email}"}`

    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (userRole: UserRole) => {
      const then = {} as Then

      const user =
        userRole === UserRole.PROSECUTOR
          ? ({
              role: UserRole.PROSECUTOR,
              institution: {
                type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
              },
            } as User)
          : ({
              role: UserRole.DEFENDER,
            } as User)

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            prosecutor: {
              name: prosecutor.name,
              email: prosecutor.email,
            },
            judge: { name: judge.name, email: judge.email },
            registrar: { name: registrar.name, email: registrar.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            courtCaseNumber,
            courtId: court.id,
            defendants,
            civilClaimants,
            appealCase: {
              appealedByNationalId: defender1NationalId,
              appealState: CaseAppealState.APPEALED,
            },
          } as Case,
          {
            user,
            type: CaseNotificationType.APPEAL_WITHDRAWN,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('prosecution withdraws appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.PROSECUTOR)
    })

    it('should send emails to judge, court, registrar, all defenders and spokesperson', () => {
      // Judge
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Court
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Héraðsdómur Reykjavíkur', address: court.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Registrar
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrar.name, address: registrar.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Defender 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender One', address: 'defender1@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Defender 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // 6 emails: judge + court + registrar + defender1 + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(6)
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('defence withdraws appeal', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(UserRole.DEFENDER)
    })

    it('should send emails to judge, court, registrar, prosecutor, defender2 and spokesperson (NOT defender1)', () => {
      // Judge
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: judge.name, address: judge.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Court
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Héraðsdómur Reykjavíkur', address: court.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Registrar
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: registrar.name, address: registrar.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Prosecutor
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Defender 2 (defender1 excluded by appealedByNationalId)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // 6 emails: judge + court + registrar + prosecutor + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(6)
      expect(then.result).toEqual({ delivered: true })
    })
  })
})

// ─── 6. APPEAL_COMPLETED (DISCONTINUED) for indictment case ────────────────

describe('InternalNotificationController - Send indictment appeal discontinued notifications', () => {
  const { prosecutor } = createTestUsers(['prosecutor'])

  const caseId = uuid()
  const courtCaseNumber = uuid()
  const appealCaseNumber = uuid()

  let mockEmailService: EmailService

  type GivenWhenThen = () => Promise<Then>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async () => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(
          caseId,
          {
            id: caseId,
            type: CaseType.INDICTMENT,
            indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
            prosecutor: { name: prosecutor.name, email: prosecutor.email },
            court: { name: 'Héraðsdómur Reykjavíkur' },
            courtCaseNumber,
            defendants,
            civilClaimants,
            appealCase: {
              appealCaseNumber,
              appealRulingDecision: CaseAppealRulingDecision.DISCONTINUED,
            },
          } as Case,
          {
            user: { id: uuid() } as User,
            type: CaseNotificationType.APPEAL_COMPLETED,
          },
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))
      return then
    }
  })

  describe('appeal discontinued', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should send emails to prosecutor, all defenders and spokesperson', () => {
      // Prosecutor
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Defender 1
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender One', address: 'defender1@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Defender 2
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: 'Defender Two', address: 'defender2@omnitrix.is' }],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // Spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [
            {
              name: 'Spokesperson One',
              address: 'spokesperson1@omnitrix.is',
            },
          ],
          subject: expect.stringContaining(courtCaseNumber),
        }),
      )
      // 4 emails: prosecutor + defender1 + defender2 + spokesperson
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(4)
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
