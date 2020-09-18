import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'

import { environment } from '../../../environments'
import { User } from '../user'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case, Notification, NotificationType, CaseState } from './models'

@Injectable()
export class CaseService {
  constructor(
    private readonly smsService: SmsService,
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['modified', 'DESC']],
      include: [Notification],
    })
  }

  findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case with id "${id}"`)

    return this.caseModel.findOne({
      where: { id },
      include: [Notification],
    })
  }

  create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug(`Creating case ${caseToCreate}`)

    return this.caseModel.create(caseToCreate)
  }

  async update(
    id: string,
    caseToUpdate: UpdateCaseDto,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case whith id "${id}"`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      caseToUpdate,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  async getAllNotificationsByCaseId(
    existingCase: Case,
  ): Promise<Notification[]> {
    this.logger.debug(
      `Getting all notifications for case with id "${existingCase.id}"`,
    )

    return this.notificationModel.findAll({
      where: { caseId: existingCase.id },
      order: [['created', 'DESC']],
    })
  }

  async sendNotificationByCaseId(
    existingCase: Case,
    user: User,
  ): Promise<Notification> {
    this.logger.debug(
      `Sending a notification for case with id "${existingCase.id}"`,
    )

    const smsText =
      existingCase.state === CaseState.DRAFT
        ? this.constructHeadsUpSmsText(existingCase)
        : // State is CaseState.SUBMITTED
          this.constructReadyForCourtpSmsText(existingCase, user)

    // Production or local development with judge phone number
    if (environment.production || environment.notifications.judgePhoneNumber) {
      await this.smsService.sendSms(
        environment.notifications.judgePhoneNumber,
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

  private constructHeadsUpSmsText(existingCase: Case): string {
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

    return `Ný gæsluvarðhaldskrafa í vinnslu.${adText}${cdText}`
  }

  private constructReadyForCourtpSmsText(
    existingCase: Case,
    user: User,
  ): string {
    // Procecutor
    const procecutor = user ? ` Ákærandi: ${user.name}.` : ''

    // Court
    const court = existingCase.court ? ` Dómstóll: ${existingCase.court}.` : ''

    return `Gæsluvarðhaldskrafa tilbúin til afgreiðslu.${procecutor}${court}`
  }
}
