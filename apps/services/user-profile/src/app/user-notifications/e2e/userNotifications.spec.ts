import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserNotificationsController } from '../user-notifications.controller'
import { UserNotificationsService } from '../user-notifications.service'
// import { AppController } from './../src/user.controller';
// import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [],
      controllers: [UserNotificationsController],
      providers: [UserNotificationsService],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/')
      .expect(404)
      .expect('{"statusCode":404,"error":"Not Found","message":"Cannot GET /"}') //todo fix me
  })
})
