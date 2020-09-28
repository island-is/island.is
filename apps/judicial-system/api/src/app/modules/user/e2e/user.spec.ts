import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../test/setup'
import { test } from '../../../../../sequelize.config.js'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('User', () => {
  it('GET /api/user should get the current user', async () => {
    const user = test.userSeed[0]

    await request(app.getHttpServer())
      .get('/api/user')
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(user.id)
        expect(response.body.nationalId).toBe(user.national_id)
        expect(response.body.name).toBe(user.name)
        expect(response.body.mobileNumber).toBe(user.mobile_number)
        expect(response.body.role).toBe(user.role)
      })
  })
})
