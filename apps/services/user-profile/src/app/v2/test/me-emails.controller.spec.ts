import faker from 'faker'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { formatPhoneNumber } from '../../utils/format-phone-number'
import { setupApp, TestApp } from '@island.is/testing/nest'
import request, { SuperTest, Test } from 'supertest'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { Emails } from '../models/emails.model'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { UserProfileScope } from '@island.is/auth/scopes'
import { getModelToken } from '@nestjs/sequelize'
import kennitala from 'kennitala'
import { UserProfile } from '../../user-profile/userProfile.model'

const testUserProfileEmail = {
  email: faker.internet.email(),
  primary: true,
}
const testUserProfile = {
  nationalId: createNationalId(),
  emails: [testUserProfileEmail],
  mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
}

describe('Me emails controller tests', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let emailsModel: typeof Emails
  let userProfileModel: typeof UserProfile

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read],
      }),
    })

    server = request(app.getHttpServer())
    fixtureFactory = new FixtureFactory(app)

    emailsModel = app.get<typeof Emails>(getModelToken(Emails))
    userProfileModel = app.get<typeof UserProfile>(getModelToken(UserProfile))
  })

  afterEach(async () => {
    await emailsModel.destroy({
      where: {},
      cascade: true,
      force: true,
      truncate: true,
    })
    await userProfileModel.destroy({
      where: {},
      cascade: true,
      force: true,
      truncate: true,
    })
  })

  afterAll(async () => {
    await app.cleanUp()
  })
  describe('GET /v2/me/emails', () => {
    it('should return 200 with an empty list email list', async () => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(true)
      // Arrange
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] }) // Start with an empty emails array

      // Act
      const res = await server.get(
        `/v2/me/emails?nationalId=${testUserProfile.nationalId}`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([])
    })

    it('should return 200 with a single email', async () => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(true)
      // Arrange
      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.get(
        `/v2/me/emails?nationalId=${testUserProfile.nationalId}`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([
        {
          email: testUserProfileEmail.email,
          primary: testUserProfileEmail.primary,
        },
      ])
    })

    it('should return 400 with invalid national id', async () => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(false)

      // Arrange
      const invalidNationalId = 'invalid-national-id'
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        nationalId: invalidNationalId,
      })

      // Act
      const res = await server.get('/v2/me/emails')

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        type: 'https://httpstatuses.org/400',
        title: 'Bad Request',
        detail: 'Invalid nationalId',
      })
    })

    it('should return 200 with multiple emails when multiple emails exist', async () => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(true)
      // Arrange
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] }) // Start with an empty emails array
      await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'test1@example.com',
        primary: true,
      })
      await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'test2@example.com',
        primary: false,
      })

      // Act
      const res = await server.get(
        `/v2/me/emails?nationalId=${testUserProfile.nationalId}`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([
        { email: 'test1@example.com', primary: true },
        { email: 'test2@example.com', primary: false },
      ])
    })
  })
})
