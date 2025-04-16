import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateHnippNotificationDto } from '../notifications/dto/createHnippNotification.dto'
import { InstitutionNationalIds } from '@island.is/application/types'

@Injectable()
export class UserNotificationBirthday18WorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(NationalRegistryV3ApplicationsClientService)
    private nationalRegistryService: NationalRegistryV3ApplicationsClientService,
    @InjectQueue('notifications')
    private queue: QueueService,
  ) {}

  public async run() {
    await this.dispatchBirthdayNotifications()
  }

  async dispatchBirthdayNotifications() {
    const birthdays = ['0101303019', '0101307789', '0101302399']
    this.logger.info(
      `User-notifications-birthday-worker: About to send messages for ${birthdays.length} birthdays`,
    )
    await Promise.all(
      birthdays.map(async (birthdaySsn) => {
        const body: CreateHnippNotificationDto = {
          senderId: InstitutionNationalIds.STAFRAENT_ISLAND,
          recipient: birthdaySsn,
          templateId: 'HNIPP.DIGITALICELAND.BIRTHDAYMESSAGE',
          // This PR will not be merged until the national registry v3 applications client
          // will be updated
          args: [
            {
              key: 'name',
              value: '',
            },
          ],
        }
        const id = await this.queue.add(body)
        const flattenedArgs: Record<string, string> = {}
        for (const arg of body.args) {
          flattenedArgs[arg.key] = arg.value
        }
        this.logger.info('Message queued', {
          messageId: id,
          ...flattenedArgs,
          ...body,
          args: {}, // Remove args, since they're in a better format in `flattenedArgs`
          queue: { url: this.queue.url, name: this.queue.queueName },
        })
      }),
    ).catch((e) =>
      this.logger.warn(
        'User-notifications-birthday-worker error on notification',
        e,
      ),
    )
  }
}
