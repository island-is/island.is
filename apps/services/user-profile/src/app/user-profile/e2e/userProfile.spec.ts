import { setup } from '../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
  console.log(app)
})

describe('User profile API', () => {
  it(`POST /userProfile should register userProfile`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .post('/userProfile')
      .send({
        nationalId: '1234567890',
        mobilePhoneNumber: '123456799',
        locale: 'en',
        email: 'email@email.is',
      })
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })

  it(`POST /userProfile should return 400 bad request on invalid locale`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .post('/userProfile')
      .send({
        nationalId: '1234567890',
        mobilePhoneNumber: '123456799',
        locale: 'en123',
        email: 'email@email.is',
      })
      .expect(400)

    // Assert
    expect(response.body.error).toBe('Bad Request')

    expect(response.body.message).toEqual(
      expect.arrayContaining(['locale must be a valid enum value']),
    )
  })

  it(`GET /userProfile should return 404 not found error msg`, async () => {
    const getResponse = await request(app.getHttpServer())
      .get(`/userProfile/1231231231231`)
      .expect(404)

    // Assert
    expect(getResponse.body.error).toBe('Not Found')
    expect(getResponse.body.message).toBe(
      'A user profile with nationalId 1231231231231 does not exist',
    )
  })

  it(`GET /userProfile should return profile`, async () => {
    //Arrange
    const profile = {
      nationalId: '1234567890',
      mobilePhoneNumber: '123456799',
      locale: 'en',
      email: 'email@email.is',
    }

    // Act
    await request(app.getHttpServer()).post('/userProfile').send(profile)

    const getResponse = await request(app.getHttpServer())
      .get(`/userProfile/${profile.nationalId}`)
      .expect(200)

    // Assert
    expect(getResponse.body).toEqual(
      expect.objectContaining({ nationalId: profile.nationalId }),
    )
    expect(getResponse.body).toEqual(
      expect.objectContaining({ locale: profile.locale }),
    )
    expect(getResponse.body).toEqual(
      expect.objectContaining({ mobilePhoneNumber: profile.mobilePhoneNumber }),
    )
    expect(getResponse.body).toEqual(
      expect.objectContaining({ email: profile.email }),
    )
  })

  it(`PUT /userProfile/ should return 404 not found error msg`, async () => {
    const updatedProfile = {
      mobilePhoneNumber: '987654331',
      locale: 'is',
      email: 'email@email.is',
    }

    // Act
    const updateResponse = await request(app.getHttpServer())
      .put(`/userProfile/12312312313`)
      .send(updatedProfile)
      .expect(404)

    // Assert
    expect(updateResponse.body.error).toBe('Not Found')
    expect(updateResponse.body.message).toBe(
      'A user profile with nationalId 12312312313 does not exist',
    )
  })
  it(`PUT /userProfile should update profile`, async () => {
    //Arrange
    const profile = {
      nationalId: '1234567890',
      mobilePhoneNumber: '123456799',
      locale: 'en',
      email: 'email@email.is',
    }
    const updatedProfile = {
      mobilePhoneNumber: '987654331',
      locale: 'is',
      email: 'email@email.is',
    }

    // Act
    await request(app.getHttpServer()).post('/userProfile').send(profile)

    const updateResponse = await request(app.getHttpServer())
      .put(`/userProfile/${profile.nationalId}`)
      .send(updatedProfile)
      .expect(200)

    // Assert
    expect(updateResponse.body).toEqual(
      expect.objectContaining({ nationalId: profile.nationalId }),
    )
    expect(updateResponse.body).toEqual(
      expect.objectContaining({ locale: updatedProfile.locale }),
    )
    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        mobilePhoneNumber: updatedProfile.mobilePhoneNumber,
      }),
    )
    expect(updateResponse.body).toEqual(
      expect.objectContaining({ email: updatedProfile.email }),
    )
  })

  it(`POST /userProfile should return conflict on existing nationalId`, async () => {
    // Act
    await request(app.getHttpServer())
      .post('/userProfile')
      .send({
        nationalId: '1234567890',
        mobilePhoneNumber: '123456799',
        locale: 'en',
        email: 'email@email.is',
      })
      .expect(201)

    const conflictResponse = await request(app.getHttpServer())
      .post('/userProfile')
      .send({
        nationalId: '1234567890',
        mobilePhoneNumber: '123456799',
        locale: 'en',
        email: 'email@email.is',
      })
      .expect(409)

    // Assert
    expect(conflictResponse.body.error).toBe('Conflict')
    expect(conflictResponse.body.message).toBe(
      'A profile with nationalId - "1234567890" already exists',
    )
  })
})
