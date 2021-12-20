import { setupWithAuth, setupWithoutAuth } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import { PersonalRepresentativeAccess, PersonalRepresentativeAccessDTO } from '@island.is/auth-api-lib/personal-representative'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'

const scopes = ['@island.is/scope0', '@island.is/scope1']
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.writePersonalRepresentative, scopes[0]],
})

const accessData: PersonalRepresentativeAccessDTO[] = [
  { nationalIdPersonalRepresentative: '1234567890',
    nationalIdRepresentedPerson: '1234567891',
    serviceProvider: 'testServiceProvider'
  },
  { nationalIdPersonalRepresentative: '1234567892',
    nationalIdRepresentedPerson: '1234567893',
    serviceProvider: 'testServiceProvider'
  },
  { nationalIdPersonalRepresentative: '1234567892',
    nationalIdRepresentedPerson: '1234567894',
    serviceProvider: 'testServiceProvider'
  },
]

const path = '/v1/access-logs'

describe('AccessLogsController - Without Auth', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithoutAuth()
    server = request(app.getHttpServer())
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('Get /v1/access-logs should fail and return 403 error if bearer is missing', async () => {
    const response = await server.get(path).expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
})

describe('AccessLogsController - With Auth', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let accessModel: typeof PersonalRepresentativeAccess

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
    // Get reference on rightType models to seed DB
    accessModel = app.get<typeof PersonalRepresentativeAccess>(
      'PersonalRepresentativeAccessRepository',
    )
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  beforeEach(async () => {
    await accessModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    accessModel.bulkCreate(accessData)
  })

  describe('Get access-logs', () => {
    it('Get /v1/access-logs should return logs connected to specific personal representative', async () => {
      const response = await server
        .get(`${path}/${accessData[0].nationalIdPersonalRepresentative}/personal-representative`)
        .expect(200)

      expect(response.body.data[0]).toMatchObject(accessData[0])
    })

    it('Get /v1/access-logs should return logs connected to specific represented person', async () => {
      const response = await server.get(`${path}/${accessData[2].nationalIdRepresentedPerson}/represented-person`)
      .expect(200)

      expect(response.body.data[0]).toMatchObject(accessData[2])
    })

    it('Get /v1/access-logs should return all access logs', async () => {
      const response = await server
        .get(`${path}`)
        .expect(200)

        expect(response.body.totalCount).toBe(accessData.length)
    })
  })
})
