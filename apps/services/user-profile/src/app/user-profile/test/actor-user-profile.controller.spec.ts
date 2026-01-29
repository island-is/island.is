import { getModelToken } from '@nestjs/sequelize'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import request, { SuperTest, Test } from 'supertest'
import { v4 as uuid } from 'uuid'

import { UserProfileScope } from '@island.is/auth/scopes'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
  createVerificationCode,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import faker from 'faker'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { NudgeType } from '../../types/nudge-type'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { UserProfile } from '../models/userProfile.model'
import { VerificationService } from '../verification.service'
import { formatPhoneNumber } from '../utils/format-phone-number'
import { ActorProfile } from '../models/actor-profile.model'
import { Emails } from '../models/emails.model'
import { NUDGE_INTERVAL, SKIP_INTERVAL } from '../user-profile.service'

const testUserProfileEmail = {
  email: faker.internet.email(),
  primary: true,
  emailStatus: DataStatus.VERIFIED,
}
const testUserProfile = {
  nationalId: createNationalId(),
  emails: [testUserProfileEmail],
  mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
}

describe('GET v2/actor/actor-profile', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let appWithNoActor: TestApp
  let serverWithNoActor: SuperTest<Test>

  let fixtureFactory: FixtureFactory
  let userProfileModel: typeof UserProfile
  let actorProfileModel: typeof ActorProfile
  let delegationsApi: DelegationsApi
  let emailsModel: typeof Emails
  const testNationalId1 = createNationalId('person')

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read],
        actor: {
          nationalId: testNationalId1,
          scope: [UserProfileScope.read],
        },
      }),
    })

    appWithNoActor = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read],
        // No actor property
      }),
    })

    server = request(app.getHttpServer())
    serverWithNoActor = request(appWithNoActor.getHttpServer())
    fixtureFactory = new FixtureFactory(app)
    delegationsApi = app.get(DelegationsApi)
    userProfileModel = app.get(getModelToken(UserProfile))
    actorProfileModel = app.get(getModelToken(ActorProfile))
    emailsModel = app.get(getModelToken(Emails))
  })

  beforeEach(async () => {
    await userProfileModel.destroy({
      truncate: true,
    })
    await actorProfileModel.destroy({
      truncate: true,
    })
    await emailsModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })

    // Mock delegations API to return a delegation between the test user and testNationalId1
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testNationalId1,
            fromNationalId: testUserProfile.nationalId,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 1,
      })
  })

  afterAll(async () => {
    await app.cleanUp()
    await appWithNoActor.cleanUp()
  })

  it('should return 400 when user does not have an actor property', async () => {
    ''
    // Act
    const res = await serverWithNoActor.get('/v2/actor/actor-profile')

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: 'User has no actor profile',
    })
  })

  it('should return actor profile with all required fields', async () => {
    // Arrange
    // Create a user profile for the actor with a verified email
    try {
      const userProfile = await fixtureFactory.createUserProfile({
        nationalId: testNationalId1,
        emails: [
          {
            email: 'test@example.com',
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
      })

      const nextNudgeDate = subMonths(new Date(), 1) // 1 month ago, to test needsNudge=true

      // Create the actor profile for the relationship
      await actorProfileModel.create({
        id: uuid(),
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
        emailNotifications: true,
        emailsId: userProfile.emails?.[0].id,
        nextNudge: nextNudgeDate,
      })
    } catch (error) {
      throw new Error('Error creating actor profile' + error)
    }

    // Act
    const res = await server.get('/v2/actor/actor-profile')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: 'test@example.com',
      emailStatus: DataStatus.VERIFIED,
      emailVerified: true,
      needsNudge: true, // Should be true because nextNudge is in the past
      nationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })
  })

  it('should return actor profile with unverified email', async () => {
    // Arrange
    try {
      // Create a user profile for the actor with an unverified email
      const userProfile = await fixtureFactory.createUserProfile({
        nationalId: testNationalId1,
        emails: [
          {
            email: 'unverified@example.com',
            primary: true,
            emailStatus: DataStatus.NOT_VERIFIED,
          },
        ],
      })

      const nextNudgeDate = addMonths(new Date(), 1) // 1 month in future, to test needsNudge=false

      // Create the actor profile for the relationship
      await actorProfileModel.create({
        id: uuid(),
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
        emailNotifications: false,
        emailsId: userProfile.emails?.[0].id,
        nextNudge: nextNudgeDate,
      })
    } catch (error) {
      throw new Error('Error creating actor profile' + error)
    }

    // Act
    const res = await server.get('/v2/actor/actor-profile')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: 'unverified@example.com',
      emailStatus: DataStatus.NOT_VERIFIED,
      emailVerified: false,
      needsNudge: null, // nextNudge is in the future and there is no verified contact info
      nationalId: testUserProfile.nationalId,
      emailNotifications: false,
    })
  })

  it('should handle actor profile with no email connected', async () => {
    // Arrange
    // Create an actor profile without an emailsId
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testNationalId1,
      fromNationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })

    // Act
    const res = await server.get('/v2/actor/actor-profile')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: null,
      emailStatus: DataStatus.NOT_DEFINED,
      emailVerified: false,
      needsNudge: null, // No nextNudge, no email, no phone, so result should be null
      nationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })
  })

  it('should return 200 when actor profile does not exist', async () => {
    // No actor profile in the database

    // Act
    const res = await server.get('/v2/actor/actor-profile')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: null,
      emailStatus: DataStatus.NOT_VERIFIED,
      emailVerified: false,
      needsNudge: null,
      nationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })
  })

  it('should return 200 when actor profile does not exist with userProfile defaults', async () => {
    // Create a user profile for the actor with a verified email
    const userProfile = await fixtureFactory.createUserProfile({
      nationalId: testNationalId1,
      emails: [
        {
          email: 'test@example.com',
          primary: true,
          emailStatus: DataStatus.VERIFIED,
        },
      ],
    })

    // Act
    const res = await server.get('/v2/actor/actor-profile')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: userProfile.emails?.[0].email,
      emailStatus: userProfile.emails?.[0].emailStatus,
      emailVerified:
        userProfile.emails?.[0].emailStatus === DataStatus.VERIFIED,
      needsNudge: null,
      nationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })
  })

  it('should return 400 when delegation does not exist', async () => {
    // Mock delegations API to return empty result
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValueOnce({
        data: [], // No delegations
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 0,
      })

    try {
      // Create the actor profile directly without creating a user profile first
      // This reduces the number of database operations
      await actorProfileModel.create({
        id: uuid(),
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
        emailNotifications: true,
      })
    } catch (error) {
      throw new Error('Error creating actor profile' + error)
      // You might want to fail the test if this creation fails
      // throw error;
    }

    // Act
    const res = await server.get('/v2/actor/actor-profile')

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: 'Delegation does not exist',
    })
  })
})

