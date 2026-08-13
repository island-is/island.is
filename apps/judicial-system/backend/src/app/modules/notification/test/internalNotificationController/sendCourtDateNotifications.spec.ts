import { v4 as uuid } from 'uuid'

import { ConfigType } from '@nestjs/config'

import { EmailService } from '@island.is/email-service'

import { DEFENDER_REQUEST_CASE_ROUTE, PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseType,
  RequestCaseNotificationType,
  RequestSharedWhen,
  SessionArrangements,
  TrackedNotificationType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../createTestingNotificationModule'

import { Case, Notification } from '../../../repository'
import { CaseNotificationDto } from '../../dto/caseNotification.dto'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationDto: CaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send court date notifications', () => {
  const userId = uuid()
  const userName = 'Test'
  const caseId = uuid()

  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()

  const { prosecutor, defender, victimLawyer } = createTestUsers([
    'prosecutor',
    'defender',
    'victimLawyer',
  ])

  let mockConfig: ConfigType<typeof notificationModuleConfig>

  let mockEmailService: EmailService
  let mockNotificationModel: typeof Notification
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      emailService,
      internalNotificationController,
      notificationConfig,
      notificationModel,
    } = await createTestingNotificationModule()

    mockConfig = notificationConfig
    mockEmailService = emailService
    mockNotificationModel = notificationModel

    givenWhenThen = async (
      theCase: Case,
      notificationDto: CaseNotificationDto,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendCaseNotification(caseId, theCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent', () => {
    let then: Then

    const notificationDto: CaseNotificationDto = {
      user: { id: userId } as User,
      userDescriptor: { name: userName },
      type: RequestCaseNotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      court: { name: courtName },
      courtCaseNumber,
      defenderName: defender.name,
      defenderEmail: defender.email,
      defenderNationalId: defender.nationalId,
    } as Case

    beforeEach(async () => {
      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should send notifications to prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Fyrirtaka í máli: ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur staðfest fyrirtökutíma fyrir kröfu um gæsluvarðhald.<br /><br />Fyrirtaka mun fara fram á ótilgreindum tíma.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Verjandi sakbornings: ${defender.name}. Hægt er að nálgast yfirlitssíðu málsins í <a href="${mockConfig.clientUrl}${PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE}/${caseId}">Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Fyrirtaka í máli ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur hefur boðað þig í fyrirtöku sem verjanda sakbornings.<br /><br />Fyrirtaka mun fara fram á ótilgreindum tíma.<br /><br />Málsnúmer: ${courtCaseNumber}.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari: .<br /><br />Sækjandi: ${prosecutor.name} (). Hægt er að nálgast yfirlitssíðu málsins í <a href="${mockConfig.clientUrl}${DEFENDER_REQUEST_CASE_ROUTE}/${caseId}">Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Yfirlit máls ${courtCaseNumber}`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('link not sent to defender', () => {
    let then: Then

    const notificationDto: CaseNotificationDto = {
      user: { id: userId } as User,
      userDescriptor: { name: userName },
      type: RequestCaseNotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      court: { name: courtName },
      courtCaseNumber,
      defenderName: defender.name,
      defenderEmail: defender.email,
    } as Case

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)

      then = await givenWhenThen(
        {
          ...theCase,
          notifications: [
            {
              caseId,
              type: TrackedNotificationType.READY_FOR_COURT,
              recipients: [{ address: defender.email, success: true }],
            },
          ],
        } as Case,
        notificationDto,
      )
    })

    it('should not send link to case to defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Yfirlit máls ${courtCaseNumber}`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('the court date is sent again', () => {
    const notificationDto: CaseNotificationDto = {
      user: { id: userId } as User,
      userDescriptor: { name: userName },
      type: RequestCaseNotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      court: { name: courtName },
      courtCaseNumber,
      defenderName: defender.name,
      defenderEmail: defender.email,
      // The defender was notified the first time the court date was sent
      notifications: [
        {
          caseId,
          type: TrackedNotificationType.COURT_DATE,
          recipients: [{ address: defender.email, success: true }],
        },
      ],
    } as Case

    beforeEach(async () => {
      const mockCreate = mockNotificationModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce({} as Notification)

      await givenWhenThen(theCase, notificationDto)
    })

    it('should not send the link to the case to the defender again', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Yfirlit máls ${courtCaseNumber}`,
        }),
      )
    })

    it('should still send a calendar invitation to the defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Fyrirtaka í máli ${courtCaseNumber}`,
        }),
      )
    })
  })

  describe('the same advocate is registered more than once', () => {
    const notificationDto: CaseNotificationDto = {
      user: { id: userId } as User,
      userDescriptor: { name: userName },
      type: RequestCaseNotificationType.COURT_DATE,
    }

    const theCase = {
      id: caseId,
      type: CaseType.PHONE_TAPPING,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      court: { name: courtName },
      courtCaseNumber,
      // The defender is also the legal rights protector of one of the victims
      defenderName: defender.name,
      defenderEmail: defender.email,
      sessionArrangements: SessionArrangements.ALL_PRESENT,
      victims: [
        {
          lawyerName: victimLawyer.name,
          lawyerEmail: victimLawyer.email,
          lawyerAccessToRequest: RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED,
        },
        // Victims can share a lawyer
        {
          lawyerName: victimLawyer.name,
          lawyerEmail: victimLawyer.email,
          lawyerAccessToRequest: RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED,
        },
        {
          lawyerName: defender.name,
          lawyerEmail: defender.email,
          lawyerAccessToRequest: RequestSharedWhen.ARRAIGNMENT_DATE_ASSIGNED,
        },
      ],
    } as Case

    const countEmailsTo = (address: string) =>
      (mockEmailService.sendEmail as jest.Mock).mock.calls.filter(
        ([email]) => email.to[0].address === address,
      ).length

    beforeEach(async () => {
      await givenWhenThen(theCase, notificationDto)
    })

    it('should only send one calendar invitation to each advocate', () => {
      // A calendar invitation and a link to the case, but only once each
      expect(countEmailsTo(defender.email)).toBe(2)
      expect(countEmailsTo(victimLawyer.email)).toBe(2)
    })
  })
})
