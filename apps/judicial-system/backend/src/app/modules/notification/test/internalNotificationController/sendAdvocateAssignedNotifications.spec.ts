import { v4 as uuid } from 'uuid'

import { EmailService } from '@island.is/email-service'
import { ConfigType } from '@island.is/nest/config'

import {
  CaseType,
  RequestCaseNotificationType,
  RequestSharedWhen,
  RequestSharedWithDefender,
  SessionArrangements,
  TrackedNotificationType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send advocate assigned notifications', () => {
  const userId = uuid()

  const { defender, victimLawyer } = createTestUsers([
    'defender',
    'victimLawyer',
  ])

  const court = { name: 'Héraðsdómur Reykjavíkur' } as Case['court']
  const courtCaseNumber = 'R-123/2022'

  let mockEmailService: EmailService
  let mockConfig: ConfigType<typeof notificationModuleConfig>
  let givenWhenThen: GivenWhenThen
  let notificationDTO: CaseNotificationDto

  const expectedEmail = ({
    name,
    address,
    responsibility,
  }: {
    name?: string
    address?: string
    responsibility: string
  }) => ({
    from: {
      name: mockConfig.email.fromName,
      address: mockConfig.email.fromEmail,
    },
    to: [{ name, address }],
    replyTo: {
      name: mockConfig.email.replyToName,
      address: mockConfig.email.replyToEmail,
    },
    attachments: undefined,
    subject: `Yfirlit máls ${courtCaseNumber}`,
    text: expect.anything(),
    // The advocate has no access to the case yet, so the email carries no link
    html: `Héraðsdómur Reykjavíkur hefur skráð þig sem ${responsibility} í máli ${courtCaseNumber}.<br /><br />Þú getur nálgast yfirlit málsins hjá Héraðsdómi Reykjavíkur ef það hefur ekki þegar verið afhent.`,
  })

  beforeEach(async () => {
    const { emailService, notificationConfig, internalNotificationController } =
      await createTestingNotificationModule()

    notificationDTO = {
      user: { id: userId } as User,
      type: RequestCaseNotificationType.ADVOCATE_ASSIGNED,
    }

    mockEmailService = emailService
    mockConfig = notificationConfig

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      notificationDto: CaseNotificationDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await internalNotificationController.sendCaseNotification(
          caseId,
          theCase,
          notificationDto,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('when the defender has no access to a restriction case', () => {
    const caseId = uuid()
    // Note: no arraignment date - it was not confirmed
    const theCase = {
      id: caseId,
      type: CaseType.ADMISSION_TO_FACILITY,
      court,
      courtCaseNumber,
      defenderEmail: defender.email,
      defenderName: defender.name,
      defenderNationalId: '1234567890',
      requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should send an information only email without a link', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expectedEmail({
          name: defender.name,
          address: defender.email,
          responsibility: 'verjanda/talsmann sakbornings',
        }),
      )
    })
  })

  describe('when the request is never shared with the defender', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      court,
      courtCaseNumber,
      defenderEmail: defender.email,
      defenderName: defender.name,
      requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should send an information only email without a link', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expectedEmail({
          name: defender.name,
          address: defender.email,
          responsibility: 'verjanda/talsmann sakbornings',
        }),
      )
    })
  })

  describe('when the defender has already been sent a link to the case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      court,
      courtCaseNumber,
      defenderEmail: defender.email,
      defenderName: defender.name,
      requestSharedWithDefender: RequestSharedWithDefender.READY_FOR_COURT,
      notifications: [
        {
          type: TrackedNotificationType.READY_FOR_COURT,
          recipients: [{ address: defender.email, success: true }],
        },
      ],
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should not send an email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('when the defender has already been notified', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      court,
      courtCaseNumber,
      defenderEmail: defender.email,
      defenderName: defender.name,
      requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
      notifications: [
        {
          type: TrackedNotificationType.ADVOCATE_ASSIGNED,
          recipients: [{ address: defender.email, success: true }],
        },
      ],
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should not send an email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('when the defender is not included in the session arrangements', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.PHONE_TAPPING,
      court,
      courtCaseNumber,
      defenderEmail: defender.email,
      defenderName: defender.name,
      sessionArrangements: SessionArrangements.PROSECUTOR_PRESENT,
      requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should not send an email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    })
  })

  describe('when an investigation case has a defender and victim lawyers', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.PHONE_TAPPING,
      court,
      courtCaseNumber,
      defenderEmail: defender.email,
      defenderName: defender.name,
      sessionArrangements: SessionArrangements.ALL_PRESENT,
      requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
      victims: [
        {
          lawyerEmail: victimLawyer.email,
          lawyerName: victimLawyer.name,
          lawyerAccessToRequest: RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED,
        },
      ],
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should send an information only email to both advocates', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2)
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expectedEmail({
          name: defender.name,
          address: defender.email,
          responsibility: 'verjanda/talsmann sakbornings',
        }),
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expectedEmail({
          name: victimLawyer.name,
          address: victimLawyer.email,
          responsibility: 'réttargæslumaður',
        }),
      )
    })
  })

  describe('when a victim lawyer has already been sent a link to the case', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.PHONE_TAPPING,
      court,
      courtCaseNumber,
      sessionArrangements: SessionArrangements.ALL_PRESENT,
      victims: [
        {
          lawyerEmail: victimLawyer.email,
          lawyerName: victimLawyer.name,
          lawyerAccessToRequest: RequestSharedWhen.READY_FOR_COURT,
        },
      ],
      notifications: [
        {
          type: TrackedNotificationType.READY_FOR_COURT,
          recipients: [{ address: victimLawyer.email, success: true }],
        },
      ],
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, notificationDTO)
    })

    it('should not send an email', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
