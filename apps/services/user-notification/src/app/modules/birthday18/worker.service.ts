import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { CreateHnippNotificationDto } from '../notifications/dto/createHnippNotification.dto'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class UserNotificationBirthday18WorkerService {
  // eslint-disable-next-line local-rules/disallow-kennitalas
  private DIGITAL_ICELAND_ORG_ID = '5501692829'
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(NationalRegistryV3ApplicationsClientService)
    private nationalRegistryService: NationalRegistryV3ApplicationsClientService,
    @InjectQueue('notifications')
    private readonly queue: QueueService,
    private readonly notificationsService: NotificationsService,
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
        const body: CreateHnippNotificationDto = {
          senderId: this.DIGITAL_ICELAND_ORG_ID,
          recipient: birthdaySsn,
          templateId: 'HNIPP.DIGITALICELAND.BIRTHDAYMESSAGE',
          args: [
            {
              key: 'name',
              value: 'Nafnur Nafnabur',
            },
          ],
        }
        await this.notificationsService.validate(body.templateId, body.args)
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
