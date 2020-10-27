import { IdentityResourcesDTO } from './../../../../../../../../libs/auth-api-lib/src/lib/entities/dto/identity-resources-dto'
import { setup, removeSetup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

afterAll(async () => {
  await removeSetup()
})

const identityResource: IdentityResourcesDTO = {
  key: 'set_key',
  enabled: true,
  name: 'set_name',
  displayName: 'set_display_name',
  description: 'set_description',
  showInDiscoveryDocument: true,
  required: false,
  emphasize: false,
}

describe('Resource', () => {
  it(`GET /identity-resources should return a list of lenght 1`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .get('/identity-resources?scopeNames=openid')
      .expect(200)

    expect(response.body[0].enabled).toEqual(true)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].userClaims).toHaveLength(3)
  })

  it(`GET /api-scopes?scopeNames should return a list of length 1`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .get('/api-scopes?scopeNames=%40identityserver.api%2Fread')
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].enabled).toEqual(true)
  })

  it(`GET /api-resources?apiResourceNames should return a list of length 1`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .get('/api-resources?apiResourceNames=postman_resource')
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].apiSecrets).toHaveLength(1)
    expect(response.body[0].scopes).toHaveLength(1)
    expect(response.body[0].userClaims).toHaveLength(1)
  })

  it('POST /identity-resource should register identityResource', async () => {
    // ACT
    const response = await request(app.getHttpServer())
      .post('/identity-resource')
      .send(identityResource)
      .expect(201)

    expect(response.body).toMatchObject({
      enabled: identityResource.enabled,
      name: identityResource.name,
      displayName: identityResource.displayName,
      description: identityResource.description,
      showInDiscoveryDocument: identityResource.showInDiscoveryDocument,
      required: identityResource.required,
      emphasize: identityResource.emphasize,
    })
  })
})
