import * as request from 'supertest'

import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../test/setup'
import { User } from '../user.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('User', () => {
  it('GET /api/user/:nationalId should get the  user', async () => {
    const nationalId = '1112902539'
    let dbUser: User

    User.findOne({
      where: { nationalId },
    })
      .then(async (value) => {
        dbUser = value

        return request(app.getHttpServer())
          .get(`/api/user/${nationalId}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        const apiUser = response.body

        expect(apiUser.id).toBe(dbUser.id)
        expect(apiUser.nationalId).toBe(dbUser.nationalId)
        expect(apiUser.name).toBe(dbUser.name)
        expect(apiUser.title).toBe(dbUser.title)
        expect(apiUser.mobileNumber).toBe(dbUser.mobileNumber)
        expect(apiUser.email).toBe(dbUser.email)
        expect(apiUser.role).toBe(dbUser.role)
        expect(apiUser.institution).toBe(dbUser.institution)
        expect(apiUser.active).toBe(dbUser.active)
      })
  })
})
