import {
  DrivingLicenseApi,
  PenaltyPointsClientService,
} from '@island.is/clients/driving-license'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { DrivingLicenseDeprivationStatus } from '../models'
import { DeprivationsService } from './deprivations.service'

const user = createCurrentUser()

const yearsFromNow = (years: number) => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + years)
  return date
}

const createService = ({
  current = null,
  all = [],
}: {
  current?: unknown
  all?: unknown[]
}) => {
  const drivingLicenseApi = {
    getDeprivation: jest.fn().mockResolvedValue(current),
  } as unknown as DrivingLicenseApi
  const penaltyPointsClientService = {
    deprivations: jest.fn().mockResolvedValue(all),
  } as unknown as PenaltyPointsClientService

  return {
    service: new DeprivationsService(
      drivingLicenseApi,
      penaltyPointsClientService,
    ),
    drivingLicenseApi,
    penaltyPointsClientService,
  }
}

describe('DeprivationsService', () => {
  describe('getDeprivation', () => {
    it('returns null when the response is empty', async () => {
      const { service } = createService({ current: null })
      expect(await service.getDeprivation(user)).toBeNull()
    })

    it('returns null for the no-active-deprivation response', async () => {
      const { service } = createService({
        current: {
          dateFrom: null,
          dateTo: null,
          licenseLost: false,
          deprivationName: null,
          deprivationType: null,
          licenseExpired: false,
          retakeLicense: false,
        },
      })
      expect(await service.getDeprivation(user)).toBeNull()
    })

    it('passes the user as auth and their nationalId', async () => {
      const { service, drivingLicenseApi } = createService({ current: null })
      await service.getDeprivation(user)
      expect(drivingLicenseApi.getDeprivation).toHaveBeenCalledWith({
        nationalId: user.nationalId,
        auth: user,
      })
    })

    it('maps the deprivation', async () => {
      const { service } = createService({
        current: {
          dateFrom: new Date('2026-01-01'),
          dateTo: new Date('2027-01-01'),
          licenseLost: true,
          licenseExpired: false,
          deprivationName: 'Svipting',
          deprivationType: 3,
          retakeLicense: true,
        },
      })

      expect(await service.getDeprivation(user)).toStrictEqual({
        dateFrom: new Date('2026-01-01'),
        dateTo: new Date('2027-01-01'),
        status: DrivingLicenseDeprivationStatus.LOST,
        name: 'Svipting',
        type: 3,
        retakeRequired: true,
        active: expect.any(Boolean),
      })
    })

    it.each([
      [true, true, DrivingLicenseDeprivationStatus.LOSTANDEXPIRED],
      [false, true, DrivingLicenseDeprivationStatus.EXPIRED],
      [false, false, undefined],
    ])(
      'maps licenseLost=%s, licenseExpired=%s to status %s',
      async (licenseLost, licenseExpired, expected) => {
        const { service } = createService({
          current: {
            dateFrom: new Date('2026-01-01'),
            licenseLost,
            licenseExpired,
          },
        })
        expect((await service.getDeprivation(user))?.status).toBe(expected)
      },
    )

    it.each([
      ['no dateTo', yearsFromNow(-1), undefined, true],
      ['dateTo in the future', yearsFromNow(-1), yearsFromNow(1), true],
      ['dateFrom in the future', yearsFromNow(1), undefined, false],
      ['dateTo in the past', yearsFromNow(-2), yearsFromNow(-1), false],
    ])('sets active for %s', async (_, dateFrom, dateTo, expected) => {
      const { service } = createService({ current: { dateFrom, dateTo } })
      expect((await service.getDeprivation(user))?.active).toBe(expected)
    })
  })

  describe('getDeprivations', () => {
    it('returns no current and an empty history for an empty list', async () => {
      const { service } = createService({ all: [] })
      expect(await service.getDeprivations(user)).toStrictEqual({
        current: undefined,
        history: [],
      })
    })

    it('sets current to the most recent by dateFrom and puts the rest in history', async () => {
      const { service } = createService({
        all: [
          { dateFrom: new Date('2018-01-01') },
          { dateFrom: new Date('2022-06-15') },
          { dateFrom: new Date('2020-03-10') },
        ],
      })

      const response = await service.getDeprivations(user)

      expect(response.current?.dateFrom).toStrictEqual(new Date('2022-06-15'))
      expect(response.history.map((h) => h.dateFrom)).toStrictEqual([
        new Date('2020-03-10'),
        new Date('2018-01-01'),
      ])
    })

    it('filters out items with no dateFrom', async () => {
      const { service } = createService({
        all: [{ dateFrom: null }, { dateFrom: new Date('2021-01-01') }],
      })

      const response = await service.getDeprivations(user)

      expect(response.current?.dateFrom).toStrictEqual(new Date('2021-01-01'))
      expect(response.history).toStrictEqual([])
    })

    it('maps retakeLicense to retakeRequired', async () => {
      const { service } = createService({
        all: [{ dateFrom: new Date('2020-01-01'), retakeLicense: true }],
      })
      expect(
        (await service.getDeprivations(user)).current?.retakeRequired,
      ).toBe(true)
    })
  })
})
