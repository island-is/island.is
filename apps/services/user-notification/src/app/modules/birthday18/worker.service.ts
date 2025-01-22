import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import { Notification } from '../notifications/notification.model'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'

@Injectable()
export class UserNotificationBirthday18WorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(NationalRegistryV3ApplicationsClientService)
    private nationalRegistryService: NationalRegistryV3ApplicationsClientService,
  ) {}

  public async run() {
    await this.dispatchBirthdayNotifications()
  }

  async dispatchBirthdayNotifications() {
    const birthdays = await this.nationalRegistryService.get18YearOlds(true)
  }
}
