import { SQS } from 'aws-sdk'
import { uuid } from 'uuidv4'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { messageModuleConfig } from '../message.config'
import { MessageService } from '../message.service'

const queueUrl = uuid()
let sqs: SQS

jest.mock('aws-sdk', () => ({
  SQS: jest.fn().mockImplementation(() => sqs),
}))

export const createTestingMessageModule = async () => {
  sqs = ({
    getQueueUrl: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({ QueueUrl: queueUrl }),
    })),
    sendMessage: jest.fn(),
    receiveMessage: jest.fn(),
    deleteMessage: jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve() }),
  } as unknown) as SQS

  const messageModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [messageModuleConfig] })],
    providers: [
      { provide: LOGGER_PROVIDER, useValue: { error: jest.fn() } },
      MessageService,
    ],
  }).compile()

  const messageService = messageModule.get<MessageService>(MessageService)

  return { queueUrl, sqs, messageService }
}
