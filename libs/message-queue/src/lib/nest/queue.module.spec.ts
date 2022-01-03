import { INestApplication, Injectable } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QueueModule } from './queue.module'
import { clientConfig, makeQueueConfig, deleteQueues } from './testHelpers'
import { InjectWorker } from './decorators'
import { WorkerService } from './worker.service'
import { getQueueServiceToken } from './utils'
import { QueueService } from './queue.service'

beforeEach(deleteQueues)

@Injectable()
class MockWorker {
  public received: string[] = []

  constructor(@InjectWorker('test') public worker: WorkerService) {}

  async run() {
    this.worker.run(async (msg: string) => {
      this.received.push(msg)
    })
  }
}

describe('QueueModule', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        QueueModule.register({
          client: clientConfig,
          queue: makeQueueConfig(),
        }),
      ],
      providers: [MockWorker],
    }).compile()

    app = await module.createNestApplication().init()
    app.get(MockWorker).run()
  })

  afterEach(async () => {
    await app.close()
  })

  it('delivers message through queue server to worker', async () => {
    app.get<QueueService>(getQueueServiceToken('test')).add({ the: 'message' })
    const worker = app.get(MockWorker)
    const start = Date.now()
    while (Date.now() - start < 1_000 && worker.received.length === 0) {
      await new Promise((r) => setTimeout(r, 10))
    }

    expect(worker.received).toMatchObject([{ the: 'message' }])
    await worker.worker.onModuleDestroy()
  })
})
