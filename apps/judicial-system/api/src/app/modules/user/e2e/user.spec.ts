import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { setup, user } from '../../../../../test/setup'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('User', () => {
  it('GET /api/user should get the current user', async () => {
    await request(app.getHttpServer())
      .get('/api/user')
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(user.id)
        expect(response.body.nationalId).toBe(user.nationalId)
        expect(response.body.name).toBe(user.name)
        expect(response.body.mobileNumber).toBe(user.mobileNumber)
        expect(response.body.role).toBe(user.role)
      })
  })
})
