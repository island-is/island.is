import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AdminPortalScope, ApiScope } from '@island.is/auth/scopes'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'

import { setup } from '../../../../../test/setup'

let app: INestApplication
let server: request.SuperTest<request.Test>

const nationalId = '123456432x'
const simpleOrg = {
  nationalId: '1234567890',
  name: 'Organisation ehf.',
  address: 'Dúfnahólar 10',
  email: 'org@org.is',
  phoneNumber: '5551233',
}

const complexOrg = {
  nationalId: '1234567899',
  name: 'Sameinaðir stórlaxar',
  address: 'Sultugata 10',
  email: 'storlax@sameinadir.is',
  phoneNumber: '5551234',
  zendeskId: '123123',
  administrativeContact: {
    name: 'Siggi stórlax',
    email: 'hjalp@sameinadir.is',
    phoneNumber: '5551235',
  },
  technicalContact: {
    name: 'Tinni tittur',
    email: 'hjalp@sameinadir.is',
    phoneNumber: '5551236',
  },
  helpdesk: {
    email: 'hjalp@sameinadir.is',
    phoneNumber: '5551237',
  },
}

const provider = {
  endpoint: 'https://somedomain.is/api/customer',
  endpointType: 'REST',
  apiScope: 'https://somedomain.is/api/customer/.default',
  xroad: false,
  externalProviderId: 'b9fe843a1dea446a9c8497a3f1e8ad72',
}

beforeEach(async () => {
  app = await setup({
    override: (builder) =>
      builder.overrideGuard(IdsUserGuard).useValue(
        new MockAuthGuard({
          nationalId,
          scope: [AdminPortalScope.documentProvider],
        }),
      ),
  })

  server = request(app.getHttpServer())
})
afterEach(() => {
  app.close()
})