describe('POST /v2/actor/actor-profile/nudge', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let userProfileModel: typeof UserProfile
  let actorProfileModel: typeof ActorProfile
  let delegationsApi: DelegationsApi
  let emailsModel: typeof Emails
  const testNationalId1 = createNationalId('person')

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read],
        actor: {
          nationalId: testNationalId1,
          scope: [UserProfileScope.read],
        },
      }),
    })

    server = request(app.getHttpServer())
    delegationsApi = app.get(DelegationsApi)
    userProfileModel = app.get(getModelToken(UserProfile))
    actorProfileModel = app.get(getModelToken(ActorProfile))
    emailsModel = app.get(getModelToken(Emails))
  })

  beforeEach(async () => {
    await userProfileModel.destroy({
      truncate: true,
    })
    await actorProfileModel.destroy({
      truncate: true,
    })
    await emailsModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })

    // Mock delegations API to return a delegation between the test user and testNationalId1
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testNationalId1,
            fromNationalId: testUserProfile.nationalId,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 1,
      })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('should update lastNudge and set nextNudge to 6 months for NUDGE type', async () => {
    // Arrange
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testNationalId1,
      fromNationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })

    // Act
    const res = await server
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.NUDGE,
      })

    // Assert
    expect(res.status).toEqual(200)

    // Verify actor profile was updated correctly
    const updatedActorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })

    expect(updatedActorProfile).not.toBeNull()
    if (!updatedActorProfile) return // Type guard for TypeScript
    expect(updatedActorProfile.lastNudge).not.toBeNull()

    // Verify that nextNudge is set to 6 months after lastNudge
    if (!updatedActorProfile.lastNudge) return
    const expectedNextNudge = addMonths(
      updatedActorProfile.lastNudge,
      NUDGE_INTERVAL,
    )
    // Compare dates ignoring milliseconds for potential minor discrepancies
    expect(updatedActorProfile.nextNudge).not.toBeNull()
    if (!updatedActorProfile.nextNudge) return
    expect(
      updatedActorProfile.nextNudge.toISOString().substring(0, 22),
    ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
  })

  it('should update lastNudge and set nextNudge to 1 month for SKIP_EMAIL type', async () => {
    // Arrange
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testNationalId1,
      fromNationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })

    // Act
    const res = await server
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.SKIP_EMAIL,
      })

    // Assert
    expect(res.status).toEqual(200)

    // Verify actor profile was updated correctly
    const updatedActorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })

    expect(updatedActorProfile).not.toBeNull()
    if (!updatedActorProfile) return // Type guard for TypeScript
    expect(updatedActorProfile.lastNudge).not.toBeNull()

    // Verify that nextNudge is set to 1 month after lastNudge
    if (!updatedActorProfile.lastNudge) return
    const expectedNextNudge = addMonths(
      updatedActorProfile.lastNudge,
      SKIP_INTERVAL,
    )
    // Compare dates ignoring milliseconds for potential minor discrepancies
    expect(updatedActorProfile.nextNudge).not.toBeNull()
    if (!updatedActorProfile.nextNudge) return
    expect(
      updatedActorProfile.nextNudge.toISOString().substring(0, 22),
    ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
  })

  it('should update lastNudge and set nextNudge to 1 month for SKIP_PHONE type', async () => {
    // Arrange
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testNationalId1,
      fromNationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })

    // Act
    const res = await server
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.SKIP_PHONE,
      })

    // Assert
    expect(res.status).toEqual(200)

    // Verify actor profile was updated correctly
    const updatedActorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })

    expect(updatedActorProfile).not.toBeNull()
    if (!updatedActorProfile) return // Type guard for TypeScript
    expect(updatedActorProfile.lastNudge).not.toBeNull()

    // Verify that nextNudge is set to 1 month after lastNudge
    if (!updatedActorProfile.lastNudge) return
    const expectedNextNudge = addMonths(
      updatedActorProfile.lastNudge,
      SKIP_INTERVAL,
    )
    // Compare dates ignoring milliseconds for potential minor discrepancies
    expect(updatedActorProfile.nextNudge).not.toBeNull()
    if (!updatedActorProfile.nextNudge) return
    expect(
      updatedActorProfile.nextNudge.toISOString().substring(0, 22),
    ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
  })

  it('should update existing nudge dates when actor profile already has them', async () => {
    // Arrange
    const existingLastNudge = subMonths(new Date(), 2) // 2 months ago
    const existingNextNudge = addMonths(new Date(), 4) // 4 months in future

    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testNationalId1,
      fromNationalId: testUserProfile.nationalId,
      emailNotifications: true,
      lastNudge: existingLastNudge,
      nextNudge: existingNextNudge,
    })

    // Act
    const res = await server
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.NUDGE,
      })

    // Assert
    expect(res.status).toEqual(200)

    // Verify actor profile was updated correctly
    const updatedActorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })

    expect(updatedActorProfile).not.toBeNull()
    if (!updatedActorProfile) return // Type guard for TypeScript
    expect(updatedActorProfile.lastNudge).not.toBeNull()

    if (!updatedActorProfile.lastNudge) return

    // Verify dates were updated
    expect(updatedActorProfile.lastNudge.getTime()).not.toEqual(
      existingLastNudge.getTime(),
    )
    expect(updatedActorProfile.nextNudge).not.toBeNull()

    if (!updatedActorProfile.nextNudge) return
    expect(updatedActorProfile.nextNudge.getTime()).not.toEqual(
      existingNextNudge.getTime(),
    )

    // Verify that nextNudge is set to 6 months after lastNudge
    const expectedNextNudge = addMonths(
      updatedActorProfile.lastNudge,
      NUDGE_INTERVAL,
    )
    // Compare dates ignoring milliseconds for potential minor discrepancies
    expect(
      updatedActorProfile.nextNudge.toISOString().substring(0, 22),
    ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
  })

  it('should handle nudge update for profile with very old dates', async () => {
    // Arrange
    const oldDate = new Date('2000-01-01')

    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testNationalId1,
      fromNationalId: testUserProfile.nationalId,
      emailNotifications: false, // Testing with different flag value
      lastNudge: oldDate,
      nextNudge: oldDate,
    })

    // Act
    const res = await server
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.SKIP_EMAIL,
      })

    // Assert
    expect(res.status).toEqual(200)

    // Verify actor profile was updated correctly
    const updatedActorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })

    expect(updatedActorProfile).not.toBeNull()
    if (!updatedActorProfile) return // Type guard for TypeScript

    // Verify lastNudge was updated to a recent time
    expect(updatedActorProfile.lastNudge).not.toBeNull()
    if (!updatedActorProfile.lastNudge) return

    // Verify old dates were updated
    const currentYear = new Date().getFullYear()
    expect(updatedActorProfile.lastNudge.getFullYear()).toEqual(currentYear)

    // Verify emailNotifications was preserved
    expect(updatedActorProfile.emailNotifications).toEqual(false)

    // Verify that nextNudge is set to 1 month after lastNudge (SKIP_INTERVAL)
    expect(updatedActorProfile.nextNudge).not.toBeNull()
    if (!updatedActorProfile.nextNudge) return

    const expectedNextNudge = addMonths(
      updatedActorProfile.lastNudge,
      SKIP_INTERVAL,
    )
    // Compare dates ignoring milliseconds for potential minor discrepancies
    expect(
      updatedActorProfile.nextNudge.toISOString().substring(0, 22),
    ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
  })

  it('should return 400 when delegation does not exist', async () => {
    // Arrange
    // Mock delegations API to return empty result
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValueOnce({
        data: [], // No delegations
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 0,
      })

    // Act
    const res = await server
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.NUDGE,
      })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: 'Delegation does not exist',
    })
  })

  it('should return 200 when actor profile does not exist and should create a new one', async () => {
    // Arrange - No actor profile in database

    // Act
    const res = await server
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.NUDGE,
      })

    // Assert
    expect(res.status).toEqual(200)

    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })

    expect(actorProfile).not.toBeNull()
    if (!actorProfile) return // Type guard for TypeScript
    expect(actorProfile.emailNotifications).toEqual(true)
    expect(actorProfile.lastNudge).not.toBeNull()
    expect(actorProfile.nextNudge).not.toBeNull()
  })

  it('should return 400 when user does not have an actor property', async () => {
    // Arrange
    const appWithNoActor = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read],
        // No actor property
      }),
    })
    const serverWithNoActor = request(appWithNoActor.getHttpServer())

    // Act
    const res = await serverWithNoActor
      .post('/v2/actor/actor-profile/nudge')
      .set('X-Param-From-National-Id', testUserProfile.nationalId)
      .send({
        nudgeType: NudgeType.NUDGE,
      })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: 'User has no actor profile',
    })

    await appWithNoActor.cleanUp()
  })
})

