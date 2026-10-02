import { BadRequestException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { Op } from 'sequelize'

import { DelegationPreferenceService } from './delegation-preference.service'
import { DelegationIndex } from './models/delegation-index.model'
import { DelegationPreference } from './models/delegation-preference.model'

const ACTOR = '0101302399'
const PARTY = '0101303019'
const OTHER_PARTY = '5005101370'

const row = (overrides: Partial<DelegationPreference>) =>
  ({
    fromNationalId: PARTY,
    isFavourite: false,
    lastUsedAt: null,
    ...overrides,
  } as DelegationPreference)

describe('DelegationPreferenceService', () => {
  let service: DelegationPreferenceService
  let model: {
    findAll: jest.Mock
    upsert: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
    count: jest.Mock
    sequelize: { query: jest.Mock; transaction: jest.Mock }
  }
  let index: { findAll: jest.Mock }

  const indexed = (...ids: string[]) =>
    index.findAll.mockResolvedValue(
      ids.map((fromNationalId) => ({ fromNationalId })),
    )

  beforeEach(async () => {
    model = {
      findAll: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue([undefined, true]),
      update: jest.fn().mockResolvedValue([0]),
      destroy: jest.fn().mockResolvedValue(0),
      count: jest.fn().mockResolvedValue(0),
      sequelize: {
        query: jest.fn().mockResolvedValue([]),
        transaction: jest.fn((fn) => fn('tx')),
      },
    }
    index = { findAll: jest.fn().mockResolvedValue([]) }

    const module = await Test.createTestingModule({
      providers: [
        DelegationPreferenceService,
        { provide: getModelToken(DelegationPreference), useValue: model },
        { provide: getModelToken(DelegationIndex), useValue: index },
      ],
    }).compile()

    service = module.get(DelegationPreferenceService)
  })

  describe('reconciling against the delegation index', () => {
    it('reads only preferences for parties the actor still holds a delegation for', async () => {
      indexed(PARTY, OTHER_PARTY)

      await service.findAll(ACTOR)

      for (const [args] of model.findAll.mock.calls) {
        expect(args.where.fromNationalId).toEqual({
          [Op.in]: [PARTY, OTHER_PARTY],
        })
      }
    })

    it('counts a revoked favourite as gone, so it cannot block starring a new one', async () => {
      // Five starred, but only two are still delegations — the other three are
      // parties the actor has since sold or been removed from.
      indexed(PARTY, OTHER_PARTY)
      model.count.mockResolvedValue(2)

      await expect(
        service.setFavourite(ACTOR, PARTY, true),
      ).resolves.toBeUndefined()

      expect(model.count.mock.calls[0][0].where.fromNationalId).toEqual(
        expect.objectContaining({ [Op.in]: [PARTY, OTHER_PARTY] }),
      )
      expect(model.upsert).toHaveBeenCalled()
    })

    it('leaves preferences alone when the actor has no index rows at all', async () => {
      // Not indexed yet is not the same as holding nothing, and filtering here
      // would make every favourite vanish.
      index.findAll.mockResolvedValue([])

      await service.findAll(ACTOR)

      for (const [args] of model.findAll.mock.calls) {
        expect(args.where.fromNationalId).toBeUndefined()
      }
    })

    it('treats an expired delegation as revoked', async () => {
      indexed(PARTY)

      await service.findAll(ACTOR)

      const [args] = index.findAll.mock.calls[0]

      expect(args.where.toNationalId).toBe(ACTOR)
      expect(args.where[Op.or]).toEqual([
        { validTo: null },
        { validTo: { [Op.gte]: expect.any(Date) } },
      ])
    })
  })

  describe('findAll', () => {
    it('reads favourites and recently used separately, both bounded', async () => {
      await service.findAll(ACTOR)

      const [favourites, recent] = model.findAll.mock.calls.map(
        ([args]) => args,
      )

      expect(favourites).toEqual(
        expect.objectContaining({
          where: { toNationalId: ACTOR, isFavourite: true },
          order: [['created', 'ASC']],
          limit: expect.any(Number),
        }),
      )
      expect(recent).toEqual(
        expect.objectContaining({
          where: { toNationalId: ACTOR, lastUsedAt: { [Op.ne]: null } },
          order: [['lastUsedAt', 'DESC']],
          limit: expect.any(Number),
        }),
      )
    })

    it('returns a party that is both starred and recently used only once', async () => {
      const lastUsedAt = new Date('2026-09-17T19:15:29Z')

      model.findAll
        .mockResolvedValueOnce([row({ isFavourite: true })])
        .mockResolvedValueOnce([row({ isFavourite: true, lastUsedAt })])

      await expect(service.findAll(ACTOR)).resolves.toEqual([
        { fromNationalId: PARTY, isFavourite: true, lastUsedAt },
      ])
    })

    it('reports a missing lastUsedAt as null rather than undefined', async () => {
      model.findAll.mockResolvedValueOnce([
        row({ isFavourite: true, lastUsedAt: undefined }),
      ])

      const [preference] = await service.findAll(ACTOR)

      expect(preference.lastUsedAt).toBeNull()
    })
  })

  describe('a party held through more than one delegation type', () => {
    it('is still live when one type goes and another remains', async () => {
      // The picker merges a party into one card with its types listed, and a
      // preference is keyed on the party, so losing the procuration while
      // keeping the custom delegation must leave the favourite alone.
      index.findAll.mockResolvedValue([
        { fromNationalId: PARTY },
        { fromNationalId: PARTY },
      ])

      await service.findAll(ACTOR)

      for (const [args] of model.findAll.mock.calls) {
        expect(args.where.fromNationalId).toEqual({ [Op.in]: [PARTY] })
      }
    })

    it('asks the index about the party, never about the type', async () => {
      indexed(PARTY)

      await service.findAll(ACTOR)

      const [args] = index.findAll.mock.calls[0]

      expect(args.where.type).toBeUndefined()
      expect(args.where.provider).toBeUndefined()
      expect(args.attributes).toEqual(['fromNationalId'])
    })
  })

  describe('when a revoked delegation comes back', () => {
    it('returns every live favourite, even above the cap, so none is stranded', async () => {
      indexed(PARTY, OTHER_PARTY)

      await service.findAll(ACTOR)

      const [favourites] = model.findAll.mock.calls[0]

      // Reading only five would hide the one starred most recently: starred in
      // the database, drawn as unstarred, and refused by the cap.
      expect(favourites.limit).toBeGreaterThan(5)
    })

    it('still refuses to add another while over the cap', async () => {
      indexed(PARTY, OTHER_PARTY)
      model.count.mockResolvedValue(6)

      await expect(service.setFavourite(ACTOR, PARTY, true)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('lets the actor unstar their way back down', async () => {
      await service.setFavourite(ACTOR, PARTY, false)

      expect(model.update).toHaveBeenCalledWith(
        { isFavourite: false },
        { where: { toNationalId: ACTOR, fromNationalId: PARTY } },
      )
      expect(model.count).not.toHaveBeenCalled()
    })
  })

  describe('setFavourite', () => {
    it('writes only isFavourite, so a concurrent switch cannot lose its timestamp', async () => {
      await service.setFavourite(ACTOR, PARTY, true)

      expect(model.upsert).toHaveBeenCalledWith(
        { toNationalId: ACTOR, fromNationalId: PARTY, isFavourite: true },
        expect.objectContaining({
          conflictFields: ['to_national_id', 'from_national_id'],
          fields: ['isFavourite'],
        }),
      )
    })

    it('refuses to star beyond the cap', async () => {
      model.count.mockResolvedValue(5)

      await expect(service.setFavourite(ACTOR, PARTY, true)).rejects.toThrow(
        BadRequestException,
      )
      expect(model.upsert).not.toHaveBeenCalled()
    })

    it('fails loudly rather than reporting success without writing', async () => {
      // @ts-expect-error deliberately removing what the transaction needs
      model.sequelize = null

      await expect(service.setFavourite(ACTOR, PARTY, true)).rejects.toThrow()
      expect(model.upsert).not.toHaveBeenCalled()
    })

    it('takes a lock keyed on the actor, so two stars cannot both see room', async () => {
      await service.setFavourite(ACTOR, PARTY, true)

      const [sql, options] = model.sequelize.query.mock.calls[0]

      expect(sql).toContain('pg_advisory_xact_lock')
      expect(options.replacements.key).toContain(ACTOR)
      expect(options.transaction).toBeDefined()
      expect(model.count.mock.calls[0][0].transaction).toBeDefined()
      expect(model.upsert.mock.calls[0][1].transaction).toBeDefined()
    })

    it('leaves the party being starred out of the count, so re-starring at the cap still works', async () => {
      model.count.mockResolvedValue(4)

      await service.setFavourite(ACTOR, PARTY, true)

      expect(model.count.mock.calls[0][0].where.fromNationalId).toEqual(
        expect.objectContaining({ [Op.ne]: PARTY }),
      )
      expect(model.upsert).toHaveBeenCalled()
    })

    it('creates no row when unstarring something never starred', async () => {
      await service.setFavourite(ACTOR, OTHER_PARTY, false)

      expect(model.upsert).not.toHaveBeenCalled()
      expect(model.destroy).toHaveBeenCalledWith({
        where: {
          toNationalId: ACTOR,
          fromNationalId: OTHER_PARTY,
          lastUsedAt: null,
        },
      })
    })

    it('keeps a row that still records a use, and only clears the star', async () => {
      await service.setFavourite(ACTOR, PARTY, false)

      expect(model.update).toHaveBeenCalledWith(
        { isFavourite: false },
        { where: { toNationalId: ACTOR, fromNationalId: PARTY } },
      )
    })
  })

  describe('recordUsage', () => {
    it("drops the actor's oldest unstarred rows, so the table cannot grow without end", async () => {
      await service.recordUsage(ACTOR, PARTY)

      const [sql, options] = model.sequelize.query.mock.calls[0]

      expect(sql).toContain('DELETE FROM delegation_preference')
      expect(sql).toContain('is_favourite = false')
      expect(options.replacements).toEqual({
        toNationalId: ACTOR,
        keep: expect.any(Number),
      })
    })

    it('never prunes a favourite', async () => {
      await service.recordUsage(ACTOR, PARTY)

      const [sql] = model.sequelize.query.mock.calls[0]

      expect(sql.match(/is_favourite = false/g)).toHaveLength(2)
    })

    it('is a single upsert that leaves isFavourite alone', async () => {
      await service.recordUsage(ACTOR, PARTY)

      expect(model.upsert).toHaveBeenCalledTimes(1)
      expect(model.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          toNationalId: ACTOR,
          fromNationalId: PARTY,
          lastUsedAt: expect.any(Date),
        }),
        expect.objectContaining({
          conflictFields: ['to_national_id', 'from_national_id'],
          fields: ['lastUsedAt'],
        }),
      )
    })
  })
})
