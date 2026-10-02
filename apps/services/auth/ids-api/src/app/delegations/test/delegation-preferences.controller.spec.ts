import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import { DelegationPreference } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { setupWithAuth } from '../../../../test/setup'

const path = '/delegations/preferences'

describe('DelegationsController preferences', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let preferenceModel: typeof DelegationPreference

  const user = createCurrentUser({
    scope: ['@identityserver.api/authentication'],
  })
  const party = createNationalId('person')
  const company = createNationalId('company')

  const indexRecord = (fromNationalId: string, validTo?: Date) =>
    factory.createDelegationIndexRecord({
      toNationalId: user.nationalId,
      fromNationalId,
      provider: AuthDelegationProvider.Custom,
      type: AuthDelegationType.Custom,
      validTo,
    })

  const rowFor = (fromNationalId: string) =>
    preferenceModel.findOne({
      where: { toNationalId: user.nationalId, fromNationalId },
    })

  beforeEach(async () => {
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)
    preferenceModel = app.get(getModelToken(DelegationPreference))
  })

  afterEach(async () => {
    await app.cleanUp()
  })

  describe('GET preferences', () => {
    it('returns an empty list before anything is starred or used', async () => {
      const res = await server.get(path)

      expect(res.status).toEqual(200)
      expect(res.body).toEqual([])
    })

    it('returns what was starred', async () => {
      await indexRecord(party)
      await server.post(`${path}/favourite`).send({
        fromNationalId: party,
        isFavourite: true,
      })

      const res = await server.get(path)

      expect(res.status).toEqual(200)
      expect(res.body).toEqual([
        expect.objectContaining({ fromNationalId: party, isFavourite: true }),
      ])
    })

    it('leaves out a party the actor no longer holds a delegation for', async () => {
      await indexRecord(party)
      await indexRecord(company)
      for (const id of [party, company]) {
        await server
          .post(`${path}/favourite`)
          .send({ fromNationalId: id, isFavourite: true })
      }

      // The company delegation goes away, the person one stays.
      await preferenceModel.sequelize?.query(
        'DELETE FROM delegation_index WHERE to_national_id = :to AND from_national_id = :from',
        { replacements: { to: user.nationalId, from: company } },
      )

      const res = await server.get(path)

      expect(
        res.body.map((p: { fromNationalId: string }) => p.fromNationalId),
      ).toEqual([party])
      // Hidden, never deleted — an outage must not cost someone their stars.
      await expect(rowFor(company)).resolves.not.toBeNull()
    })
  })

  describe('POST preferences/favourite', () => {
    it('stars and unstars a party', async () => {
      await indexRecord(party)

      await server
        .post(`${path}/favourite`)
        .send({ fromNationalId: party, isFavourite: true })
        .expect(200)
      await expect(rowFor(party)).resolves.toMatchObject({ isFavourite: true })

      await server
        .post(`${path}/favourite`)
        .send({ fromNationalId: party, isFavourite: false })
        .expect(200)
      // Nothing else on the row, so it goes rather than lingering as junk.
      await expect(rowFor(party)).resolves.toBeNull()
    })

    it('refuses a sixth favourite', async () => {
      const parties = Array.from({ length: 6 }, () =>
        createNationalId('person'),
      )

      for (const id of parties) {
        await indexRecord(id)
      }

      for (const id of parties.slice(0, 5)) {
        await server
          .post(`${path}/favourite`)
          .send({ fromNationalId: id, isFavourite: true })
          .expect(200)
      }

      await server
        .post(`${path}/favourite`)
        .send({ fromNationalId: parties[5], isFavourite: true })
        .expect(400)
    })

    it('stays idempotent when re-starring one that is already a favourite at the cap', async () => {
      const parties = Array.from({ length: 5 }, () =>
        createNationalId('person'),
      )

      for (const id of parties) {
        await indexRecord(id)
        await server
          .post(`${path}/favourite`)
          .send({ fromNationalId: id, isFavourite: true })
          .expect(200)
      }

      await server
        .post(`${path}/favourite`)
        .send({ fromNationalId: parties[0], isFavourite: true })
        .expect(200)
    })

    it('rejects a national id that is not one', async () => {
      await server
        .post(`${path}/favourite`)
        .send({ fromNationalId: 'not-a-kennitala', isFavourite: true })
        .expect(400)
    })

    it('rejects a missing national id', async () => {
      await server
        .post(`${path}/favourite`)
        .send({ isFavourite: true })
        .expect(400)
    })
  })

  describe('POST preferences/usage', () => {
    it('records when the actor switched to a party', async () => {
      await indexRecord(party)

      await server
        .post(`${path}/usage`)
        .send({ fromNationalId: party })
        .expect(200)

      await expect(rowFor(party)).resolves.toMatchObject({
        isFavourite: false,
      })
      const row = await rowFor(party)
      expect(row?.lastUsedAt).toBeTruthy()
    })

    it('leaves a star alone when the same party is used', async () => {
      await indexRecord(party)
      await server
        .post(`${path}/favourite`)
        .send({ fromNationalId: party, isFavourite: true })
        .expect(200)

      await server
        .post(`${path}/usage`)
        .send({ fromNationalId: party })
        .expect(200)

      await expect(rowFor(party)).resolves.toMatchObject({ isFavourite: true })
    })

    it('rejects a body with no national id', async () => {
      // An inline body type carries no validation metadata, so this reached
      // Sequelize and came back as a 500 until it got a DTO.
      await server.post(`${path}/usage`).send({}).expect(400)
    })
  })

  describe('without the scope', () => {
    beforeEach(async () => {
      await app.cleanUp()
      app = await setupWithAuth({
        user: createCurrentUser({ scope: ['@island.is/some-other-scope'] }),
      })
      server = request(app.getHttpServer())
    })

    it.each([
      ['get', path],
      ['post', `${path}/favourite`],
      ['post', `${path}/usage`],
    ])('refuses %s %s', async (method, url) => {
      const res = await (method === 'get'
        ? server.get(url)
        : server.post(url).send({ fromNationalId: createNationalId('person') }))

      expect(res.status).toEqual(403)
    })
  })
})
