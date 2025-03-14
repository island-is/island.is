import { Inject, Injectable } from '@nestjs/common'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateHnippNotificationDto } from '../notifications/dto/createHnippNotification.dto'

@Injectable()
export class UserNotificationBirthday18WorkerService {
  constructor(
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
    await Promise.all(
      birthdays.map((birthdaySsn) => {
        const dto: CreateHnippNotificationDto = {
          recipient: birthdaySsn,
          templateId: 'HNIPP.DIGITALICELAND.BIRTHDAYMESSAGE',
          args: [
            {
              key: 'organization',
              value: 'Hnipp Test Crew',
            },
          ],
        }
        this.queue.add(dto)
      }),
    )
  }
}
