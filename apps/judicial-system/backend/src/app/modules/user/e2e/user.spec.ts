import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { setup } from '../../../../../test/setup'

const nationalId = '1112902539'
let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('User', () => {
  it('GET /api/user/:nationalId should get the  user', async () => {
    let user: User

    request(app.getHttpServer())
      .get(`/api/user/${nationalId}`)
      .expect(200)
      .then(async (response) => {
        user = response.body
        return request(app.getHttpServer())
          .get(`/api/user/${user.nationalId}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        expect(response.body.id).toBe(user.id)
        expect(response.body.nationalId).toBe(user.nationalId)
        expect(response.body.name).toBe(user.name)
        expect(response.body.title).toBe(user.title)
        expect(response.body.mobileNumber).toBe(user.mobileNumber)
        expect(response.body.email).toBe(user.email)
        expect(response.body.role).toBe(user.role)
        expect(response.body.institution).toBe(user.institution)
        expect(response.body.active).toBe(user.active)
      })
  })
})
