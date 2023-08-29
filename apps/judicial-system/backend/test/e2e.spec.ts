import { Sequelize } from 'sequelize-typescript'
import { execSync } from 'child_process'
import request from 'supertest'
import { MessageDescriptor } from '@formatjs/intl'

import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'

import { testServer } from '@island.is/infra-nest-server'
import { IntlService } from '@island.is/cms-translations'
import { UserRole } from '@island.is/judicial-system/types'
import type {
  User as TUser,
  Institution as TInstitution,
} from '@island.is/judicial-system/types'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { SharedAuthService } from '@island.is/judicial-system/auth'

import { environment } from '../src/environments'
import { AppModule } from '../src/app/app.module'
import { Institution } from '../src/app/modules/institution'
import { User } from '../src/app/modules/user'
import { MessageService } from '@island.is/judicial-system/message'

interface CUser extends TUser {
  institutionId: string
}

let app: INestApplication
let sequelize: Sequelize
const prosecutorNationalId = '0000000009'
let prosecutor: CUser
const judgeNationalId = '0000002229'
const adminNationalId = '3333333333'
let admin: CUser
let adminAuthCookie: string

beforeAll(async () => {
  // Migrate the database
  execSync('yarn nx run judicial-system-backend:migrate')

  // Seed the database
  execSync('yarn nx run judicial-system-backend:seed')

  app = await testServer({
    appModule: AppModule,
    override: (builder) =>
      builder
        .overrideProvider(IntlService)
        .useValue({
          useIntl: () =>
            Promise.resolve({
              formatMessage: (descriptor: MessageDescriptor | string) => {
                if (typeof descriptor === 'string') {
                  return descriptor
                }
                return descriptor.defaultMessage
              },
            }),
        })
        .overrideProvider(MessageService)
        .useValue({ sendMessagesToQueue: () => undefined }),
  })

  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  const sharedAuthService = await app.resolve(SharedAuthService)

  prosecutor = (
    await request(app.getHttpServer())
      .get(`/api/user/?nationalId=${prosecutorNationalId}`)
      .set('authorization', `Bearer ${environment.auth.secretToken}`)
  ).body

  admin = (
    await request(app.getHttpServer())
      .get(`/api/user/?nationalId=${adminNationalId}`)
      .set('authorization', `Bearer ${environment.auth.secretToken}`)
  ).body
  adminAuthCookie = sharedAuthService.signJwt(admin)
})

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})

function institutionToTInstitution(institution: Institution) {
  return ({
    ...institution,
    created: institution.created && institution.created.toISOString(),
    modified: institution.modified && institution.modified.toISOString(),
  } as unknown) as TInstitution
}

function userToCUser(user: User) {
  return ({
    ...user,
    created: user.created && user.created.toISOString(),
    modified: user.modified && user.modified.toISOString(),
    institution:
      user.institution && institutionToTInstitution(user.institution),
  } as unknown) as CUser
}

function expectInstitutionsToMatch(
  institutionOne?: TInstitution,
  institutionTwo?: TInstitution,
) {
  expect(institutionOne?.id).toBe(institutionTwo?.id)
  expect(institutionOne?.created).toBe(institutionTwo?.created)
  expect(institutionOne?.modified).toBe(institutionTwo?.modified)
  expect(institutionOne?.type).toBe(institutionTwo?.type)
  expect(institutionOne?.name).toBe(institutionTwo?.name)
}

function expectUsersToMatch(userOne: CUser, userTwo: CUser) {
  expect(userOne?.id).toBe(userTwo?.id)
  expect(userOne?.created).toBe(userTwo?.created)
  expect(userOne?.modified).toBe(userTwo?.modified)
  expect(userOne?.nationalId).toBe(userTwo?.nationalId)
  expect(userOne?.name).toBe(userTwo?.name)
  expect(userOne?.title).toBe(userTwo?.title)
  expect(userOne?.mobileNumber).toBe(userTwo?.mobileNumber)
  expect(userOne?.email).toBe(userTwo?.email)
  expect(userOne?.role).toBe(userTwo?.role)
  expect(userOne?.institutionId ?? null).toBe(userTwo?.institutionId ?? null)
  expectInstitutionsToMatch(userOne?.institution, userTwo?.institution)
  expect(userOne?.active).toBe(userTwo?.active)
}

