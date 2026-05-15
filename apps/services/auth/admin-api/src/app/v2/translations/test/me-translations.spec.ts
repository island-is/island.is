import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  Language,
  SequelizeConfigService,
  Translation,
} from '@island.is/auth-api-lib'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'

const superUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AdminPortalScope.idsAdminSuperUser],
})

const regularUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AdminPortalScope.idsAdmin],
})

const seedTranslations = [
  {
    language: 'en',
    className: 'client',
    property: 'displayName',
    key: 'island.is-1',
    value: 'Hello world',
  },
  {
    language: 'en',
    className: 'client',
    property: 'description',
    key: 'island.is-1',
    value: 'A friendly greeting',
  },
  {
    language: 'is',
    className: 'scope',
    property: 'displayName',
    key: 'profile',
    value: 'Notandasnið',
  },
]

describe('MeTranslationsController', () => {
  describe('with super user auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let translationModel: typeof Translation
    let languageModel: typeof Language

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: superUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      translationModel = app.get(getModelToken(Translation))
      languageModel = app.get(getModelToken(Language))
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    beforeEach(async () => {
      await languageModel.bulkCreate([
        { isoKey: 'en', description: 'English', englishDescription: 'English' },
        {
          isoKey: 'is',
          description: 'Íslenska',
          englishDescription: 'Icelandic',
        },
      ])
    })

    afterEach(async () => {
      await translationModel.destroy({
        where: {},
        truncate: true,
        cascade: true,
      })
      await languageModel.destroy({
        where: {},
        truncate: true,
        cascade: true,
      })
    })

    describe('GET /v2/me/translations', () => {
      it('returns an empty list when no translations exist', async () => {
        const response = await server.get('/v2/me/translations?page=1&count=10')

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({ rows: [], count: 0 })
      })

      it('returns paginated translations', async () => {
        await translationModel.bulkCreate(seedTranslations)

        const response = await server.get('/v2/me/translations?page=1&count=10')

        expect(response.status).toEqual(200)
        expect(response.body.count).toEqual(seedTranslations.length)
        expect(response.body.rows).toHaveLength(seedTranslations.length)
      })

      it('respects pagination size and page number', async () => {
        await translationModel.bulkCreate(seedTranslations)

        const page1 = await server.get('/v2/me/translations?page=1&count=2')
        const page2 = await server.get('/v2/me/translations?page=2&count=2')

        expect(page1.status).toEqual(200)
        expect(page1.body.count).toEqual(seedTranslations.length)
        expect(page1.body.rows).toHaveLength(2)
        expect(page2.body.rows).toHaveLength(1)
      })

      it('searches across value, key, className and property (case-insensitive)', async () => {
        await translationModel.bulkCreate(seedTranslations)

        // Match by value
        const byValue = await server.get(
          '/v2/me/translations?page=1&count=10&searchString=hello',
        )
        expect(byValue.status).toEqual(200)
        expect(byValue.body.count).toEqual(1)
        expect(byValue.body.rows[0].value).toEqual('Hello world')

        // Match by className
        const byClassName = await server.get(
          '/v2/me/translations?page=1&count=10&searchString=scope',
        )
        expect(byClassName.body.count).toEqual(1)
        expect(byClassName.body.rows[0].className).toEqual('scope')

        // Match by key
        const byKey = await server.get(
          '/v2/me/translations?page=1&count=10&searchString=island.is-1',
        )
        expect(byKey.body.count).toEqual(2)

        // Match by property — only one seeded row has property='description'
        const byProperty = await server.get(
          '/v2/me/translations?page=1&count=10&searchString=description',
        )
        expect(byProperty.body.count).toEqual(1)
      })

      it('rejects non-positive page or count', async () => {
        const response = await server.get('/v2/me/translations?page=0&count=10')

        expect(response.status).toEqual(400)
      })
    })

    describe('GET /v2/me/translations/:language/:className/:property/:key', () => {
      it('returns the translation', async () => {
        await translationModel.bulkCreate(seedTranslations)

        const response = await server.get(
          '/v2/me/translations/en/client/displayName/island.is-1',
        )

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          language: 'en',
          className: 'client',
          property: 'displayName',
          key: 'island.is-1',
          value: 'Hello world',
        })
      })

      it('returns 204 when not found', async () => {
        const response = await server.get(
          '/v2/me/translations/en/client/displayName/missing-key',
        )

        expect(response.status).toEqual(204)
      })
    })

    describe('POST /v2/me/translations', () => {
      it('creates a translation when the language exists', async () => {
        const payload = {
          language: 'en',
          className: 'client',
          property: 'displayName',
          key: 'new-key',
          value: 'Created value',
        }

        const response = await server.post('/v2/me/translations').send(payload)

        expect(response.status).toEqual(201)
        expect(response.body).toMatchObject(payload)

        const row = await translationModel.findOne({
          where: {
            language: payload.language,
            className: payload.className,
            property: payload.property,
            key: payload.key,
          },
        })
        expect(row?.value).toEqual('Created value')
      })

      it('rejects when the language does not exist', async () => {
        const response = await server.post('/v2/me/translations').send({
          language: 'fr',
          className: 'client',
          property: 'displayName',
          key: 'fr-key',
          value: 'Bonjour',
        })

        expect(response.status).toEqual(400)
      })

      it('round-trips a key containing slashes (URL-encoded path params)', async () => {
        const slashKey = 'auth/login/title'
        const createResponse = await server.post('/v2/me/translations').send({
          language: 'en',
          className: 'client',
          property: 'displayName',
          key: slashKey,
          value: 'Sign in',
        })

        expect(createResponse.status).toEqual(201)
        expect(createResponse.body.key).toEqual(slashKey)

        const getResponse = await server.get(
          `/v2/me/translations/en/client/displayName/${encodeURIComponent(
            slashKey,
          )}`,
        )

        expect(getResponse.status).toEqual(200)
        expect(getResponse.body).toMatchObject({
          language: 'en',
          className: 'client',
          property: 'displayName',
          key: slashKey,
          value: 'Sign in',
        })
      })
    })

    describe('PATCH /v2/me/translations/:language/:className/:property/:key', () => {
      it('updates the value', async () => {
        await translationModel.bulkCreate(seedTranslations)

        const response = await server
          .patch('/v2/me/translations/en/client/displayName/island.is-1')
          .send({ value: 'Updated value' })

        expect(response.status).toEqual(200)
        expect(response.body.value).toEqual('Updated value')

        const row = await translationModel.findOne({
          where: {
            language: 'en',
            className: 'client',
            property: 'displayName',
            key: 'island.is-1',
          },
        })
        expect(row?.value).toEqual('Updated value')
      })

      it('returns 204 when the translation does not exist (strict update)', async () => {
        const response = await server
          .patch('/v2/me/translations/en/client/displayName/missing-key')
          .send({ value: 'Anything' })

        expect(response.status).toEqual(204)

        const row = await translationModel.findOne({
          where: {
            language: 'en',
            className: 'client',
            property: 'displayName',
            key: 'missing-key',
          },
        })
        expect(row).toBeNull()
      })
    })

    describe('DELETE /v2/me/translations/:language/:className/:property/:key', () => {
      it('deletes the translation', async () => {
        await translationModel.bulkCreate(seedTranslations)

        const response = await server
          .delete('/v2/me/translations/en/client/displayName/island.is-1')
          .send({})

        expect(response.status).toEqual(204)

        const row = await translationModel.findOne({
          where: {
            language: 'en',
            className: 'client',
            property: 'displayName',
            key: 'island.is-1',
          },
        })
        expect(row).toBeNull()
      })
    })
  })

  describe('without super user auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: regularUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('returns 403 for regular users', async () => {
      const response = await server.get('/v2/me/translations?page=1&count=10')

      expect(response.status).toEqual(403)
    })
  })
})
