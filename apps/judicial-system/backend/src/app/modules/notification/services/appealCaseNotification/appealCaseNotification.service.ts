import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { IntlService } from '@island.is/cms-translations'
import { EmailService } from '@island.is/email-service'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'
import { SmsService } from '@island.is/nova-sms'

import {
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  DEFENDER_INDICTMENT_CASE_ROUTE,
  ROUTE_HANDLER_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  applyDativeCaseToCourtName,
  formatDate,
  getAppealResultTextByValue,
} from '@island.is/judicial-system/formatters'
import {
  AppealCaseNotificationType,
  AppealCaseRulingDecision,
  CaseDecision,
  CaseState,
  CaseType,
  getStatementDeadline,
  isDefenceUser,
  isIndictmentCase,
  isProsecutionUser,
  isRestrictionCase,
  TrackedNotificationType,
  type User,
} from '@island.is/judicial-system/types'

import {
  formatCourtOfAppealJudgeAssignedEmailNotification,
  formatDefenderRoute,
} from '../../../../formatters'
import { notifications } from '../../../../messages'
import { CourtService } from '../../../court'
import { DefendantService } from '../../../defendant'
import { EventService } from '../../../event'
import { type Case, Notification, Recipient } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'
import { notificationModuleConfig } from '../../notification.config'
import { BaseNotificationService } from '../baseNotification.service'
import { strings } from './appealCaseNotification.strings'

interface RecipientInfo {
  name?: string
  email?: string
}

@Injectable()
export class AppealCaseNotificationService extends BaseNotificationService {
  constructor(
    @InjectModel(Notification)
    notificationModel: typeof Notification,
    @Inject(notificationModuleConfig.KEY)
    config: ConfigType<typeof notificationModuleConfig>,
    @Inject(LOGGER_PROVIDER) logger: Logger,
    intlService: IntlService,
    emailService: EmailService,
    eventService: EventService,
    courtService: CourtService,
    private readonly smsService: SmsService,
    private readonly defendantService: DefendantService,
  ) {
    super(
      notificationModel,
      emailService,
      intlService,
      courtService,
      config,
      eventService,
      logger,
    )
  }

  private async shouldSendNotificationToPrison(
    theCase: Case,
  ): Promise<boolean> {
    if (theCase.type === CaseType.CUSTODY) {
      return true
    }

    if (
      theCase.type !== CaseType.ADMISSION_TO_FACILITY &&
      theCase.type !== CaseType.PAROLE_REVOCATION
    ) {
      return false
    }

    if (theCase.defendants && theCase.defendants[0]?.noNationalId) {
      return true
    }

    return this.defendantService.isDefendantInActiveCustody(theCase.defendants)
  }

  private getCourtAssistantMobileNumbers(courtId?: string) {
    return (
      (courtId && this.config.sms.courtsAssistantMobileNumbers[courtId]) ??
      undefined
    )
  }

  private getCourtEmail(courtId?: string) {
    return (courtId && this.config.email.courtsEmails[courtId]) ?? undefined
  }

  private getIndictmentDefenceRecipients(
    theCase: Case,
    excludeNationalId?: string,
  ) {
    const recipients: {
      name?: string
      email?: string
      nationalId?: string
    }[] = []
    const seen = new Set<string>()

    // Collect defenders from defendants
    if (theCase.defendants) {
      for (const defendant of theCase.defendants) {
        if (
          defendant.isDefenderChoiceConfirmed &&
          defendant.defenderEmail &&
          !seen.has(defendant.defenderEmail)
        ) {
          if (
            excludeNationalId &&
            defendant.defenderNationalId === excludeNationalId
          ) {
            continue
          }
          seen.add(defendant.defenderEmail)
          recipients.push({
            name: defendant.defenderName ?? undefined,
            email: defendant.defenderEmail,
            nationalId: defendant.defenderNationalId ?? undefined,
          })
        }
      }
    }

    // Collect civil claimant spokespersons
    if (theCase.civilClaimants) {
      for (const civilClaimant of theCase.civilClaimants) {
        if (
          civilClaimant.isSpokespersonConfirmed &&
          civilClaimant.hasSpokesperson &&
          civilClaimant.spokespersonEmail &&
          !seen.has(civilClaimant.spokespersonEmail)
        ) {
          if (
            excludeNationalId &&
            civilClaimant.spokespersonNationalId === excludeNationalId
          ) {
            continue
          }
          seen.add(civilClaimant.spokespersonEmail)
          recipients.push({
            name: civilClaimant.spokespersonName ?? undefined,
            email: civilClaimant.spokespersonEmail,
            nationalId: civilClaimant.spokespersonNationalId ?? undefined,
          })
        }
      }
    }

    return recipients
  }

