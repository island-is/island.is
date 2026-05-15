import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { Language, SequelizeConfigService } from '@island.is/auth-api-lib'
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

const seedLanguages = [
  { isoKey: 'en', description: 'English', englishDescription: 'English' },
  { isoKey: 'is', description: 'Íslenska', englishDescription: 'Icelandic' },
  { isoKey: 'pl', description: 'Polski', englishDescription: 'Polish' },
]

describe('MeLanguagesController', () => {
  describe('with super user auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let languageModel: typeof Language

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: superUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      languageModel = app.get(getModelToken(Language))
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    afterEach(async () => {
      await languageModel.destroy({
        where: {},
        truncate: true,
        cascade: true,
      })
    })

    describe('GET /v2/me/languages', () => {
      it('returns an empty list when no languages exist', async () => {
        const response = await server.get('/v2/me/languages?page=1&count=10')

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({ rows: [], count: 0 })
      })

      it('returns paginated languages', async () => {
        await languageModel.bulkCreate(seedLanguages)

        const response = await server.get('/v2/me/languages?page=1&count=10')

        expect(response.status).toEqual(200)
        expect(response.body.count).toEqual(seedLanguages.length)
        expect(response.body.rows).toHaveLength(seedLanguages.length)
      })

      it('searches across isoKey, description and englishDescription', async () => {
        // Seed an extra language with a unique isoKey that does NOT appear in
        // any other field, so we can isolate isoKey-only matching.
        await languageModel.bulkCreate([
          ...seedLanguages,
          {
            isoKey: 'xq',
            description: 'Madeup',
            englishDescription: 'Madeup',
          },
        ])

        // Match by isoKey only
        const byIsoKey = await server.get(
          '/v2/me/languages?page=1&count=10&searchString=xq',
        )
        expect(byIsoKey.status).toEqual(200)
        expect(byIsoKey.body.count).toEqual(1)
        expect(byIsoKey.body.rows[0].isoKey).toEqual('xq')

        // Match by englishDescription
        const byEnglish = await server.get(
          '/v2/me/languages?page=1&count=10&searchString=Polish',
        )
        expect(byEnglish.body.count).toEqual(1)
        expect(byEnglish.body.rows[0].isoKey).toEqual('pl')

        // Match by description (native name)
        const byNative = await server.get(
          '/v2/me/languages?page=1&count=10&searchString=Polski',
        )
        expect(byNative.body.count).toEqual(1)
        expect(byNative.body.rows[0].isoKey).toEqual('pl')
      })

      it('paginates deterministically across pages', async () => {
        // Seed enough languages to span multiple pages; isoKey ordering is
        // alphabetic so we know what page 2 should look like.
        const many = Array.from({ length: 15 }, (_, i) => ({
          isoKey: `l${String(i).padStart(2, '0')}`,
          description: `lang-${i}`,
          englishDescription: `lang-${i}`,
        }))
        await languageModel.bulkCreate(many)

        const page1 = await server.get('/v2/me/languages?page=1&count=10')
        const page2 = await server.get('/v2/me/languages?page=2&count=10')

        expect(page1.body.count).toEqual(15)
        expect(page2.body.count).toEqual(15)
        expect(page1.body.rows).toHaveLength(10)
        expect(page2.body.rows).toHaveLength(5)

        // Verify deterministic ordering across the page boundary.
        const allKeys = [
          ...page1.body.rows.map((l: Language) => l.isoKey),
          ...page2.body.rows.map((l: Language) => l.isoKey),
        ]
        expect(allKeys).toEqual([...allKeys].sort())
      })

      it('rejects non-positive page or count', async () => {
        const response = await server.get('/v2/me/languages?page=0&count=10')

        expect(response.status).toEqual(400)
      })
    })

    describe('GET /v2/me/languages/all', () => {
      it('returns all languages without paging', async () => {
        await languageModel.bulkCreate(seedLanguages)

        const response = await server.get('/v2/me/languages/all')

        expect(response.status).toEqual(200)
        expect(response.body).toHaveLength(seedLanguages.length)
      })
    })

    describe('GET /v2/me/languages/:isoKey', () => {
      it('returns the language', async () => {
        await languageModel.bulkCreate(seedLanguages)

        const response = await server.get('/v2/me/languages/is')

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          isoKey: 'is',
          description: 'Íslenska',
          englishDescription: 'Icelandic',
        })
      })

      it('returns 204 when not found', async () => {
        const response = await server.get('/v2/me/languages/zz')

        expect(response.status).toEqual(204)
      })
    })

    describe('POST /v2/me/languages', () => {
      it('creates a new language', async () => {
        const payload = {
          isoKey: 'fr',
          description: 'Français',
          englishDescription: 'French',
        }

        const response = await server.post('/v2/me/languages').send(payload)

        expect(response.status).toEqual(201)
        expect(response.body).toMatchObject(payload)

        const row = await languageModel.findByPk('fr')
        expect(row?.englishDescription).toEqual('French')
      })
    })

    describe('PATCH /v2/me/languages/:isoKey', () => {
      it('updates the description fields', async () => {
        await languageModel.bulkCreate(seedLanguages)

        const response = await server.patch('/v2/me/languages/en').send({
          description: 'English (UK)',
          englishDescription: 'British English',
        })

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          isoKey: 'en',
          description: 'English (UK)',
          englishDescription: 'British English',
        })
      })
    })

    describe('DELETE /v2/me/languages/:isoKey', () => {
      it('deletes the language', async () => {
        await languageModel.bulkCreate(seedLanguages)

        const response = await server.delete('/v2/me/languages/pl').send({})

        expect(response.status).toEqual(204)

        const row = await languageModel.findByPk('pl')
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

    it('returns 403 for regular users on GET', async () => {
      const response = await server.get('/v2/me/languages?page=1&count=10')

      expect(response.status).toEqual(403)
    })

    it('returns 403 for regular users on POST', async () => {
      const response = await server.post('/v2/me/languages').send({
        isoKey: 'fr',
        description: 'Français',
        englishDescription: 'French',
      })

      expect(response.status).toEqual(403)
    })
  })
})