describe('Institution', () => {
  it('GET /api/institutions should get all institutions', async () => {
    await request(app.getHttpServer())
      .get('/api/institutions')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(20)
      })
  })
})

describe('User', () => {
  it('POST /api/user should create a user', async () => {
    const data = {
      nationalId: '1234567890',
      name: 'The User',
      title: 'The Title',
      mobileNumber: '1234567',
      email: 'user@dmr.is',
      role: UserRole.JUDGE,
      institutionId: 'a38666f3-0444-4e44-9654-b83f39f4db11',
      active: true,
    }
    let apiUser: CUser

    await User.destroy({
      where: {
        national_id: data.nationalId,
      },
    })
      .then(() => {
        return request(app.getHttpServer())
          .post('/api/user')
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
          .send(data)
          .expect(201)
      })
      .then((response) => {
        apiUser = response.body

        // Check the response
        expectUsersToMatch(apiUser, {
          ...data,
          id: apiUser.id ?? 'FAILURE',
          created: apiUser.created ?? 'FAILURE',
          modified: apiUser.modified ?? 'FAILURE',
        })

        // Check the data in the database
        return User.findByPk(apiUser.id)
      })
      .then((value) => {
        expectUsersToMatch(userToCUser(value?.toJSON() as User), apiUser)
      })
  })

  it('PATCH /api/user/:id should update fields of a user by id', async () => {
    const nationalId = '0987654321'
    const data = {
      name: 'The Modified User',
      title: 'The Modified Title',
      mobileNumber: '7654321',
      email: 'modifieduser@dmr.is',
      role: UserRole.PROSECUTOR,
      institutionId: '7b261673-8990-46b4-a310-5412ad77686a',
      active: false,
    }
    let dbUser: CUser
    let apiUser: CUser

    await User.destroy({
      where: {
        national_id: nationalId,
      },
    })
      .then(() => {
        return User.create({
          nationalId: nationalId,
          name: 'The User',
          title: 'The Title',
          mobileNumber: '1234567',
          email: 'user@dmr.is',
          role: UserRole.JUDGE,
          institutionId: 'a38666f3-0444-4e44-9654-b83f39f4db11',
          active: true,
        })
      })
      .then((value) => {
        dbUser = userToCUser(value.toJSON() as User)

        return request(app.getHttpServer())
          .patch(`/api/user/${dbUser.id}`)
          .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
          .send(data)
          .expect(200)
      })
      .then((response) => {
        apiUser = response.body

        // Check the response
        expect(apiUser.modified).not.toBe(dbUser.modified)
        expectUsersToMatch(apiUser, {
          ...data,
          id: dbUser.id ?? 'FAILURE',
          created: dbUser.created ?? 'FAILURE',
          modified: apiUser.modified,
          nationalId: dbUser.nationalId ?? 'FAILURE',
          institution: apiUser.institution,
        } as CUser)

        // Check the data in the database
        return User.findOne({
          where: { id: apiUser.id },
          include: [{ model: Institution, as: 'institution' }],
        })
      })
      .then((newValue) => {
        expectUsersToMatch(userToCUser(newValue?.toJSON() as User), apiUser)
      })
  })

  it('GET /api/users should get all users', async () => {
    await request(app.getHttpServer())
      .get('/api/users')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
      .send()
      .expect(200)
      .then((response) => {
        // Check the response - should have at least the three default users
        expect(response.body.length).toBeGreaterThanOrEqual(3)
      })
  })

  it('GET /api/user/:id should get the user', async () => {
    await request(app.getHttpServer())
      .get(`/api/user/${prosecutor.id}`)
      .set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${adminAuthCookie}`)
      .send()
      .expect(200)
      .then((response) => {
        expectUsersToMatch(response.body, prosecutor)
      })
  })

  it('GET /api/user/?nationalId=<national id> should get the user', async () => {
    let dbUser: CUser

    await User.findOne({
      where: { national_id: judgeNationalId },
      include: [{ model: Institution, as: 'institution' }],
    })
      .then((value) => {
        dbUser = userToCUser(value?.toJSON() as User)

        return request(app.getHttpServer())
          .get(`/api/user/?nationalId=${judgeNationalId}`)
          .set('authorization', `Bearer ${environment.auth.secretToken}`)
          .send()
          .expect(200)
      })
      .then((response) => {
        expectUsersToMatch(response.body, dbUser)
      })
  })
})
