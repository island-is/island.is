import { BadRequestException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { Op } from 'sequelize'

import { DelegationPreferenceService } from './delegation-preference.service'
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
  }

  beforeEach(async () => {
    model = {
      findAll: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue([undefined, true]),
      update: jest.fn().mockResolvedValue([0]),
      destroy: jest.fn().mockResolvedValue(0),
      count: jest.fn().mockResolvedValue(0),
    }

    const module = await Test.createTestingModule({
      providers: [
        DelegationPreferenceService,
        { provide: getModelToken(DelegationPreference), useValue: model },
      ],
    }).compile()

    service = module.get(DelegationPreferenceService)
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

  describe('setFavourite', () => {
    it('writes only isFavourite, so a concurrent switch cannot lose its timestamp', async () => {
      await service.setFavourite(ACTOR, PARTY, true)

      expect(model.upsert).toHaveBeenCalledWith(
        { toNationalId: ACTOR, fromNationalId: PARTY, isFavourite: true },
        expect.objectContaining({
          // Real column names — Postgres rejects the attribute ones.
          conflictFields: ['to_national_id', 'from_national_id'],
          fields: ['isFavourite'],
        }),
      )
    })

    it('refuses to star beyond the cap', async () => {
      model.count.mockResolvedValue(100)

      await expect(service.setFavourite(ACTOR, PARTY, true)).rejects.toThrow(
        BadRequestException,
      )
      expect(model.upsert).not.toHaveBeenCalled()
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