describe('GET v2/actor/actor-profiles', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let userProfileModel: typeof UserProfile
  let actorProfileModel: typeof ActorProfile
  let delegationsApi: DelegationsApi

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
    delegationsApi = app.get(DelegationsApi)
    userProfileModel = app.get(getModelToken(UserProfile))
    actorProfileModel = app.get(getModelToken(ActorProfile))
  })

  beforeEach(async () => {
    await userProfileModel.destroy({
      truncate: true,
    })
    await actorProfileModel.destroy({
      truncate: true,
    })
  })

  afterAll(async () => {
    await app.cleanUp()
  })
  it('should return 200 and the actor profile for each delegation', async () => {
    const testNationalId1 = createNationalId('person')
    const testNationalId2 = createNationalId('person')

    // Arrange
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId1,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId2,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 2,
      })

    await fixtureFactory.createUserProfile({
      nationalId: testNationalId1,
      emails: [],
    })

    const email1 = await fixtureFactory.createEmail({
      email: 'test@example.com',
      primary: true,
      emailStatus: DataStatus.VERIFIED,
      nationalId: testNationalId1,
    })

    // only create actor profile for one of the delegations
    await fixtureFactory.createActorProfile({
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: false,
      emailsId: email1.id,
    })

    // Act
    const res = await server.get('/v2/actor/actor-profiles')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body.data[0]).toStrictEqual({
      email: email1.email,
      emailVerified: email1.emailStatus === DataStatus.VERIFIED,
      fromNationalId: testNationalId1,
      emailNotifications: false,
      emailsId: email1.id,
    })
    // Should default to true because we don't have a record for this delegation
    expect(res.body.data[1]).toStrictEqual({
      fromNationalId: testNationalId2,
      emailNotifications: true,
      email: null,
      emailVerified: false,
    })

    expect(
      delegationsApi.delegationsControllerGetDelegationRecords,
    ).toHaveBeenCalledWith({
      xQueryNationalId: testUserProfile.nationalId,
      scopes:
        '@island.is/documents,@island.is/applications/samgongustofa-vehicles',
      direction: 'incoming',
    })
  })

  it('should return an empty array when there are no delegations', async () => {
    // Arrange
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 0,
      })

    // Act
    const res = await server.get('/v2/actor/actor-profiles')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
      },
    })
  })

  it('should return actor profiles with multiple profiles having emailsId', async () => {
    const testNationalId1 = createNationalId('person')
    const testNationalId2 = createNationalId('person')

    // Arrange
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId1,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId2,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 2,
      })

    // Create user profiles and emails for both delegations
    await fixtureFactory.createUserProfile({
      nationalId: testNationalId1,
      emails: [],
    })

    const email1 = await fixtureFactory.createEmail({
      email: 'test1@example.com',
      primary: true,
      emailStatus: DataStatus.VERIFIED,
      nationalId: testNationalId1,
    })

    await fixtureFactory.createUserProfile({
      nationalId: testNationalId2,
      emails: [],
    })

    const email2 = await fixtureFactory.createEmail({
      email: 'test2@example.com',
      primary: true,
      emailStatus: DataStatus.VERIFIED,
      nationalId: testNationalId2,
    })

    // Create actor profiles for both delegations
    await fixtureFactory.createActorProfile({
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: false,
      emailsId: email1.id,
    })

    await fixtureFactory.createActorProfile({
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId2,
      emailNotifications: true,
      emailsId: email2.id,
    })

    // Act
    const res = await server.get('/v2/actor/actor-profiles')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.data[0]).toStrictEqual({
      fromNationalId: testNationalId1,
      emailNotifications: false,
      emailsId: email1.id,
      email: email1.email,
      emailVerified: email1.emailStatus === DataStatus.VERIFIED,
    })
    expect(res.body.data[1]).toStrictEqual({
      fromNationalId: testNationalId2,
      emailNotifications: true,
      emailsId: email2.id,
      email: email2.email,
      emailVerified: email2.emailStatus === DataStatus.VERIFIED,
    })
  })

  it('should handle delegations API errors gracefully', async () => {
    // Arrange
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockRejectedValue(new Error('Service unavailable'))

    // Act
    const res = await server.get('/v2/actor/actor-profiles')

    // Assert
    expect(res.status).toEqual(500) // Should return internal server error
  })

  it('should return actor profiles with different delegation types', async () => {
    const testNationalId1 = createNationalId('person')
    const testNationalId2 = createNationalId('person')

    // Arrange
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId1,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId2,
            subjectId: 'document-123',
            type: 'document-delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 2,
      })

    // Create actor profile for the first delegation only
    await fixtureFactory.createActorProfile({
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: false,
    })

    // Act
    const res = await server.get('/v2/actor/actor-profiles')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.data[0]).toMatchObject({
      fromNationalId: testNationalId1,
      emailNotifications: false,
      email: null,
      emailVerified: false,
    })
    expect(res.body.data[1]).toMatchObject({
      fromNationalId: testNationalId2,
      emailNotifications: true,
      email: null,
      emailVerified: false,
    })

    // Verify it used the correct parameters
    expect(
      delegationsApi.delegationsControllerGetDelegationRecords,
    ).toHaveBeenCalledWith({
      xQueryNationalId: testUserProfile.nationalId,
      scopes:
        '@island.is/documents,@island.is/applications/samgongustofa-vehicles',
      direction: 'incoming',
    })
  })
})

