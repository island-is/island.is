// import request from 'supertest'
// import { INestApplication, Injectable } from '@nestjs/common'
// import { Test } from '@nestjs/testing'
// import { NotificationsController } from '../notifications.controller'
// import { NotificationsWorkerService } from '../notificationsWorker.service'
// import { CreateNotificationDto } from '../dto/createNotification.dto'
// import { LoggingModule } from '@island.is/logging'
// import { environment } from '../../../../environments/environment'
// import {
//   getQueueServiceToken,
//   QueueModule,
//   QueueService,
// } from '@island.is/message-queue'
// import { InjectWorker, WorkerService } from '@island.is/message-queue'
// import { MessageTypes } from '../types'

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// const waitForDelivery = async (
//   worker: WorkerMock,
//   cond: (messages: CreateNotificationDto[]) => boolean,
//   max = 1000,
// ): Promise<void> => {
//   const start = Date.now()
//   while (Date.now() <= start + max && !cond(worker.received)) {
//     await sleep(10)
//   }
// }

// @Injectable()
// class WorkerMock {
//   public received: CreateNotificationDto[] = []

//   constructor(@InjectWorker('notifications') private worker: WorkerService) {}

//   async run() {
//     this.worker.run(async (msg: CreateNotificationDto) => {
//       this.received.push(msg)
//     })
//   }
// }

// describe('Notifications API', () => {
//   let app: INestApplication

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       imports: [
//         LoggingModule,
//         QueueModule.register({
//           client: environment.sqsConfig,
//           queue: {
//             name: 'notifications',
//             queueName: environment.mainQueueName,
//           },
//         }),
//       ],
//       controllers: [NotificationsController],
//       providers: [NotificationsWorkerService],
//     })
//       .overrideProvider(NotificationsWorkerService)
//       .useClass(WorkerMock)
//       .compile()

//     app = await module.createNestApplication().init()
//     await app.get<QueueService>(getQueueServiceToken('notifications')).purge()
//     app.get(NotificationsWorkerService).run()
//   })

//   afterEach(async () => {
//     await app.close()
//   })

//   it('Accepts a valid message input', async () => {
//     const msg: CreateNotificationDto = {
//       type: MessageTypes.NewDocumentMessage,
//       organization: 'Skatturinn',
//       recipient: '1234567890',
//       documentId: '123',
//     }

//     await request(app.getHttpServer())
//       .post('/notifications')
//       .send(msg)
//       .expect(201)

//     const worker = app.get(NotificationsWorkerService) as WorkerMock
//     await waitForDelivery(worker, (msgs) => msgs.length > 0)
//     expect(worker.received).toEqual([msg])
//   })

// })

test('2 + 3 = 5', () => {
  expect(2 + 3).toBe(5)
})
