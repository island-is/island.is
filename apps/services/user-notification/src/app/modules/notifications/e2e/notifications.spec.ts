import request from 'supertest'
import { CacheModule, INestApplication, Injectable } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { NotificationsController } from '../notifications.controller'
import { NotificationsWorkerService } from '../notificationsWorker.service'
import { CreateNotificationDto as Message } from '../dto/createNotification.dto'
import { LoggingModule } from '@island.is/logging'
import { environment } from '../../../../environments/environment'
import {
  getQueueServiceToken,
  QueueModule,
  QueueService,
} from '@island.is/message-queue'
import { InjectWorker, WorkerService } from '@island.is/message-queue'
import { MessageTypes } from '../types'
import { NotificationsService } from '../notifications.service'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const waitForDelivery = async (
  worker: WorkerMock,
  cond: (messages: Message[]) => boolean,
  max = 1000,
): Promise<void> => {
  const start = Date.now()
  while (Date.now() <= start + max && !cond(worker.received)) {
    await sleep(10)
  }
}

@Injectable()
class WorkerMock {
  public received: Message[] = []

  constructor(@InjectWorker('notifications') private worker: WorkerService) {}

  async run() {
    this.worker.run(async (msg: Message) => {
      this.received.push(msg)
    })
  }
}

class mockNotificationsService {
  async createNotification(input: Message) {
    return { id: '123' }
  }
  async getTemplates() {
    return [
      {
        bob: 1,
      },
    ]
  }
  async validateArgs() {
    return true
  }
}
describe('Notifications API', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 60,
          max: 100,
        }),
        LoggingModule,
        QueueModule.register({
          client: environment.sqsConfig,
          queue: {
            name: 'notifications',
            queueName: environment.mainQueueName,
          },
        }),
      ],
      controllers: [NotificationsController],
      providers: [NotificationsWorkerService, NotificationsService],
    })
      .overrideProvider(NotificationsWorkerService)
      .useClass(WorkerMock)
      .overrideProvider(NotificationsService)
      .useClass(mockNotificationsService)
      .compile()

    app = await module.createNestApplication().init()
    await app.get<QueueService>(getQueueServiceToken('notifications')).purge()
    app.get(NotificationsWorkerService).run()
  })

  afterEach(async () => {
    await app.close()
  })

  it('Accepts a valid message input', async () => {
    const msg: Message = {
      type: MessageTypes.NewDocumentMessage,
      organization: 'Skatturinn',
      // eslint-disable-next-line local-rules/disallow-kennitalas
      recipient: '0409084390', // this valid kt needed for test to pass
      documentId: '123',
    }

    await request(app.getHttpServer())
      .post('/notifications/create-notification')
      .send(msg)
      .expect(201)

    const worker = app.get(NotificationsWorkerService) as WorkerMock
    await waitForDelivery(worker, (msgs) => msgs.length > 0)
    expect(worker.received).toEqual([msg])
  })

  // it('gets a templates', async () => {
  //   const msg: Message = {
  //     type: MessageTypes.NewDocumentMessage,
  //     organization: 'Skatturinn',
  //     // eslint-disable-next-line local-rules/disallow-kennitalas
  //     recipient: '0409084390', // this valid kt needed for test to pass
  //     documentId: '123',
  //   }

  //   await request(app.getHttpServer())
  //     .get('/notifications/templates?locale=is-IS')
  //     .expect(200)
  // })
})
