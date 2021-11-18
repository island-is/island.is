import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { NotificationsController } from '../notifications.controller'
import { CONFIG_PROVIDER, CONNECTION_PROVIDER } from '../../../../constants'
import { NotificationProducerService } from '../producer.service'
import { NotificationConsumerService } from '../consumer.service'
import { Message, MessageTypes } from '../dto/createNotification.dto'
import { createQueue } from '../connection.provider'
import { MessageHandlerService } from '../messageHandler.service'
import { LoggingModule } from '@island.is/logging'
import { PurgeQueueCommand } from '@aws-sdk/client-sqs'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

class MessageHandlerMock {
  public received: Message[] = []

  async process(message: Message): Promise<void> {
    this.received.push(message)
  }

  async waitFor(cond: (messages: Message[]) => boolean, max = 1000) {
    const start = Date.now()
    while (Date.now() - start < max) {
      if (!cond(this.received)) {
        await sleep(10)
      }
    }
  }
}

const createClient = async () => {
  const conn = await createQueue({
    mainQueueName: 'test-main',
    deadLetterQueueName: 'test-failure',
    sqsConfig: {
      endpoint: 'http://localhost:4566',
      region: 'eu-west-1',
      credentials: {
        accessKeyId: 'testing',
        secretAccessKey: 'testing',
      },
    },
  })
  await conn.client.send(
    new PurgeQueueCommand({
      QueueUrl: conn.queueUrl,
    }),
  )
  return conn
}

let app: INestApplication

beforeEach(async () => {
  const module = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [NotificationsController],
    providers: [
      {
        provide: CONFIG_PROVIDER,
        useValue: {},
      },
      {
        provide: CONNECTION_PROVIDER,
        useFactory: createClient,
      },
      NotificationProducerService,
      NotificationConsumerService,
      MessageHandlerService,
    ],
  })
    .overrideProvider(MessageHandlerService)
    .useClass(MessageHandlerMock)
    .compile()

  app = await module.createNestApplication().init()
  app.get(NotificationConsumerService).run()
})

afterEach(async () => {
  await app.close()
})

describe('Notifications API', () => {
  it('Accepts a valid message input', async () => {
    const msg: Message = {
      type: MessageTypes.NewPostholfMessage,
      from: 'Skatturinn',
      recipient: '0409084390',
      postholfMessageId: '123',
    }

    await request(app.getHttpServer())
      .post('/notifications')
      .send(msg)
      .expect(202)

    const handler = app.get(MessageHandlerService) as MessageHandlerMock
    await handler.waitFor((msgs) => msgs.length > 0)
    expect(handler.received).toEqual([msg])
  })
})
