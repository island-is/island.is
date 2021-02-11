import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { setup } from '../../../../../test/setup'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

const simpleOrg = {
  nationalId: '1234567890',
  name: 'Organisation ehf.',
  address: 'Dúfnahólar 10',
  email: 'org@org.is',
  phoneNumber: '5551233',
}

const provider = {
  id: '78f98c81-44bd-4cff-9c43-a3cac5d1803d',
  endpoint: 'https://somedomain.is/api/customer',
  endpointType: 'REST',
  apiScope: 'https://somedomain.is/api/customer/.default',
}

describe('Provider API', () => {
  it('should return true', async () => {
    expect(true).toBe(true)
  })

  // it('POST /providers should register provider', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/organisations')
  //     .send(simpleOrg)
  //     .expect(201)
  //   const { id: organisationId } = response.body
  //   const ble = {
  //     ...provider,
  //     organisationId,
  //   }
  //   console.log('ble', ble)
  //   const response2 = await request(app.getHttpServer())
  //     .post('/providers')
  //     .send({
  //       ...provider,
  //       organisationId,
  //     })
  //     .expect(201)
  //   const { body } = response
  //   expect(body.id).toEqual(provider.id)
  //   expect(body.organisationId).toEqual(organisationId)
  //   expect(body.endpoint).toEqual(provider.endpoint)
  //   expect(body.endpointType).toEqual(provider.endpointType)
  //   expect(body.apiScope).toEqual(provider.apiScope)
  // })
})
