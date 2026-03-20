import { v4 as uuid } from 'uuid'
import { SQSClient } from '@aws-sdk/client-sqs'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { messageModuleConfig } from '../message.config'
import { MessageService } from '../message.service'

const queueUrl = uuid()
let sqs: SQSClient

jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: jest.fn(() => sqs),
  GetQueueUrlCommand: jest.fn((c) => c),
  CreateQueueCommand: jest.fn((c) => c),
  SendMessageCommand: jest.fn((c) => c),
  SendMessageBatchCommand: jest.fn((c) => c),
  ReceiveMessageCommand: jest.fn((c) => c),
  DeleteMessageCommand: jest.fn((c) => c),
}))

export const createTestingMessageModule = async () => {
  const mockSend = jest
    .fn()
    .mockRejectedValue(new Error('Some error'))
    .mockResolvedValueOnce({ QueueUrl: queueUrl })

  const setSendMocks = (mocks: unknown[]) => {
    for (const mock of mocks) {
      mockSend.mockResolvedValueOnce(mock)
    }
  }

  sqs = {
    send: mockSend,
  } as unknown as SQSClient

  const messageModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ load: [messageModuleConfig] })],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      MessageService,
    ],
  }).compile()

  const messageService = messageModule.get<MessageService>(MessageService)

  // Initiate queue connection
  await messageService
    .receiveMessagesFromQueue(async () => true)
    .catch(() => true)

  return { setSendMocks, queueUrl, sqs, messageService }
}