describe('Organisation API', () => {
  it('POST /organisations should register organisation with no related objects', async () => {
    const response = await server
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { body } = response
    expect(body.id).toBeTruthy()
    expect(body.nationalId).toEqual(simpleOrg.nationalId)
    expect(body.name).toEqual(simpleOrg.name)
    expect(body.address).toEqual(simpleOrg.address)
    expect(body.email).toEqual(simpleOrg.email)
    expect(body.phoneNumber).toEqual(simpleOrg.phoneNumber)

    // Check for changelogs
    const changelogResponse = await server
      .get(`/changelogs/organisations/${body.id}/entities/${body.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(1)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(body.id)
    expect(changelog.entityId).toEqual(body.id)
    expect(changelog.entityType).toEqual('Organisation')
    const changelogData = changelog.data
    expect((changelogData.id = body.id))
    expect(changelogData.name).toEqual(simpleOrg.name)
    expect(changelogData.email).toEqual(simpleOrg.email)
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('POST /organisations should register organisation with related objects', async () => {
    const response = await request(app.getHttpServer())
      .post('/organisations')
      .send(complexOrg)
      .expect(201)
    const { body } = response
    expect(body.nationalId).toEqual(complexOrg.nationalId)
    expect(body.name).toEqual(complexOrg.name)
    expect(body.address).toEqual(complexOrg.address)
    expect(body.email).toEqual(complexOrg.email)
    expect(body.phoneNumber).toEqual(complexOrg.phoneNumber)
    expect(body.zendeskId).toEqual(complexOrg.zendeskId)
    expect(body.administrativeContact.name).toEqual(
      complexOrg.administrativeContact.name,
    )
    expect(body.administrativeContact.email).toEqual(
      complexOrg.administrativeContact.email,
    )
    expect(body.administrativeContact.phoneNumber).toEqual(
      complexOrg.administrativeContact.phoneNumber,
    )
    expect(body.technicalContact.name).toEqual(complexOrg.technicalContact.name)
    expect(body.technicalContact.email).toEqual(
      complexOrg.technicalContact.email,
    )
    expect(body.technicalContact.phoneNumber).toEqual(
      complexOrg.technicalContact.phoneNumber,
    )
    expect(body.helpdesk.email).toEqual(complexOrg.helpdesk.email)
    expect(body.helpdesk.phoneNumber).toEqual(complexOrg.helpdesk.phoneNumber)

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${body.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(4)
    changelogBody.forEach((entity: { data: { modifiedBy: string } }) => {
      expect(entity.data.modifiedBy).toEqual(nationalId)
    })
  })

  it.skip('POST /organisation should return 400 bad request on invalid input', async () => {
    const response = await request(app.getHttpServer())
      .post('/organisations')
      .send({})
      .expect(400)
    expect(response.body.error).toBe('Bad Request')
  })

  it.skip('GET /organisations should return empty array if no organisations exists', async () => {
    const response = await request(app.getHttpServer())
      .get('/organisations')
      .expect(200)
    const { body } = response
    expect(body.length).toBe(0)
  })

  it.skip('GET /organisations should return list of organisations', async () => {
    await request(app.getHttpServer())
      .post('/organisations')
      .send({
        ...simpleOrg,
        nationalId: '1234567891',
      })

    await request(app.getHttpServer())
      .post('/organisations')
      .send({
        ...simpleOrg,
        nationalId: '1234567892',
      })

    const response = await request(app.getHttpServer())
      .get('/organisations')
      .expect(200)
    const { body } = response
    expect(body.length).toBe(2)
  })

  it.skip('GET /organisations/{nationalId} should return 404 not found', async () => {
    const response = await request(app.getHttpServer())
      .get('/organisations/5234567890')
      .expect(404)
    const { body } = response
    expect(body.error).toBe('Not Found')
    expect(body.message).toBe(
      'An organisation with nationalId 5234567890 does not exist',
    )
  })

  it.skip('GET /organisations/{nationalId} should return organisation', async () => {
    await request(app.getHttpServer()).post('/organisations').send(simpleOrg)

    const response = await request(app.getHttpServer())
      .get(`/organisations/${simpleOrg.nationalId}`)
      .expect(200)
    const { body } = response
    expect(body.nationalId).toEqual(simpleOrg.nationalId)
    expect(body.name).toEqual(simpleOrg.name)
    expect(body.address).toEqual(simpleOrg.address)
    expect(body.email).toEqual(simpleOrg.email)
    expect(body.phoneNumber).toEqual(simpleOrg.phoneNumber)
  })

  it.skip('PUT /organisations should update organisation', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)

    const { id } = postResponse.body

    // Update organisation
    const updatedName = 'Rex Kex ehf.'
    const response = await request(app.getHttpServer())
      .put(`/organisations/${id}`)
      .send({
        name: updatedName,
      })
      .expect(200)
    const { body } = response
    expect(body.nationalId).toEqual(simpleOrg.nationalId)
    expect(body.name).toEqual(updatedName)
    expect(body.address).toEqual(simpleOrg.address)
    expect(body.email).toEqual(simpleOrg.email)
    expect(body.phoneNumber).toEqual(simpleOrg.phoneNumber)

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${id}/entities/${id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(2)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(body.id)
    expect(changelog.entityId).toEqual(body.id)
    expect(changelog.entityType).toEqual('Organisation')
    const changelogData = changelog.data
    expect((changelogData.id = body.id))
    expect(changelogData.name).toEqual(updatedName)
    expect(changelogData.email).toEqual(simpleOrg.email)
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('POST /organisations/{id}/administrativecontact should add to existing organisation', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)

    const { id, nationalId: nationalIdBody } = postResponse.body

    await request(app.getHttpServer())
      .post(`/organisations/${id}/administrativecontact`)
      .send({
        name: 'Siggi CEO',
        email: 'siggi@org.is',
        phoneNumber: '5559876',
      })
      .expect(201)

    const getResponse = await request(app.getHttpServer())
      .get(`/organisations/${nationalIdBody}`)
      .expect(200)

    const { body } = getResponse
    expect(body.administrativeContact.name).toEqual('Siggi CEO')
    expect(body.administrativeContact.email).toEqual('siggi@org.is')
    expect(body.administrativeContact.phoneNumber).toEqual('5559876')

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(
        `/changelogs/organisations/${id}/entities/${body.administrativeContact.id}`,
      )
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(1)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(body.id)
    expect(changelog.entityId).toEqual(body.administrativeContact.id)
    expect(changelog.entityType).toEqual('AdministrativeContact')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.administrativeContact.id)
    expect(changelogData.email).toEqual('siggi@org.is')
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('PUT /organisations/{id}/administrativecontact{administrativeContactId} should update administrative contact', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(complexOrg)
      .expect(201)

    const { id } = postResponse.body
    const { id: administrativeContactId } =
      postResponse.body.administrativeContact

    const updatedName = 'Stefán stórlax'
    const putResponse = await request(app.getHttpServer())
      .put(
        `/organisations/${id}/administrativecontact/${administrativeContactId}`,
      )
      .send({ name: updatedName })
      .expect(200)

    const { body } = putResponse
    expect(body.name).toEqual(updatedName)

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${id}/entities/${body.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(2)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(id)
    expect(changelog.entityId).toEqual(body.id)
    expect(changelog.entityType).toEqual('AdministrativeContact')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.id)
    expect(changelogData.name).toEqual(updatedName)
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('POST /organisations/{id}/technicalcontact should add to existing organisation', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)

    const { id, nationalId } = postResponse.body

    await request(app.getHttpServer())
      .post(`/organisations/${id}/technicalcontact`)
      .send({
        name: 'Siggi Tech',
        email: 'siggi@org.is',
        phoneNumber: '5559876',
      })
      .expect(201)

    const getResponse = await request(app.getHttpServer())
      .get(`/organisations/${nationalId}`)
      .expect(200)

    const { body } = getResponse
    expect(body.technicalContact.name).toEqual('Siggi Tech')
    expect(body.technicalContact.email).toEqual('siggi@org.is')
    expect(body.technicalContact.phoneNumber).toEqual('5559876')

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(
        `/changelogs/organisations/${id}/entities/${body.technicalContact.id}`,
      )
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(1)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(body.id)
    expect(changelog.entityId).toEqual(body.technicalContact.id)
    expect(changelog.entityType).toEqual('TechnicalContact')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.technicalContact.id)
    expect(changelogData.email).toEqual('siggi@org.is')
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('PUT /organisations/{id}/technicalcontact{technicalContactId} should update technical contact', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(complexOrg)
      .expect(201)

    const { id } = postResponse.body
    const { id: technicalContactId } = postResponse.body.technicalContact

    const updatedName = 'Tóti tölvukall'
    const putResponse = await request(app.getHttpServer())
      .put(`/organisations/${id}/technicalcontact/${technicalContactId}`)
      .send({ name: updatedName })
      .expect(200)

    const { body } = putResponse
    expect(body.name).toEqual(updatedName)

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${id}/entities/${body.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(2)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(id)
    expect(changelog.entityId).toEqual(body.id)
    expect(changelog.entityType).toEqual('TechnicalContact')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.id)
    expect(changelogData.name).toEqual(updatedName)
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('POST /organisations/{id}/helpdesk should add to existing organisation', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)

    const { id, nationalId } = postResponse.body

    await request(app.getHttpServer())
      .post(`/organisations/${id}/helpdesk`)
      .send({
        email: 'help@org.is',
        phoneNumber: '5559898',
      })
      .expect(201)

    const getResponse = await request(app.getHttpServer())
      .get(`/organisations/${nationalId}`)
      .expect(200)

    const { body } = getResponse
    expect(body.helpdesk.email).toEqual('help@org.is')
    expect(body.helpdesk.phoneNumber).toEqual('5559898')

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${id}/entities/${body.helpdesk.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(1)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(body.id)
    expect(changelog.entityId).toEqual(body.helpdesk.id)
    expect(changelog.entityType).toEqual('Helpdesk')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.helpdesk.id)
    expect(changelogData.email).toEqual('help@org.is')
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('PUT /organisations/{id}/helpdesk{helpdeskId} should update helpdesk', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(complexOrg)
      .expect(201)

    const { id } = postResponse.body
    const { id: helpdeskId } = postResponse.body.helpdesk

    const updatedEmail = 'sos@sameinadir.is'
    const putResponse = await request(app.getHttpServer())
      .put(`/organisations/${id}/helpdesk/${helpdeskId}`)
      .send({ email: updatedEmail })
      .expect(200)

    const { body } = putResponse
    expect(body.email).toEqual(updatedEmail)

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${id}/entities/${body.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(2)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(id)
    expect(changelog.entityId).toEqual(body.id)
    expect(changelog.entityType).toEqual('Helpdesk')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.id)
    expect(changelogData.email).toEqual(updatedEmail)
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })
})

describe('Provider API', () => {
  it('GET /providers should return empty array if no proviers exists', async () => {
    const response = await server.get('/providers').expect(200)
    const { body } = response
    expect(body.length).toBe(0)
  })

  it.skip('GET /providers should return list of providers', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { id: organisationId } = postResponse.body

    await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
      })
      .expect(201)

    const provider2 = {
      endpoint: 'https://someotherdomain.is/api/customer',
      endpointType: 'REST',
      apiScope: 'https://someotherdomain.is/api/customer/.default',
      xroad: false,
      externalProviderId: 'b9fe843a1dea446a9c8497a3f1e8ad73',
    }

    await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider2,
        organisationId,
      })
      .expect(201)

    const getResponse = await request(app.getHttpServer())
      .get('/providers')
      .expect(200)
    const { body } = getResponse
    expect(body.length).toBe(2)
  })

  it.skip('POST /providers should register provider', async () => {
    const response = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { id: organisationId } = response.body

    const response2 = await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
      })
      .expect(201)
    const { body } = response2
    expect(body.id).toBeTruthy()
    expect(body.organisationId).toEqual(organisationId)
    expect(body.endpoint).toEqual(provider.endpoint)
    expect(body.endpointType).toEqual(provider.endpointType)
    expect(body.apiScope).toEqual(provider.apiScope)
    expect(body.xroad).toEqual(provider.xroad)
    expect(body.externalProviderId).toEqual(provider.externalProviderId)

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${organisationId}/entities/${body.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(1)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(body.organisationId)
    expect(changelog.entityId).toEqual(body.id)
    expect(changelog.entityType).toEqual('Provider')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.id)
    expect(changelogData.endpoint).toEqual(provider.endpoint)
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('GET /providers/{id} should return 404 not found', async () => {
    const response = await request(app.getHttpServer())
      .get('/providers/123')
      .expect(404)
    const { body } = response
    expect(body.error).toBe('Not Found')
    expect(body.message).toBe(`A provider with id 123 does not exist`)
  })

  it.skip('GET /providers/{id} should return provider', async () => {
    const postOrganisation = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { id: organisationId } = postOrganisation.body

    const postProvider = await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
      })
      .expect(201)
    const { id } = postProvider.body

    const getResponse = await request(app.getHttpServer())
      .get(`/providers/${id}`)
      .expect(200)
    const { body } = getResponse
    expect(body.id).toBeTruthy()
    expect(body.organisationId).toEqual(organisationId)
    expect(body.endpoint).toEqual(provider.endpoint)
    expect(body.endpointType).toEqual(provider.endpointType)
    expect(body.apiScope).toEqual(provider.apiScope)
    expect(body.xroad).toEqual(provider.xroad)
    expect(body.externalProviderId).toEqual(provider.externalProviderId)
  })

  it.skip('PUT /providers/{id} should update provider', async () => {
    const postOrganisation = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { id: organisationId } = postOrganisation.body

    const postProvider = await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
      })
      .expect(201)
    const { id } = postProvider.body

    const updatedEndpoint = 'https://newdomain.is/api/customer'
    const updatedApiScope = 'https://newdomain.is/api/customer/.default'
    const putProvider = await request(app.getHttpServer())
      .put(`/providers/${id}`)
      .send({
        endpoint: updatedEndpoint,
        apiScope: updatedApiScope,
      })
      .expect(200)
    const { body } = putProvider
    expect(body.id).toBeTruthy()
    expect(body.organisationId).toEqual(organisationId)
    expect(body.endpoint).toEqual(updatedEndpoint)
    expect(body.endpointType).toEqual(provider.endpointType)
    expect(body.apiScope).toEqual(updatedApiScope)
    expect(body.xroad).toEqual(provider.xroad)
    expect(body.externalProviderId).toEqual(provider.externalProviderId)

    // Check for changelogs
    const changelogResponse = await request(app.getHttpServer())
      .get(`/changelogs/organisations/${organisationId}/entities/${body.id}`)
      .expect(200)
    const { body: changelogBody } = changelogResponse
    expect(changelogBody.length).toBe(2)
    const changelog = changelogBody[0]
    expect(changelog.id).toBeTruthy()
    expect(changelog.organisationId).toEqual(body.organisationId)
    expect(changelog.entityId).toEqual(body.id)
    expect(changelog.entityType).toEqual('Provider')
    const changelogData = changelog.data
    expect(changelogData.id).toEqual(body.id)
    expect(changelogData.endpoint).toEqual(updatedEndpoint)
    expect(changelogData.apiScope).toEqual(updatedApiScope)
    expect(changelogData.modifiedBy).toEqual(nationalId)
  })

  it.skip('POST /providers should allow xroad paths', async () => {
    const postOrganisation = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { id: organisationId } = postOrganisation.body

    const postProvider = await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
        endpoint: '/k2/IS-DEV/SMUUU/12345/somecorp/api/v1/customer',
      })
      .expect(201)
    const { body } = postProvider
    expect(body.id).toBeTruthy()
    expect(body.organisationId).toEqual(organisationId)
    expect(body.endpoint).toEqual(
      '/k2/IS-DEV/SMUUU/12345/somecorp/api/v1/customer',
    )
    expect(body.endpointType).toEqual(provider.endpointType)
    expect(body.apiScope).toEqual(provider.apiScope)
    expect(body.xroad).toEqual(provider.xroad)
    expect(body.externalProviderId).toEqual(provider.externalProviderId)
  })

  it.skip('GET /providers/external should return 404 if externalProviderId is not found', async () => {
    const response = await request(app.getHttpServer())
      .get(`/providers/external/${provider.externalProviderId}`)
      .expect(404)
    const { body } = response
    expect(body.error).toBe('Not Found')
    expect(body.message).toBe(
      `A provider with externalProviderId ${provider.externalProviderId} does not exist`,
    )
  })

  it.skip('GET /providers/external should find providers by external id', async () => {
    const postOrganisation = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { id: organisationId } = postOrganisation.body

    await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
      })
      .expect(201)

    const getResponse = await request(app.getHttpServer())
      .get(`/providers/external/${provider.externalProviderId}`)
      .expect(200)
    const { body } = getResponse

    expect(body.id).toBeTruthy()
    expect(body.organisationId).toEqual(organisationId)
    expect(body.endpoint).toEqual(provider.endpoint)
    expect(body.endpointType).toEqual(provider.endpointType)
    expect(body.apiScope).toEqual(provider.apiScope)
    expect(body.xroad).toEqual(provider.xroad)
    expect(body.externalProviderId).toEqual(provider.externalProviderId)
  })

  it.skip('POST /providers externalProviderId should be unique', async () => {
    const postOrganisation = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { id: organisationId } = postOrganisation.body

    await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
      })
      .expect(201)

    await request(app.getHttpServer())
      .post('/providers')
      .send({
        ...provider,
        organisationId,
      })
      .expect(500)
  })
})
