import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'

let app: INestApplication
beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideProvider(IdsUserGuard)
        .useValue(new MockAuthGuard({}))
        .compile()
    },
  })
})

describe('CreatePartyLetterRegistry', () => {
  it('POST /party-letter-registry should return error when data is invalid', async () => {
    const requestData = {
      partyLetter: 'Z',
      partyName: 'The awesome party',
      owner: '0000000002', // invalid national id
      managers: ['0000000001'], // invalid national id
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
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101305069'
    const requestData = {
      partyLetter: 'Y',
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
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nationalId = '0101303019'
    const requestData = {
      partyLetter: 'V',
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
