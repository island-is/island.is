import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { setup } from '../../../../../test/setup'

let app: INestApplication

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

beforeAll(async () => {
  app = await setup()
})

describe('Organisation API', () => {
  it('POST /organisations should register organisation with no related objects', async () => {
    const response = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)
    const { body } = response
    expect(body.nationalId).toEqual(simpleOrg.nationalId)
    expect(body.name).toEqual(simpleOrg.name)
    expect(body.address).toEqual(simpleOrg.address)
    expect(body.email).toEqual(simpleOrg.email)
    expect(body.phoneNumber).toEqual(simpleOrg.phoneNumber)
  })

  it('POST /organisations should register organisation with related objects', async () => {
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
  })

  it('POST /organisation should return 400 bad request on invalid input', async () => {
    const response = await request(app.getHttpServer())
      .post('/organisations')
      .send({})
      .expect(400)
    expect(response.body.error).toBe('Bad Request')
  })

  it('GET /organisations should return list of organisations', async () => {
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

  it('GET /organisations/{nationalId} should return 404 not found', async () => {
    const response = await request(app.getHttpServer())
      .get('/organisations/5234567890')
      .expect(404)
    const { body } = response
    expect(body.error).toBe('Not Found')
    expect(body.message).toBe(
      'An organisation with nationalId 5234567890 does not exist',
    )
  })

  it('GET /organisations/{nationalId} should return organisation', async () => {
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

  it('PUT /organisations should update organisation', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)

    const { id } = postResponse.body

    const response = await request(app.getHttpServer())
      .put(`/organisations/${id}`)
      .send({
        name: 'Rex Kex ehf.',
      })
      .expect(200)
    const { body } = response
    expect(body.nationalId).toEqual(simpleOrg.nationalId)
    expect(body.name).toEqual('Rex Kex ehf.')
    expect(body.address).toEqual(simpleOrg.address)
    expect(body.email).toEqual(simpleOrg.email)
    expect(body.phoneNumber).toEqual(simpleOrg.phoneNumber)
  })

  it('POST /organisations/{id}/administrativecontact should add to existing organisation', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(simpleOrg)
      .expect(201)

    const { id, nationalId } = postResponse.body

    await request(app.getHttpServer())
      .post(`/organisations/${id}/administrativecontact`)
      .send({
        name: 'Siggi CEO',
        email: 'siggi@org.is',
        phoneNumber: '5559876',
      })
      .expect(201)

    const getResponse = await request(app.getHttpServer())
      .get(`/organisations/${nationalId}`)
      .expect(200)

    const { body } = getResponse
    expect(body.administrativeContact.name).toEqual('Siggi CEO')
    expect(body.administrativeContact.email).toEqual('siggi@org.is')
    expect(body.administrativeContact.phoneNumber).toEqual('5559876')
  })

  it('PUT /organisations/{id}/administrativecontact{administrativeContactId} should update administrative contact', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(complexOrg)
      .expect(201)

    const { id } = postResponse.body
    const {
      id: administrativeContactId,
    } = postResponse.body.administrativeContact

    const putResponse = await request(app.getHttpServer())
      .put(
        `/organisations/${id}/administrativecontact/${administrativeContactId}`,
      )
      .send({ name: 'Stefán stórlax' })
      .expect(200)

    const { body } = putResponse
    expect(body.name).toEqual('Stefán stórlax')
  })

  it('POST /organisations/{id}/technicalcontact should add to existing organisation', async () => {
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
  })

  it('PUT /organisations/{id}/technicalcontact{technicalContactId} should update technical contact', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(complexOrg)
      .expect(201)

    const { id } = postResponse.body
    const { id: technicalContactId } = postResponse.body.technicalContact

    const putResponse = await request(app.getHttpServer())
      .put(`/organisations/${id}/technicalcontact/${technicalContactId}`)
      .send({ name: 'Tóti tölvukall' })
      .expect(200)

    const { body } = putResponse
    expect(body.name).toEqual('Tóti tölvukall')
  })

  it('POST /organisations/{id}/helpdesk should add to existing organisation', async () => {
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
  })

  it('PUT /organisations/{id}/helpdesk{helpdeskId} should update helpdesk', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/organisations')
      .send(complexOrg)
      .expect(201)

    const { id } = postResponse.body
    const { id: helpdeskId } = postResponse.body.helpdesk

    const putResponse = await request(app.getHttpServer())
      .put(`/organisations/${id}/helpdesk/${helpdeskId}`)
      .send({ email: 'sos@sameinadir.is' })
      .expect(200)

    const { body } = putResponse
    expect(body.email).toEqual('sos@sameinadir.is')
  })
})
