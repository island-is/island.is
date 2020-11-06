import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { CaseState, NotificationType } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { User } from '../user'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case, Notification, SignatureResponse } from './models'
import { generateRequestPdf, generateRulingPdf, writeFile } from './pdf'
import { TransitionUpdate } from './case.state'

@Injectable()
export class CaseService {
  constructor(
    private readonly smsService: SmsService,
    private readonly signingService: SigningService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private constructHeadsUpSmsText(existingCase: Case, user: User): string {
    // Prosecutor
    const prosecutor = user ? ` Ákærandi: ${user.name}.` : ''

    // Arrest date
    const ad = existingCase.arrestDate?.toISOString()
    const adText = ad
      ? ` Viðkomandi handtekinn ${ad.substring(8, 10)}.${ad.substring(
          5,
          7,
        )}.${ad.substring(0, 4)} kl. ${ad.substring(11, 13)}:${ad.substring(
          14,
          16,
        )}.`
      : ''

    // Court date
    const cd = existingCase.requestedCourtDate?.toISOString()
    const cdText = cd
      ? ` ÓE fyrirtöku ${cd.substring(8, 10)}.${cd.substring(
          5,
          7,
        )}.${cd.substring(0, 4)} eftir kl. ${cd.substring(
          11,
          13,
        )}:${cd.substring(14, 16)}.`
      : ''

    return `Ný gæsluvarðhaldskrafa í vinnslu.${prosecutor}${adText}${cdText}`
  }

  private constructReadyForCourtpSmsText(
    existingCase: Case,
    user: User,
  ): string {
    // Prosecutor
    const prosecutor = user ? ` Ákærandi: ${user.name}.` : ''

    // Court
    const court = existingCase.court ? ` Dómstóll: ${existingCase.court}.` : ''

    return `Gæsluvarðhaldskrafa tilbúin til afgreiðslu.${prosecutor}${court}`
  }

  private async sendRulingAsSignedPdf(
    existingCase: Case,
    signedRulingPdf: string,
  ): Promise<void> {
    if (!environment.production) {
      writeFile(`${existingCase.id}-ruling-signed.pdf`, signedRulingPdf)
    }

    const requestPdf = await generateRequestPdf(existingCase)

    await this.emailService.sendEmail({
      from: {
        name: environment.email.fromName,
        address: environment.email.fromEmail,
      },
      replyTo: {
        name: environment.email.replyToName,
        address: environment.email.replyToEmail,
      },
      to: [
        {
          name: existingCase.prosecutor?.name,
          address: existingCase.prosecutor?.email,
        },
        {
          name: existingCase.judge?.name,
          address: existingCase.judge?.email,
        },
      ],
      subject: `Úrskurður í máli ${existingCase.courtCaseNumber}`,
      text: 'Sjá viðhengi',
      html: 'Sjá viðhengi',
      attachments: [
        {
          filename: `${existingCase.policeCaseNumber}.pdf`,
          content: requestPdf,
          encoding: 'binary',
        },
        {
          filename: `${existingCase.courtCaseNumber}.pdf`,
          content: signedRulingPdf,
          encoding: 'binary',
        },
      ],
    })
  }

  getAll(): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['modified', 'DESC']],
      include: [
        Notification,
        { model: User, as: 'prosecutor' },
        { model: User, as: 'judge' },
      ],
    })
  }

  findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case ${id}`)

    return this.caseModel.findOne({
      where: { id },
      include: [
        Notification,
        { model: User, as: 'prosecutor' },
        { model: User, as: 'judge' },
      ],
    })
  }

  create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.caseModel.create(caseToCreate)
  }

  async update(
    id: string,
    update: UpdateCaseDto | TransitionUpdate,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case ${id}`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  getAllNotificationsByCaseId(existingCase: Case): Promise<Notification[]> {
    this.logger.debug(`Getting all notifications for case ${existingCase.id}`)

    return this.notificationModel.findAll({
      where: { caseId: existingCase.id },
      order: [['created', 'DESC']],
    })
  }

  async sendNotificationByCaseId(
    existingCase: Case,
    user: User,
  ): Promise<Notification> {
    this.logger.debug(`Sending a notification for case ${existingCase.id}`)

    // This method should only be called if the case state is DRAFT or SUBMITTED

    const smsText =
      existingCase.state === CaseState.DRAFT
        ? this.constructHeadsUpSmsText(existingCase, user)
        : // State is CaseState.SUBMITTED
          this.constructReadyForCourtpSmsText(existingCase, user)

    // Production or local development with judge mobile number
    if (environment.production || environment.notifications.judgeMobileNumber) {
      await this.smsService.sendSms(
        environment.notifications.judgeMobileNumber,
        smsText,
      )
    }

    return this.notificationModel.create({
      caseId: existingCase.id,
      type:
        existingCase.state === CaseState.DRAFT
          ? NotificationType.HEADS_UP
          : // State is CaseState.SUBMITTED
            NotificationType.READY_FOR_COURT,
      message: smsText,
    })
  }

  async requestSignature(existingCase: Case): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case ${existingCase.id}`,
    )

    // This method should only be called if the csae state is ACCEPTED or REJECTED

    const pdf = await generateRulingPdf(existingCase)

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      return this.signingService.requestSignature(
        existingCase.judge.mobileNumber,
        'Undirrita dóm - Öryggistala',
        existingCase.judge.name,
        'Ísland',
        'ruling.pdf',
        pdf,
      )
    }

    // Development without signing service access token
    return {
      controlCode: '0000',
      documentToken: 'DEVELOPMENT',
    }
  }

  async confirmSignature(
    existingCase: Case,
    documentToken: string,
  ): Promise<SignatureResponse> {
    this.logger.debug(
      `Confirming signature of ruling for case ${existingCase.id}`,
    )

    // This method should only be called if the csae state is ACCEPTED or REJECTED and
    // requestSignature has previously been called for the same case

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const signedPdf = await this.signingService.getSignedDocument(
          'ruling.pdf',
          documentToken,
        )

        await this.sendRulingAsSignedPdf(existingCase, signedPdf)
      } catch (error) {
        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    return {
      documentSigned: true,
    }
  }
}
