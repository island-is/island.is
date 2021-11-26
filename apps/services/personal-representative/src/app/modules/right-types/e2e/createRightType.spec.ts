import { getApp } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'

describe('CreateRightType', () => {
  it('POST /right-type should fail and return 403 error if scope is missing', async () => {
    const app = await getApp()
    const requestData = {
      code: 'Code',
      description: 'Description',
      validTo: '10-11-2099'
    }
    const response = await request(app.getHttpServer())
      .post('/right-type')
      .send(requestData)
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
  it('POST /right-type should return error when data is invalid', async () => {
    const app = await getApp()
    const requestData = {
      code: 'Code',
      description: 'Description',
      validFrom: '10-11-2021'
    }
    const response = await request(app.getHttpServer())
      .post('/right-type')
      .send(requestData)
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it('POST /right-type should create a new entry', async () => {
    const app = await getApp()
    const requestData = {
      code: 'Code',
      description: 'Description',
    }
    const response = await request(app.getHttpServer())
      .post('/right-type')
      .send(requestData)
      .expect(201)

    expect(response.body).toMatchObject(requestData)
  })
})
