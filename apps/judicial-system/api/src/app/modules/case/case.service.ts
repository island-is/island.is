import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'

import { environment } from '../../../environments'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case } from './case.model'
import { Notification, NotificationType } from './case.types'

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case)
    private caseModel: typeof Case,
    @Inject(SmsService)
    private smsService: SmsService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  getAll(): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({ order: [['modified', 'DESC']] })
  }

  findById(id: string): Promise<Case> {
    this.logger.debug(`Finding case with id "${id}"`)

    return this.caseModel.findOne({
      where: { id },
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

  delete(id: string): Promise<number> {
    this.logger.debug(`Deleting case with id "${id}"`)

    return this.caseModel.destroy({ where: { id } })
  }

  async getAllNotificationsByCaseId(id: string): Promise<Notification[]> {
    this.logger.debug(`Getting all notifications for case with id "${id}"`)

    return []
  }

  async sendNotificationByCaseId(existingCase: Case): Promise<Notification> {
    this.logger.debug(
      `Sending a notification for case with id "${existingCase.id}"`,
    )

    const smsText = this.constructSmsText(existingCase)

    this.logger.debug(smsText)

    // Production or local development with judge phone number
    if (environment.production || environment.notifications.judgePhoneNumber) {
      await this.smsService.sendSms('8589030', smsText)
    }

    const notification = new Notification()
    notification.caseId = existingCase.id
    notification.type = NotificationType.HEADS_UP

    return notification
  }

  private constructSmsText(existingCase: Case): string {
    // Arrest date
    const ad = existingCase.arrestDate.toISOString()
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
    const cd = existingCase.requestedCourtDate.toISOString()
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
}
