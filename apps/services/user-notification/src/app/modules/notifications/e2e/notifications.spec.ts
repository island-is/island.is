import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { NotificationsController } from '../notifications.controller'
import { CONFIG_PROVIDER } from '../../../../constants'
import { ProducerService } from '../producer.service'
import { ConsumerService } from '../consumer.service'
import { Message, MessageTypes } from '../dto/createNotification.dto'
import { MessageHandlerService } from '../messageHandler.service'
import { LoggingModule } from '@island.is/logging'
import { PurgeQueueCommand } from '@aws-sdk/client-sqs'
import { QueueConnectionProvider } from '../queueConnection.provider'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const environment = {
  mainQueueName: 'test-main',
  deadLetterQueueName: 'test-failure',
  sqsConfig: {
    endpoint: process.env.SQS_ENDPOINT ?? 'http://localhost:4566',
    region: 'eu-west-1',
    credentials: {
      accessKeyId: 'testing',
      secretAccessKey: 'testing',
    },
  },
}

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

let app: INestApplication

beforeEach(async () => {
  const module = await Test.createTestingModule({
    imports: [LoggingModule],
    controllers: [NotificationsController],
    providers: [
      {
        provide: CONFIG_PROVIDER,
        useValue: environment,
      },
      QueueConnectionProvider,
      ProducerService,
      ConsumerService,
      MessageHandlerService,
    ],
  })
    .overrideProvider(MessageHandlerService)
    .useClass(MessageHandlerMock)
    .compile()

  app = await module.createNestApplication().init()
  const queue = app.get(QueueConnectionProvider)
  await queue.client.send(
    new PurgeQueueCommand({
      QueueUrl: queue.queueUrl,
    }),
  )
  app.get(ConsumerService).run()
})

afterEach(async () => {
  await app.close()
})

describe('Notifications API', () => {
  it('Accepts a valid message input', async () => {
    const msg: Message = {
      type: MessageTypes.NewDocumentMessage,
      sender: 'Skatturinn',
      recipient: '0409084390',
      documentId: '123',
    }

    await request(app.getHttpServer())
      .post('/notifications')
      .send(msg)
      .expect(201)

    const handler = app.get(MessageHandlerService) as MessageHandlerMock
    await handler.waitFor((msgs) => msgs.length > 0)
    expect(handler.received).toEqual([msg])
  })
})
