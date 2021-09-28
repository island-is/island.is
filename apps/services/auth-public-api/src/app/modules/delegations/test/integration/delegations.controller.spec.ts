import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../../test/setup'

describe('DelegationsController without auth', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await setup({ withAuth: false })
  })

  describe('create', () => {
    it('should return 401 unauthorized ', async () => {
      // Arrange
      const payload = {}

      // Act
      const response = await request(app.getHttpServer())
        .post('/public/v1/delegations')
        .send(payload)

      // Assert
      expect(response.status).toEqual(401)
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Unauthorized',
      })
    })
  })
})
