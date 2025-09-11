import { uuid } from 'uuidv4'

import { EmailService } from '@island.is/email-service'

import {
  CaseType,
  DateType,
  IndictmentCaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import {
  createTestingNotificationModule,
  createTestUsers,
} from '../../createTestingNotificationModule'

import { Case } from '../../../../repository'
import { IndictmentCaseNotificationDto } from '../../../dto/indictmentCaseNotification.dto'
import { DeliverResponse } from '../../../models/deliver.response'

jest.mock('../../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  notificationDto: IndictmentCaseNotificationDto,
) => Promise<Then>

describe('InternalNotificationController - Send indictment court date notifications', () => {
  const userName = 'Test'
  const caseId = uuid()

  const courtName = 'Héraðsdómur Reykjavíkur'
  const courtCaseNumber = uuid()

  const { prosecutor, defender } = createTestUsers(['prosecutor', 'defender'])

  let mockEmailService: EmailService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { emailService, internalNotificationController } =
      await createTestingNotificationModule()

    mockEmailService = emailService

    givenWhenThen = async (
      theCase: Case,
      notificationDto: IndictmentCaseNotificationDto,
    ) => {
      const then = {} as Then

      await internalNotificationController
        .sendIndictmentCaseNotification(caseId, theCase, notificationDto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('notification sent for indictment', () => {
    let then: Then

    const notificationDto: IndictmentCaseNotificationDto = {
      userDescriptor: { name: userName } as User,
      type: IndictmentCaseNotificationType.COURT_DATE,
    }

    const courtDate = new Date(2024, 4, 2, 14, 32)
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      defendants: [
        {
          defenderName: defender.name,
          defenderEmail: defender.email,
          isDefenderChoiceConfirmed: true,
        },
      ],
      court: { name: courtName },
      courtCaseNumber,
      dateLogs: [{ dateType: DateType.COURT_DATE, date: courtDate }],
    } as Case

    beforeEach(async () => {
      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should send notifications to prosecutor and defender', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Nýtt þinghald í máli ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur boðar til þinghalds í máli ${courtCaseNumber}.<br />Fyrirtaka mun fara fram 2. maí 2024, kl. 14:32.<br /><br />Tegund þinghalds: Óþekkt.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Hægt er að nálgast gögn málsins á <a href="http://localhost:4200/akaera/stadfesta/${caseId}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`,
        }),
      )

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
          subject: `Nýtt þinghald í máli ${courtCaseNumber}`,
          html: `Héraðsdómur Reykjavíkur boðar til þinghalds í máli ${courtCaseNumber}.<br />Fyrirtaka mun fara fram 2. maí 2024, kl. 14:32.<br /><br />Tegund þinghalds: Óþekkt.<br /><br />Dómsalur hefur ekki verið skráður.<br /><br />Dómari hefur ekki verið skráður.<br /><br />Hægt er að nálgast gögn málsins hjá Héraðsdómur Reykjavíkur.`,
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('notification not sent for indictment', () => {
    let then: Then

    const notificationDto: IndictmentCaseNotificationDto = {
      userDescriptor: { name: userName } as User,
      type: IndictmentCaseNotificationType.COURT_DATE,
    }

    const courtDate = new Date(2024, 4, 2, 14, 32)
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      prosecutor: { name: prosecutor.name, email: prosecutor.email },
      defendants: [
        {
          defenderName: defender.name,
          defenderEmail: defender.email,
          isDefenderChoiceConfirmed: false,
        },
      ],
      court: { name: courtName },
      courtCaseNumber,
      dateLogs: [{ dateType: DateType.COURT_DATE, date: courtDate }],
    } as Case

    beforeEach(async () => {
      then = await givenWhenThen(theCase, notificationDto)
    })

    it('should not send notification to unconfirmed defender', () => {
      expect(mockEmailService.sendEmail).not.toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: defender.name, address: defender.email }],
        }),
      )

      expect(then.result).toEqual({ delivered: true })
    })
  })
})