describe('PATCH /v2/actor/actor-profile/email', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let userProfileModel: typeof UserProfile
  let actorProfileModel: typeof ActorProfile
  let delegationsApi: DelegationsApi
  let emailsModel: typeof Emails
  const testNationalId1 = createNationalId('person')
  const testEmail = faker.internet.email()
  let email1: Emails
  let email2: Emails

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.write, UserProfileScope.read],
        actor: {
          nationalId: testNationalId1,
          scope: [UserProfileScope.read],
        },
      }),
      dbType: 'postgres', // Using postgres for verification attempt handling
    })

    server = request(app.getHttpServer())
    fixtureFactory = new FixtureFactory(app)
    delegationsApi = app.get(DelegationsApi)
    userProfileModel = app.get(getModelToken(UserProfile))
    actorProfileModel = app.get(getModelToken(ActorProfile))
    emailsModel = app.get(getModelToken(Emails))
  })

  beforeEach(async () => {
    await userProfileModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })
    await actorProfileModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })
    await emailsModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })

    // Create user profile first to satisfy foreign key constraints for all tests
    await fixtureFactory.createUserProfile({
      nationalId: testUserProfile.nationalId,
      emails: [],
    })

    // Create email first to satisfy foreign key constraints for all tests
    email1 = await fixtureFactory.createEmail({
      email: testEmail,
      emailStatus: DataStatus.VERIFIED,
      nationalId: testUserProfile.nationalId,
      primary: true,
    })

    email2 = await fixtureFactory.createEmail({
      email: 'test2@test.com',
      emailStatus: DataStatus.VERIFIED,
      nationalId: testUserProfile.nationalId,
      primary: false,
    })

    // Mock delegations API to return a delegation between the test user and testNationalId1
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testNationalId1,
            fromNationalId: testUserProfile.nationalId,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 1,
      })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('should create actor profile with email', async () => {
    // Act
    const res = await server.patch('/v2/actor/actor-profile/email').send({
      emailsId: email1.id,
    })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: email1.email,
      emailStatus: email1.emailStatus,
      needsNudge: false,
      nationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })

    // Verify email record created
    const email = await emailsModel.findOne({
      where: {
        email: testEmail,
        nationalId: testUserProfile.nationalId,
      },
    })
    expect(email).not.toBeNull()
    expect(email?.emailStatus).toBe(DataStatus.VERIFIED)

    // Verify actor profile created with reference to email
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.emailsId).toBe(email?.id)
    expect(actorProfile?.emailNotifications).toBe(true)
  })

  it('should update actor profile with new email id', async () => {
    // Arrange
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testNationalId1,
      fromNationalId: testUserProfile.nationalId,
      emailsId: email1.id,
      emailNotifications: true,
    })

    // Act
    const res = await server.patch('/v2/actor/actor-profile/email').send({
      emailsId: email2.id,
    })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: email2.email,
      emailStatus: email2.emailStatus,
      needsNudge: false,
      nationalId: testUserProfile.nationalId,
      emailNotifications: true,
    })

    // Verify actor profile updated
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.emailsId).toBe(email2.id)
    expect(actorProfile?.emailNotifications).toBe(true)
  })

  it('should return 400 when email does not exist', async () => {
    // Arrange
    const nonExistentEmailId = uuid()

    // Act
    const res = await server.patch('/v2/actor/actor-profile/email').send({
      emailsId: nonExistentEmailId,
    })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: `Email with ID ${nonExistentEmailId} not found`,
    })
  })

  it('should return 400 when email is not verified', async () => {
    const newEmail = await fixtureFactory.createEmail({
      email: 'test3@test.com',
      emailStatus: DataStatus.NOT_VERIFIED,
      nationalId: testUserProfile.nationalId,
      primary: false,
    })

    // Act
    const res = await server.patch('/v2/actor/actor-profile/email').send({
      emailsId: newEmail.id,
    })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: 'Email is not verified',
    })
  })
})

