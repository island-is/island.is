import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('CreatePartyLetterRegistry', () => {
  it('POST /party-letter-registry should return error when data is invalid', async () => {
    const requestData = {
      partyLetter: 'A',
      partyName: 'The awesome party',
      owner: '0000000002',
      managers: ['0000000001'],
    }
    const response = await request(app.getHttpServer())
      .post('/party-letter-registry')
      .send(requestData)
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it('POST /party-letter-registry should fail to assign an existing letter', async () => {
    const nationalId = '0101305069'
    const requestData = {
      partyLetter: 'B',
      partyName: 'The awesome party',
      owner: nationalId,
      managers: [nationalId],
    }
    const response = await request(app.getHttpServer())
      .post('/party-letter-registry')
      .send(requestData)
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it('POST /party-letter-registry should create a new entry', async () => {
    const nationalId = '0101303019'
    const requestData = {
      partyLetter: 'C',
      partyName: 'The awesome party',
      owner: nationalId,
      managers: [nationalId],
    }
    const response = await request(app.getHttpServer())
      .post('/party-letter-registry')
      .send(requestData)
      .expect(201)

    expect(response.body).toMatchObject(requestData)
  })
})