  private async sendSms(
    smsText: string,
    mobileNumbers?: string,
  ): Promise<Recipient> {
    if (!this.config.production && !mobileNumbers) {
      return { address: mobileNumbers, success: true }
    }

    smsText = smsText.match(/rettarvorslugatt.island.is/g)
      ? smsText
      : `${smsText} ${this.formatMessage(notifications.smsTail)}`

    return this.smsService
      .sendSms(mobileNumbers?.split(',') ?? '', smsText)
      .then(() => ({ address: mobileNumbers, success: true }))
      .catch((reason) => {
        this.logger.error('Failed to send sms', { error: reason })

        this.eventService.postErrorEvent(
          'Failed to send sms',
          { mobileNumbers },
          reason,
        )

        return { address: mobileNumbers, success: false }
      })
  }

  private async sendCourtOfAppealJudgeAssignedNotification(
    theCase: Case,
    userIds?: string[],
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []
    const recipientRoles = [
      theCase.appealCase?.appealAssistant,
      theCase.appealCase?.appealJudge1,
      theCase.appealCase?.appealJudge2,
      theCase.appealCase?.appealJudge3,
    ]

    recipientRoles.forEach((recipient) => {
      if (
        theCase.appealCase?.appealCaseNumber &&
        recipient &&
        userIds?.includes(recipient.id) &&
        theCase.appealCase?.appealJudge1?.name
      ) {
        const { subject, body } =
          formatCourtOfAppealJudgeAssignedEmailNotification(
            this.formatMessage,
            theCase.appealCase?.appealCaseNumber,
            recipient.id === theCase.appealCase?.appealJudge1Id,
            theCase.appealCase?.appealJudge1.name,
            recipient.role,
            `${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}`,
          )

        promises.push(
          this.sendEmail({
            subject,
            html: body,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
          }),
        )
      }
    })

    const recipients = await Promise.all(promises)

    if (recipients.length > 0) {
      return this.recordNotification(
        theCase.id,
        TrackedNotificationType.APPEAL_JUDGES_ASSIGNED,
        recipients,
      )
    }

    return { delivered: true }
  }
  //#endregion

  //#region APPEAL_TO_COURT_OF_APPEALS notifications
  private async sendAppealToCourtOfAppealsNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    if (isIndictmentCase(theCase.type)) {
      return this.sendIndictmentAppealToCourtOfAppealsNotifications(
        theCase,
        user,
      )
    }

    const subject = this.formatMessage(
      strings.caseAppealedToCourtOfAppeals.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html = this.formatMessage(strings.caseAppealedToCourtOfAppeals.body, {
      userHasAccessToRVG: true,
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })
    const smsText = this.formatMessage(
      strings.caseAppealedToCourtOfAppeals.text,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const promises = [
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.judge?.name,
        recipientEmail: theCase.judge?.email,
      }),
    ]

