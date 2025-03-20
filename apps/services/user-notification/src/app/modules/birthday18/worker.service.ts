import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateHnippNotificationDto } from '../notifications/dto/createHnippNotification.dto'

@Injectable()
export class UserNotificationBirthday18WorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(NationalRegistryV3ApplicationsClientService)
    private nationalRegistryService: NationalRegistryV3ApplicationsClientService,
    @InjectQueue('notifications')
    private readonly queue: QueueService,
  ) {}

  public async run() {
    await this.dispatchBirthdayNotifications()
  }

  async dispatchBirthdayNotifications() {
    const birthdays = await this.nationalRegistryService.get18YearOlds()
    this.logger.info(
      `User-notifications-birthday-worker: About to send messages for ${birthdays.length} birthdays`,
    )
    await Promise.all(
      birthdays.map(async (birthdaySsn) => {
        const dto: CreateHnippNotificationDto = {
          recipient: birthdaySsn,
          templateId: 'HNIPP.DIGITALICELAND.BIRTHDAYMESSAGE',
          args: [
            {
              key: 'name',
              value: 'Nafnur Nafnabur',
            },
          ],
        }
        this.queue.add(dto)
      }),
    ).catch((e) =>
      this.logger.warn(
        'User-notifications-birthday-worker error on notification',
        e,
      ),
    )
  }
}