describe('PATCH /v2/actor/actor-profile', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let userProfileModel: typeof UserProfile
  let actorProfileModel: typeof ActorProfile
  let delegationsApi: DelegationsApi
  let emailsModel: typeof Emails
  let verificationService: VerificationService
  const testNationalId1 = createNationalId('person')
  const testEmail = faker.internet.email()
  const testVerificationCode = createVerificationCode()

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testNationalId1,
        scope: [UserProfileScope.read],
        actor: {
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read],
        },
      }),
      dbType: 'postgres', // Using postgres for verification attempt handling
    })

    server = request(app.getHttpServer())
    fixtureFactory = new FixtureFactory(app)
    delegationsApi = app.get(DelegationsApi)
    userProfileModel = app.get(getModelToken(UserProfile))
    actorProfileModel = app.get(getModelToken(ActorProfile))
    emailsModel = app.get(getModelToken(Emails))
    verificationService = app.get(VerificationService)
  })

  beforeEach(async () => {
    await userProfileModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })
    await actorProfileModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })
    await emailsModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })

    // Create user profile first to satisfy foreign key constraints for all tests
    await fixtureFactory.createUserProfile({
      nationalId: testUserProfile.nationalId,
    })

    // Mock delegations API to return a delegation between the test user and testNationalId1
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId1,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 1,
      })

    // Mock email verification
    jest
      .spyOn(verificationService, 'confirmEmail')
      .mockImplementation(({ hash }) => {
        if (hash === testVerificationCode) {
          return Promise.resolve({
            confirmed: true,
            message: 'Verified',
            remainingAttempts: 3,
          })
        } else {
          return Promise.resolve({
            confirmed: false,
            message: 'Verification code does not match.',
            remainingAttempts: 2,
          })
        }
      })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('should create new email and actor profile when email does not exist and verification code is correct', async () => {
    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      email: testEmail,
      emailVerificationCode: testVerificationCode,
      emailNotifications: true,
    })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: testEmail,
      emailStatus: DataStatus.VERIFIED,
      needsNudge: false,
      nationalId: testNationalId1,
      emailNotifications: true,
    })

    // Verify email record created
    const email = await emailsModel.findOne({
      where: {
        email: testEmail,
      },
    })
    expect(email).not.toBeNull()
    expect(email?.emailStatus).toBe(DataStatus.VERIFIED)

    // Verify actor profile created
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.emailsId).toBe(email?.id)
    expect(actorProfile?.emailNotifications).toBe(true)
  })

  it('should update existing email when email exists and verification code is correct', async () => {
    // Arrange
    const existingEmail = await emailsModel.create({
      id: uuid(),
      email: testEmail,
      nationalId: testUserProfile.nationalId,
      primary: false,
      emailStatus: DataStatus.NOT_VERIFIED,
    })

    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      email: testEmail,
      emailVerificationCode: testVerificationCode,
      emailNotifications: true,
    })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: testEmail,
      emailStatus: DataStatus.VERIFIED,
      needsNudge: false,
      nationalId: testNationalId1,
      emailNotifications: true,
    })

    // Verify email record updated
    const updatedEmail = await emailsModel.findByPk(existingEmail.id)
    expect(updatedEmail).not.toBeNull()
    expect(updatedEmail?.emailStatus).toBe(DataStatus.VERIFIED)

    // Verify actor profile created with reference to email
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.emailsId).toBe(existingEmail.id)
    expect(actorProfile?.emailNotifications).toBe(true)
  })

  it('should update existing actor profile with new email', async () => {
    // Arrange - Create actor profile
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: false,
    })

    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      email: testEmail,
      emailVerificationCode: testVerificationCode,
      emailNotifications: true,
    })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: testEmail,
      emailStatus: DataStatus.VERIFIED,
      needsNudge: false,
      nationalId: testNationalId1,
      emailNotifications: true,
    })

    // Verify email record created
    const email = await emailsModel.findOne({
      where: {
        email: testEmail,
      },
    })
    expect(email).not.toBeNull()
    expect(email?.emailStatus).toBe(DataStatus.VERIFIED)

    // Verify actor profile updated
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.emailsId).toBe(email?.id)
    expect(actorProfile?.emailNotifications).toBe(true)
  })

  it('should update only emailNotifications when only that field is provided', async () => {
    // Arrange - Create actor profile first
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: false,
    })

    // Check if email_id is null
    await actorProfileModel.findOne({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })

    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      emailNotifications: true,
    })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: '', // Should be empty since no email is provided
      emailStatus: DataStatus.NOT_DEFINED,
      needsNudge: false,
      nationalId: testNationalId1,
      emailNotifications: true,
    })

    // Verify actor profile updated
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.emailNotifications).toBe(true)
    expect(actorProfile?.emailsId).toBeNull() // No email attached
  })

  it('should return 400 when email is provided without verification code', async () => {
    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      email: testEmail,
    })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: 'Email verification code is required',
    })
  })

  it('should return 400 when verification code is invalid', async () => {
    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      email: testEmail,
      emailVerificationCode: 'invalid-code',
    })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Attempt Failed',
      status: 400,
      detail:
        '2 attempts remaining. Validation issues found in field: emailVerificationCode',
      remainingAttempts: 2,
      type: 'https://docs.devland.is/reference/problems/attempt-failed',
    })
  })

  it('should update the actor profile next nudge date', async () => {
    // Arrange - Create actor profile with specific nudge dates
    const initialLastNudge = subMonths(new Date(), 1)
    const initialNextNudge = addMonths(new Date(), 5)

    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: true,
      lastNudge: initialLastNudge,
      nextNudge: initialNextNudge,
    })

    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      emailNotifications: false,
    })

    // Assert
    expect(res.status).toEqual(200)

    // Verify nudge dates were updated
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.lastNudge).not.toEqual(initialLastNudge)
    expect(actorProfile?.nextNudge).not.toEqual(initialNextNudge)

    // Verify nextNudge is set to NUDGE_INTERVAL months after lastNudge
    if (actorProfile?.lastNudge) {
      const expectedNextNudge = addMonths(
        actorProfile.lastNudge,
        NUDGE_INTERVAL,
      )
      expect(actorProfile?.nextNudge?.toISOString().substring(0, 22)).toEqual(
        expectedNextNudge.toISOString().substring(0, 22),
      )
    }
  })

  it('should allow updating only email without changing emailNotifications', async () => {
    // Arrange - Create actor profile first with specific emailNotifications value
    await actorProfileModel.create({
      id: uuid(),
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: false, // Set to false initially
    })

    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      email: testEmail,
      emailVerificationCode: testVerificationCode,
      // No emailNotifications field
    })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      email: testEmail,
      emailStatus: DataStatus.VERIFIED,
      needsNudge: false,
      nationalId: testNationalId1,
      emailNotifications: false, // Should maintain the original value
    })

    // Verify actor profile updated
    const actorProfile = await actorProfileModel.findOne({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })
    expect(actorProfile).not.toBeNull()
    expect(actorProfile?.emailNotifications).toBe(false) // Should maintain original value
  })

  it('should return 400 when email is an empty string', async () => {
    // Act
    const res = await server.patch('/v2/actor/actor-profile').send({
      email: '',
      emailNotifications: true,
    })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: ['Email must be a valid email address'],
    })
  })

  it('should return 400 when user has no actor profile', async () => {
    // Arrange
    const appWithNoActor = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read],
        // No actor property
      }),
    })
    const serverWithNoActor = request(appWithNoActor.getHttpServer())

    // Act
    const res = await serverWithNoActor.patch('/v2/actor/actor-profile').send({
      emailNotifications: true,
    })

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchObject({
      title: 'Bad Request',
      status: 400,
      detail: 'User has no actor profile',
    })

    await appWithNoActor.cleanUp()
  })
})