    const courtEmail = this.getCourtEmail(theCase.courtId)
    if (courtEmail) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.court?.name,
          recipientEmail: courtEmail,
        }),
      )
    }

    if (theCase.registrar) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.registrar.name,
          recipientEmail: theCase.registrar.email,
        }),
      )
    }

    if (isDefenceUser(user)) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
      promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))
    }

    if (isProsecutionUser(user) && theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        strings.caseAppealedToCourtOfAppeals.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,

          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    promises.push(
      this.sendSms(
        smsText,
        this.getCourtAssistantMobileNumbers(theCase.courtId),
      ),
    )

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_TO_COURT_OF_APPEALS,
      recipients,
    )
  }
  private async sendIndictmentAppealToCourtOfAppealsNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const subject = this.formatMessage(
      strings.caseAppealedToCourtOfAppeals.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )
    const html = this.formatMessage(strings.caseAppealedToCourtOfAppeals.body, {
      userHasAccessToRVG: true,
      courtCaseNumber: theCase.courtCaseNumber,
      linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
      linkEnd: '</a>',
    })
    const smsText = this.formatMessage(
      strings.caseAppealedToCourtOfAppeals.text,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const promises = [
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.judge?.name,
        recipientEmail: theCase.judge?.email,
      }),
    ]

    const courtEmail = this.getCourtEmail(theCase.courtId)
    if (courtEmail) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.court?.name,
          recipientEmail: courtEmail,
        }),
      )
    }

    if (theCase.registrar) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.registrar.name,
          recipientEmail: theCase.registrar.email,
        }),
      )
    }

    if (isDefenceUser(user)) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
      promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))

      const defenceRecipients = this.getIndictmentDefenceRecipients(
        theCase,
        theCase.appealCase?.appealedByNationalId,
      )

      for (const recipient of defenceRecipients) {
        const defenderUrl = recipient.nationalId
          ? `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
          : undefined
        const defenderHtml = this.formatMessage(
          strings.caseAppealedToCourtOfAppeals.body,
          {
            userHasAccessToRVG: Boolean(defenderUrl),
            courtCaseNumber: theCase.courtCaseNumber,
            linkStart: `<a href="${defenderUrl}">`,
            linkEnd: '</a>',
          },
        )

        promises.push(
          this.sendEmail({
            subject,
            html: defenderHtml,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    if (isProsecutionUser(user)) {
      const defenceRecipients = this.getIndictmentDefenceRecipients(theCase)

      for (const recipient of defenceRecipients) {
        const defenderUrl = recipient.nationalId
          ? `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
          : undefined
        const defenderHtml = this.formatMessage(
          strings.caseAppealedToCourtOfAppeals.body,
          {
            userHasAccessToRVG: Boolean(defenderUrl),
            court: applyDativeCaseToCourtName(
              theCase.court?.name || 'héraðsdómi',
            ),
            courtCaseNumber: theCase.courtCaseNumber,
            linkStart: `<a href="${defenderUrl}">`,
            linkEnd: '</a>',
          },
        )

        promises.push(
          this.sendEmail({
            subject,
            html: defenderHtml,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    promises.push(
      this.sendSms(
        smsText,
        this.getCourtAssistantMobileNumbers(theCase.courtId),
      ),
    )

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_TO_COURT_OF_APPEALS,
      recipients,
    )
  }

  //#endregion

  //#region APPEAL_RECEIVED_BY_COURT notifications
  private async sendAppealReceivedByCourtNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    if (isIndictmentCase(theCase.type)) {
      return this.sendIndictmentAppealReceivedByCourtNotifications(theCase)
    }

    const statementDeadline =
      theCase.appealCase?.appealReceivedByCourtDate &&
      getStatementDeadline(theCase.appealCase?.appealReceivedByCourtDate)

    const subject = this.formatMessage(
      strings.caseAppealReceivedByCourt.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const html = this.formatMessage(
      strings.caseAppealReceivedByCourt.courtOfAppealsBody,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
        linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    const smsText = this.formatMessage(strings.caseAppealReceivedByCourt.text, {
      courtCaseNumber: theCase.courtCaseNumber,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })

    const courtOfAppealsAssistantEmails =
      this.config.email.courtOfAppealsAssistantEmails
        .split(',')
        .map((email: string) => email.trim())

    const allCourtOfAppealsEmails = [
      ...courtOfAppealsAssistantEmails,
      this.getCourtEmail(this.config.courtOfAppealsId),
    ]

    const promises = allCourtOfAppealsEmails.map((email) =>
      this.sendEmail({
        subject,
        html,
        recipientName: this.formatMessage(
          notifications.emailNames.courtOfAppeals,
        ),
        recipientEmail: email,
      }),
    )

    const prosecutorHtml = this.formatMessage(
      strings.caseAppealReceivedByCourt.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
        linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    promises.push(
      this.sendEmail({
        subject,
        html: prosecutorHtml,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
    )

    if (theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        strings.caseAppealReceivedByCourt.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          statementDeadline: formatDate(statementDeadline, 'PPPp'),
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,

          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_RECEIVED_BY_COURT,
      recipients,
    )
  }
  private async sendIndictmentAppealReceivedByCourtNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    const statementDeadline =
      theCase.appealCase?.appealReceivedByCourtDate &&
      getStatementDeadline(theCase.appealCase?.appealReceivedByCourtDate)

    const subject = this.formatMessage(
      strings.caseAppealReceivedByCourt.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
      },
    )

    const html = this.formatMessage(
      strings.caseAppealReceivedByCourt.courtOfAppealsBody,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
        linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    const smsText = this.formatMessage(strings.caseAppealReceivedByCourt.text, {
      courtCaseNumber: theCase.courtCaseNumber,
      statementDeadline: formatDate(statementDeadline, 'PPPp'),
    })

    const courtOfAppealsAssistantEmails =
      this.config.email.courtOfAppealsAssistantEmails
        .split(',')
        .map((email: string) => email.trim())

    const allCourtOfAppealsEmails = [
      ...courtOfAppealsAssistantEmails,
      this.getCourtEmail(this.config.courtOfAppealsId),
    ]

    const promises = allCourtOfAppealsEmails.map((email) =>
      this.sendEmail({
        subject,
        html,
        recipientName: this.formatMessage(
          notifications.emailNames.courtOfAppeals,
        ),
        recipientEmail: email,
      }),
    )

    const prosecutorHtml = this.formatMessage(
      strings.caseAppealReceivedByCourt.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        statementDeadline: formatDate(statementDeadline, 'PPPp'),
        linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    promises.push(
      this.sendEmail({
        subject,
        html: prosecutorHtml,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
    )

    const defenceRecipients = this.getIndictmentDefenceRecipients(theCase)

    for (const recipient of defenceRecipients) {
      const defenderUrl = recipient.nationalId
        ? `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
        : undefined
      const defenderHtml = this.formatMessage(
        strings.caseAppealReceivedByCourt.body,
        {
          userHasAccessToRVG: Boolean(defenderUrl),
          courtCaseNumber: theCase.courtCaseNumber,
          statementDeadline: formatDate(statementDeadline, 'PPPp'),
          linkStart: `<a href="${defenderUrl}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          skipTail: !recipient.nationalId,
        }),
      )
    }

    promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_RECEIVED_BY_COURT,
      recipients,
    )
  }

  //#endregion

  //#region APPEAL_RULING_ACCEPTED notifications
  private async sendIndictmentAppealStatementNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const subject = this.formatMessage(strings.caseAppealStatement.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
      appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
    })

    const promises: Promise<Recipient>[] = []

    // CoA team notification (case-type-agnostic)
    if (theCase.appealCase?.appealCaseNumber) {
      const courtOfAppealsHtml = this.formatMessage(
        strings.caseAppealStatement.body,
        {
          userHasAccessToRVG: true,
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      if (theCase.appealCase?.appealAssistant) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealAssistant.name,
            recipientEmail: theCase.appealCase?.appealAssistant.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge1) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealJudge1.name,
            recipientEmail: theCase.appealCase?.appealJudge1.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge2) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealJudge2.name,
            recipientEmail: theCase.appealCase?.appealJudge2.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge3) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealJudge3.name,
            recipientEmail: theCase.appealCase?.appealJudge3.email,
          }),
        )
      }
    }

    if (isDefenceUser(user)) {
      const prosecutorHtml = this.formatMessage(
        strings.caseAppealStatement.body,
        {
          userHasAccessToRVG: true,
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: prosecutorHtml,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )

      const defenceRecipients = this.getIndictmentDefenceRecipients(
        theCase,
        user.nationalId,
      )

      for (const recipient of defenceRecipients) {
        const defenderUrl = recipient.nationalId
          ? `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
          : undefined
        const defenderHtml = this.formatMessage(
          strings.caseAppealStatement.body,
          {
            userHasAccessToRVG: Boolean(defenderUrl),
            courtCaseNumber: theCase.courtCaseNumber,
            appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
            linkStart: `<a href="${defenderUrl}">`,
            linkEnd: '</a>',
          },
        )

        promises.push(
          this.sendEmail({
            subject,
            html: defenderHtml,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    if (isProsecutionUser(user)) {
      const defenceRecipients = this.getIndictmentDefenceRecipients(theCase)

      for (const recipient of defenceRecipients) {
        const defenderUrl = recipient.nationalId
          ? `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
          : undefined
        const defenderHtml = this.formatMessage(
          strings.caseAppealStatement.body,
          {
            userHasAccessToRVG: Boolean(defenderUrl),
            courtCaseNumber: theCase.courtCaseNumber,
            appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
            linkStart: `<a href="${defenderUrl}">`,
            linkEnd: '</a>',
          },
        )

        promises.push(
          this.sendEmail({
            subject,
            html: defenderHtml,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    if (promises.length === 0) {
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_STATEMENT,
      recipients,
    )
  }

  private async sendAppealStatementNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    if (isIndictmentCase(theCase.type)) {
      return this.sendIndictmentAppealStatementNotifications(theCase, user)
    }

    const subject = this.formatMessage(strings.caseAppealStatement.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
      appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
    })

    const promises = []

    if (theCase.appealCase?.appealCaseNumber) {
      const courtOfAppealsHtml = this.formatMessage(
        strings.caseAppealStatement.body,
        {
          userHasAccessToRVG: true,
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber,
          linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      if (theCase.appealCase?.appealAssistant) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealAssistant.name,
            recipientEmail: theCase.appealCase?.appealAssistant.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge1) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealJudge1.name,
            recipientEmail: theCase.appealCase?.appealJudge1.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge2) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealJudge2.name,
            recipientEmail: theCase.appealCase?.appealJudge2.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge3) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealsHtml,
            recipientName: theCase.appealCase?.appealJudge3.name,
            recipientEmail: theCase.appealCase?.appealJudge3.email,
          }),
        )
      }
    }

    if (isDefenceUser(user)) {
      const prosecutorHtml = this.formatMessage(
        strings.caseAppealStatement.body,
        {
          userHasAccessToRVG: true,
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: prosecutorHtml,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
    }

    if (isProsecutionUser(user)) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        strings.caseAppealStatement.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,

          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    if (promises.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_STATEMENT,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_CASE_FILES_UPDATED notifications
  private async sendIndictmentAppealCaseFilesUpdatedNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const courtOfAppealUsers = [
      theCase.appealCase?.appealJudge1,
      theCase.appealCase?.appealJudge2,
      theCase.appealCase?.appealJudge3,
      theCase.appealCase?.appealAssistant,
    ]

    const promises: Promise<Recipient>[] = []

    const subject = this.formatMessage(
      strings.caseAppealCaseFilesUpdated.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
      },
    )

    const courtOfAppealHtml = this.formatMessage(
      strings.caseAppealCaseFilesUpdated.body,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
        linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    courtOfAppealUsers.forEach((user) => {
      if (user) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealHtml,
            recipientName: user.name,
            recipientEmail: user.email,
          }),
        )
      }
    })

    if (isDefenceUser(user)) {
      const prosecutorHtml = this.formatMessage(
        strings.caseAppealCaseFilesUpdated.body,
        {
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: prosecutorHtml,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )

      const defenceRecipients = this.getIndictmentDefenceRecipients(
        theCase,
        user.nationalId,
      )

      for (const recipient of defenceRecipients) {
        const defenderUrl = `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
        const defenderHtml = this.formatMessage(
          strings.caseAppealCaseFilesUpdated.body,
          {
            courtCaseNumber: theCase.courtCaseNumber,
            appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
            linkStart: `<a href="${defenderUrl}">`,
            linkEnd: '</a>',
          },
        )

        promises.push(
          this.sendEmail({
            subject,
            html: defenderHtml,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    if (isProsecutionUser(user)) {
      const defenceRecipients = this.getIndictmentDefenceRecipients(theCase)

      for (const recipient of defenceRecipients) {
        const defenderUrl = `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
        const defenderHtml = this.formatMessage(
          strings.caseAppealCaseFilesUpdated.body,
          {
            courtCaseNumber: theCase.courtCaseNumber,
            appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
            linkStart: `<a href="${defenderUrl}">`,
            linkEnd: '</a>',
          },
        )

        promises.push(
          this.sendEmail({
            subject,
            html: defenderHtml,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    if (promises.length === 0) {
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_CASE_FILES_UPDATED,
      recipients,
    )
  }

  private async sendAppealCaseFilesUpdatedNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    if (isIndictmentCase(theCase.type)) {
      return this.sendIndictmentAppealCaseFilesUpdatedNotifications(
        theCase,
        user,
      )
    }

    const courtOfAppealUsers = [
      theCase.appealCase?.appealJudge1,
      theCase.appealCase?.appealJudge2,
      theCase.appealCase?.appealJudge3,
      theCase.appealCase?.appealAssistant,
    ]

    const promises: Promise<Recipient>[] = []

    const subject = this.formatMessage(
      strings.caseAppealCaseFilesUpdated.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
      },
    )

    const courtOfAppealHtml = this.formatMessage(
      strings.caseAppealCaseFilesUpdated.body,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
        linkStart: `<a href="${this.config.clientUrl}${COURT_OF_APPEAL_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    courtOfAppealUsers.forEach((user) => {
      if (user) {
        promises.push(
          this.sendEmail({
            subject,
            html: courtOfAppealHtml,
            recipientName: user.name,
            recipientEmail: user.email,
          }),
        )
      }
    })

    if (isDefenceUser(user)) {
      const prosecutorHtml = this.formatMessage(
        strings.caseAppealCaseFilesUpdated.body,
        {
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber ?? 'NONE',
          linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: prosecutorHtml,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )
    }

    if (promises.length === 0) {
      // Nothing to send
      return { delivered: true }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_CASE_FILES_UPDATED,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_COMPLETED notifications
  private async sendIndictmentAppealCompletedResultNotifications(
    theCase: Case,
  ): Promise<Recipient[]> {
    const isReopened = Boolean(theCase.appealCase?.appealRulingModifiedHistory)
    const promises: Promise<Recipient>[] = []

    const subject = this.formatMessage(
      isReopened
        ? strings.caseAppealResent.subject
        : strings.caseAppealCompleted.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber,
      },
    )

    // District court judge — same as request cases
    const judgeHtml = this.formatMessage(
      isReopened
        ? strings.caseAppealResent.body
        : strings.caseAppealCompleted.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber,
        appealRulingDecision: getAppealResultTextByValue(
          theCase.appealCase?.appealRulingDecision,
        ),
        linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    promises.push(
      this.sendEmail({
        subject,
        html: judgeHtml,
        recipientName: theCase.judge?.name,
        recipientEmail: theCase.judge?.email,
      }),
    )

    // Prosecutor — use ROUTE_HANDLER_ROUTE
    const prosecutorHtml = this.formatMessage(
      isReopened
        ? strings.caseAppealResent.body
        : strings.caseAppealCompleted.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber,
        appealRulingDecision: getAppealResultTextByValue(
          theCase.appealCase?.appealRulingDecision,
        ),
        linkStart: `<a href="${this.config.clientUrl}${ROUTE_HANDLER_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    promises.push(
      this.sendEmail({
        subject,
        html: prosecutorHtml,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
    )

    // Skip prison admin and prison — not relevant for indictment cases

    // Notify ALL defenders and civil claimant lawyers
    const defenceRecipients = this.getIndictmentDefenceRecipients(theCase)

    for (const recipient of defenceRecipients) {
      const defenderUrl = recipient.nationalId
        ? `${this.config.clientUrl}${DEFENDER_INDICTMENT_CASE_ROUTE}/${theCase.id}`
        : undefined
      const defenderHtml = this.formatMessage(
        isReopened
          ? strings.caseAppealResent.body
          : strings.caseAppealCompleted.body,
        {
          userHasAccessToRVG: Boolean(defenderUrl),
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber,
          appealRulingDecision: getAppealResultTextByValue(
            theCase.appealCase?.appealRulingDecision,
          ),
          linkStart: `<a href="${defenderUrl}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          skipTail: !recipient.nationalId,
        }),
      )
    }

    return Promise.all(promises)
  }

  private async sendAppealCompletedResultNotifications(
    theCase: Case,
  ): Promise<Recipient[]> {
    if (isIndictmentCase(theCase.type)) {
      return this.sendIndictmentAppealCompletedResultNotifications(theCase)
    }

    const isReopened = Boolean(theCase.appealCase?.appealRulingModifiedHistory)
    const promises = []

    const subject = this.formatMessage(
      isReopened
        ? strings.caseAppealResent.subject
        : strings.caseAppealCompleted.subject,
      {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber,
      },
    )

    const html = this.formatMessage(
      isReopened
        ? strings.caseAppealResent.body
        : strings.caseAppealCompleted.body,
      {
        userHasAccessToRVG: true,
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber,
        appealRulingDecision: getAppealResultTextByValue(
          theCase.appealCase?.appealRulingDecision,
        ),
        linkStart: `<a href="${this.config.clientUrl}${SIGNED_VERDICT_OVERVIEW_ROUTE}/${theCase.id}">`,
        linkEnd: '</a>',
      },
    )

    promises.push(
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.judge?.name,
        recipientEmail: theCase.judge?.email,
      }),
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
    )

    if (
      isRestrictionCase(theCase.type) &&
      theCase.state === CaseState.ACCEPTED
    ) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: this.formatMessage(
            notifications.emailNames.prisonAdmin,
          ),
          recipientEmail: this.config.email.prisonAdminEmail,
        }),
      )
    }

    if (
      theCase.decision === CaseDecision.ACCEPTING ||
      theCase.decision === CaseDecision.ACCEPTING_PARTIALLY
    ) {
      const shouldSendNotificationToPrison =
        await this.shouldSendNotificationToPrison(theCase)

      if (shouldSendNotificationToPrison) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: this.formatMessage(notifications.emailNames.prison),
            recipientEmail: this.config.email.prisonEmail,
          }),
        )
      }
    }

    if (theCase.defenderEmail) {
      const url =
        theCase.defenderNationalId &&
        formatDefenderRoute(this.config.clientUrl, theCase.type, theCase.id)
      const defenderHtml = this.formatMessage(
        strings.caseAppealCompleted.body,
        {
          userHasAccessToRVG: Boolean(url),
          court: applyDativeCaseToCourtName(
            theCase.court?.name || 'héraðsdómi',
          ),
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber,
          appealRulingDecision: getAppealResultTextByValue(
            theCase.appealCase?.appealRulingDecision,
          ),
          linkStart: `<a href="${url}">`,
          linkEnd: '</a>',
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: theCase.defenderName,
          recipientEmail: theCase.defenderEmail,
          skipTail: !theCase.defenderNationalId,
        }),
      )
    }

    if (!isReopened) {
      const smsText = this.formatMessage(strings.caseAppealCompleted.text, {
        courtCaseNumber: theCase.courtCaseNumber,
        appealCaseNumber: theCase.appealCase?.appealCaseNumber,
        appealRulingDecision: getAppealResultTextByValue(
          theCase.appealCase?.appealRulingDecision,
        ),
      })
      promises.push(this.sendSms(smsText, theCase.prosecutor?.mobileNumber))
    }

    return Promise.all(promises)
  }

  private async sendIndictmentAppealDiscontinuedNotifications(
    theCase: Case,
  ): Promise<Recipient[]> {
    const promises: Promise<Recipient>[] = []

    const subject = this.formatMessage(strings.caseAppealDiscontinued.subject, {
      appealCaseNumber: theCase.appealCase?.appealCaseNumber,
      courtCaseNumber: theCase.courtCaseNumber,
    })
    const html = this.formatMessage(strings.caseAppealDiscontinued.body, {
      courtCaseNumber: theCase.courtCaseNumber,
      appealCaseNumber: theCase.appealCase?.appealCaseNumber,
    })

    // Notify prosecutor
    promises.push(
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
    )

    // Notify ALL defenders and civil claimant lawyers
    const defenceRecipients = this.getIndictmentDefenceRecipients(theCase)

    for (const recipient of defenceRecipients) {
      const defenderHtml = this.formatMessage(
        strings.caseAppealDiscontinued.body,
        {
          courtCaseNumber: theCase.courtCaseNumber,
          appealCaseNumber: theCase.appealCase?.appealCaseNumber,
        },
      )

      promises.push(
        this.sendEmail({
          subject,
          html: defenderHtml,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          skipTail: !recipient.nationalId,
        }),
      )
    }

    return Promise.all(promises)
  }

  private async sendAppealDiscontinuedNotifications(
    theCase: Case,
  ): Promise<Recipient[]> {
    if (isIndictmentCase(theCase.type)) {
      return this.sendIndictmentAppealDiscontinuedNotifications(theCase)
    }

    const promises = []

    const subject = this.formatMessage(strings.caseAppealDiscontinued.subject, {
      appealCaseNumber: theCase.appealCase?.appealCaseNumber,
      courtCaseNumber: theCase.courtCaseNumber,
    })
    const html = this.formatMessage(strings.caseAppealDiscontinued.body, {
      courtCaseNumber: theCase.courtCaseNumber,
      appealCaseNumber: theCase.appealCase?.appealCaseNumber,
    })

    promises.push(
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.prosecutor?.name,
        recipientEmail: theCase.prosecutor?.email,
      }),
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.defenderName,
        recipientEmail: theCase.defenderEmail,
        skipTail: !theCase.defenderNationalId,
      }),
    )

    return Promise.all(promises)
  }

  private async sendAppealCompletedNotifications(
    theCase: Case,
  ): Promise<DeliverResponse> {
    let recipients: Recipient[] = []
    if (
      theCase.appealCase?.appealRulingDecision ===
      AppealCaseRulingDecision.DISCONTINUED
    ) {
      recipients = await this.sendAppealDiscontinuedNotifications(theCase)
    } else {
      recipients = await this.sendAppealCompletedResultNotifications(theCase)
    }

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_COMPLETED,
      recipients,
    )
  }
  //#endregion

  //#region APPEAL_WITHDRAWN notifications
  private async sendIndictmentAppealWithdrawnNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    const promises: Promise<Recipient>[] = []
    const wasWithdrawnByProsecution = isProsecutionUser(user)

    const subject = this.formatMessage(strings.caseAppealWithdrawn.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })
    const html = this.formatMessage(strings.caseAppealWithdrawn.body, {
      withdrawnByProsecution: wasWithdrawnByProsecution ?? false,
      courtCaseNumber: theCase.courtCaseNumber,
    })

    // Notify district court judge
    promises.push(
      this.sendEmail({
        subject,
        html,
        recipientName: theCase.judge?.name,
        recipientEmail: theCase.judge?.email,
      }),
    )

    // Notify district court email
    const courtEmail = this.getCourtEmail(theCase.courtId)
    if (courtEmail) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.court?.name,
          recipientEmail: courtEmail,
        }),
      )
    }

    // Notify district court registrar (if assigned)
    if (theCase.registrar) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.registrar.name,
          recipientEmail: theCase.registrar.email,
        }),
      )
    }

    if (isProsecutionUser(user)) {
      // Notify ALL defenders and civil claimant lawyers
      const defenceRecipients = this.getIndictmentDefenceRecipients(theCase)

      for (const recipient of defenceRecipients) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    if (isDefenceUser(user)) {
      // Notify prosecutor
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: theCase.prosecutor?.name,
          recipientEmail: theCase.prosecutor?.email,
        }),
      )

      // Notify all OTHER defenders and civil claimant lawyers
      const defenceRecipients = this.getIndictmentDefenceRecipients(
        theCase,
        theCase.appealCase?.appealedByNationalId,
      )

      for (const recipient of defenceRecipients) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            skipTail: !recipient.nationalId,
          }),
        )
      }
    }

    // If appeal was already received by CoA → notify CoA email
    if (theCase.appealCase?.appealReceivedByCourtDate) {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: this.formatMessage(
            notifications.emailNames.courtOfAppeals,
          ),
          recipientEmail: this.getCourtEmail(this.config.courtOfAppealsId),
        }),
      )
    }

    // If judges assigned → notify CoA team
    const hasBeenAssigned = this.hasSentNotification(
      TrackedNotificationType.APPEAL_JUDGES_ASSIGNED,
      theCase.notifications,
    )

    if (hasBeenAssigned) {
      if (theCase.appealCase?.appealAssistant) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: theCase.appealCase.appealAssistant.name,
            recipientEmail: theCase.appealCase.appealAssistant.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge1) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: theCase.appealCase.appealJudge1.name,
            recipientEmail: theCase.appealCase.appealJudge1.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge2) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: theCase.appealCase.appealJudge2.name,
            recipientEmail: theCase.appealCase.appealJudge2.email,
          }),
        )
      }

      if (theCase.appealCase?.appealJudge3) {
        promises.push(
          this.sendEmail({
            subject,
            html,
            recipientName: theCase.appealCase.appealJudge3.name,
            recipientEmail: theCase.appealCase.appealJudge3.email,
          }),
        )
      }
    }

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_WITHDRAWN,
      recipients,
    )
  }

  private async sendAppealWithdrawnNotifications(
    theCase: Case,
    user: User,
  ): Promise<DeliverResponse> {
    if (isIndictmentCase(theCase.type)) {
      return this.sendIndictmentAppealWithdrawnNotifications(theCase, user)
    }

    const promises: Promise<Recipient>[] = []
    const wasWithdrawnByProsecution = isProsecutionUser(user)

    const subject = this.formatMessage(strings.caseAppealWithdrawn.subject, {
      courtCaseNumber: theCase.courtCaseNumber,
    })
    const html = this.formatMessage(strings.caseAppealWithdrawn.body, {
      withdrawnByProsecution: wasWithdrawnByProsecution ?? false,
      courtCaseNumber: theCase.courtCaseNumber,
    })

    const sendTo = this.getWithdrawnNotificationRecipients(
      theCase,
      user,
      wasWithdrawnByProsecution,
    )

    sendTo.forEach((recipient) => {
      promises.push(
        this.sendEmail({
          subject,
          html,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
        }),
      )
    })

    const recipients = await Promise.all(promises)

    return this.recordNotification(
      theCase.id,
      TrackedNotificationType.APPEAL_WITHDRAWN,
      recipients,
    )
  }

  private getWithdrawnNotificationRecipients(
    theCase: Case,
    user: User,
    wasWithdrawnByProsecution: boolean,
  ): RecipientInfo[] {
    const hasBeenAssigned = this.hasSentNotification(
      TrackedNotificationType.APPEAL_JUDGES_ASSIGNED,
      theCase.notifications,
    )

    const recipients = [
      {
        name: theCase.judge?.name,
        email: theCase.judge?.email,
      } as RecipientInfo,
    ]

    if (
      wasWithdrawnByProsecution &&
      theCase.defenderName &&
      theCase.defenderEmail
    ) {
      recipients.push({
        name: theCase.defenderName,
        email: theCase.defenderEmail,
      })
    } else if (isDefenceUser(user)) {
      recipients.push({
        name: theCase.prosecutor?.name,
        email: theCase.prosecutor?.email,
      })
    }

    recipients.push({
      name: theCase.court?.name,
      email: this.getCourtEmail(theCase.court?.id),
    })

    if (theCase.registrar) {
      recipients.push({
        name: theCase.registrar.name,
        email: theCase.registrar.email,
      })
    }

    if (theCase.appealCase?.appealReceivedByCourtDate) {
      recipients.push({
        name: this.formatMessage(notifications.emailNames.courtOfAppeals),
        email: this.getCourtEmail(this.config.courtOfAppealsId),
      })
    }

    if (hasBeenAssigned) {
      recipients.push(
        {
          name: theCase.appealCase?.appealAssistant?.name,
          email: theCase.appealCase?.appealAssistant?.email,
        },
        {
          name: theCase.appealCase?.appealJudge1?.name,
          email: theCase.appealCase?.appealJudge1?.email,
        },
        {
          name: theCase.appealCase?.appealJudge2?.name,
          email: theCase.appealCase?.appealJudge2?.email,
        },
        {
          name: theCase.appealCase?.appealJudge3?.name,
          email: theCase.appealCase?.appealJudge3?.email,
        },
      )
    }

    return recipients
  }

  //#region API
  private sendNotification(
    type: AppealCaseNotificationType,
    theCase: Case,
    user: User,
    userIds?: string[],
  ): Promise<DeliverResponse> {
    switch (type) {
      case AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS:
        return this.sendAppealToCourtOfAppealsNotifications(theCase, user)
      case AppealCaseNotificationType.APPEAL_RECEIVED_BY_COURT:
        return this.sendAppealReceivedByCourtNotifications(theCase)
      case AppealCaseNotificationType.APPEAL_STATEMENT:
        return this.sendAppealStatementNotifications(theCase, user)
      case AppealCaseNotificationType.APPEAL_COMPLETED:
        return this.sendAppealCompletedNotifications(theCase)
      case AppealCaseNotificationType.APPEAL_JUDGES_ASSIGNED:
        return this.sendCourtOfAppealJudgeAssignedNotification(theCase, userIds)
      case AppealCaseNotificationType.APPEAL_CASE_FILES_UPDATED:
        return this.sendAppealCaseFilesUpdatedNotifications(theCase, user)
      case AppealCaseNotificationType.APPEAL_WITHDRAWN:
        return this.sendAppealWithdrawnNotifications(theCase, user)
      default:
        throw new InternalServerErrorException(
          `Invalid appeal case notification type ${type}`,
        )
    }
  }

  async sendAppealCaseNotification(
    type: AppealCaseNotificationType,
    theCase: Case,
    user: User,
    userIds?: string[],
  ): Promise<DeliverResponse> {
    await this.refreshFormatMessage()

    try {
      return await this.sendNotification(type, theCase, user, userIds)
    } catch (error) {
      this.logger.error('Failed to send appeal case notification', error)

      return { delivered: false }
    }
  }
  //#endregion
}