describe('PATCH v2/actor/actor-profiles/.from-national-id', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let userProfileModel: typeof UserProfile
  let delegationPreferenceModel: typeof ActorProfile
  let emailsModel: typeof Emails
  let delegationsApi: DelegationsApi
  const testNationalId1 = createNationalId('person')
  let testEmailsId = uuid()
  let testEmail2Id = uuid()

  const email1Data = {
    email: 'test@example.com',
    primary: true,
    emailStatus: DataStatus.VERIFIED,
    nationalId: testNationalId1,
  }

  const email2Data = {
    email: 'test2@example.com',
    primary: false,
    emailStatus: DataStatus.VERIFIED,
    nationalId: testNationalId1,
  }

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
    delegationsApi = app.get(DelegationsApi)
    userProfileModel = app.get(getModelToken(UserProfile))
    delegationPreferenceModel = app.get(getModelToken(ActorProfile))
    emailsModel = app.get(getModelToken(Emails))
  })

  beforeEach(async () => {
    await userProfileModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })
    await delegationPreferenceModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })

    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [
          {
            toNationalId: testUserProfile.nationalId,
            fromNationalId: testNationalId1,
            subjectId: null,
            type: 'delegation',
            customDelegationScopes: null,
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 1,
      })

    await fixtureFactory.createUserProfile({
      nationalId: testNationalId1,
      emails: [],
    })

    const email1 = await fixtureFactory.createEmail(email1Data)
    const email2 = await fixtureFactory.createEmail(email2Data)

    testEmailsId = email1.id
    testEmail2Id = email2.id
  })

  afterEach(async () => {
    await emailsModel.destroy({
      truncate: true,
      force: true,
      cascade: true,
    })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('should create new actor profile for delegation if it does not exist', async () => {
    // Act
    const res = await server
      .patch('/v2/actor/actor-profiles/.from-national-id')
      .set('X-Param-From-National-Id', testNationalId1)
      .send({ emailNotifications: false })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      fromNationalId: testNationalId1,
      emailNotifications: false,
      emailsId: null,
    })

    const actorProfile = await delegationPreferenceModel.findAll({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })

    expect(actorProfile).toHaveLength(1)
    expect(actorProfile[0]).not.toBeNull()
    expect(actorProfile[0].emailNotifications).toBe(false)
    expect(
      delegationsApi.delegationsControllerGetDelegationRecords,
    ).toHaveBeenCalledWith({
      xQueryNationalId: testUserProfile.nationalId,
      scopes:
        '@island.is/documents,@island.is/applications/samgongustofa-vehicles',
      direction: 'incoming',
    })
  })

  it('should update existing actor profile', async () => {
    // Arrange
    await fixtureFactory.createActorProfile({
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: true,
      emailsId: testEmailsId,
    })

    // Act
    const res = await server
      .patch('/v2/actor/actor-profiles/.from-national-id')
      .set('X-Param-From-National-Id', testNationalId1)
      .send({
        emailNotifications: false,
        emailsId: testEmail2Id,
      })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toStrictEqual({
      fromNationalId: testNationalId1,
      emailNotifications: false,
      emailsId: testEmail2Id,
      email: email2Data.email,
      emailVerified: email2Data.emailStatus === DataStatus.VERIFIED,
    })

    const actorProfile = await delegationPreferenceModel.findAll({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })

    expect(actorProfile).toHaveLength(1)
    expect(actorProfile[0]).not.toBeNull()
    expect(actorProfile[0].emailNotifications).toBe(false)
    expect(actorProfile[0].emailsId).toBe(testEmail2Id)
  })

  it('should create new actor profile with emailsId', async () => {
    // Act
    const res = await server
      .patch('/v2/actor/actor-profiles/.from-national-id')
      .set('X-Param-From-National-Id', testNationalId1)
      .send({
        emailNotifications: false,
        emailsId: testEmailsId,
      })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toStrictEqual({
      fromNationalId: testNationalId1,
      emailNotifications: false,
      emailsId: testEmailsId,
      email: email1Data.email,
      emailVerified: email1Data.emailStatus === DataStatus.VERIFIED,
    })

    const actorProfile = await delegationPreferenceModel.findAll({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })

    expect(actorProfile).toHaveLength(1)
    expect(actorProfile[0]).not.toBeNull()
    expect(actorProfile[0].emailNotifications).toBe(false)
    expect(actorProfile[0].emailsId).toBe(testEmailsId)
  })

  it('should change emailsId', async () => {
    // Arrange
    await fixtureFactory.createActorProfile({
      toNationalId: testUserProfile.nationalId,
      fromNationalId: testNationalId1,
      emailNotifications: true,
    })

    // Act
    const res = await server
      .patch('/v2/actor/actor-profiles/.from-national-id')
      .set('X-Param-From-National-Id', testNationalId1)
      .send({
        emailsId: testEmail2Id,
      })

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toStrictEqual({
      fromNationalId: testNationalId1,
      emailNotifications: true,
      emailsId: testEmail2Id,
      email: email2Data.email,
      emailVerified: email2Data.emailStatus === DataStatus.VERIFIED,
    })

    const actorProfile = await delegationPreferenceModel.findAll({
      where: {
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
      },
    })

    expect(actorProfile).toHaveLength(1)
    expect(actorProfile[0]).not.toBeNull()
    expect(actorProfile[0].emailNotifications).toBe(true)
    expect(actorProfile[0].emailsId).toBe(testEmail2Id)
  })

  it('should throw no content exception if delegation is not found', async () => {
    // Arrange
    jest
      .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
      .mockResolvedValue({
        data: [], // No delegations
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 1,
      })

    // Act
    const res = await server
      .patch('/v2/actor/actor-profiles/.from-national-id')
      .set('X-Param-From-National-Id', testNationalId1)
      .send({ emailNotifications: false })

    // Assert
    expect(res.status).toEqual(204)
  })
})
