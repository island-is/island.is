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
      const dateFrom = yearsFromNow(-1)
      const dateTo = yearsFromNow(1)
      const { service } = createService({
        current: {
          dateFrom,
          dateTo,
          licenseLost: true,
          licenseExpired: false,
          deprivationName: 'Svipting',
          deprivationType: 3,
          retakeLicense: true,
        },
      })

      expect(await service.getDeprivation(user)).toStrictEqual({
        dateFrom,
        dateTo,
        status: DrivingLicenseDeprivationStatus.LOST,
        name: 'Svipting',
        type: 3,
        retakeRequired: true,
        active: true,
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
            dateFrom: yearsFromNow(-1),
            licenseLost,
            licenseExpired,
          },
        })
        expect((await service.getDeprivation(user))?.status).toBe(expected)
      },
    )

    it.each([
      ['no dateTo', yearsFromNow(-1), undefined],
      ['dateTo in the future', yearsFromNow(-1), yearsFromNow(1)],
    ])('returns the deprivation for %s', async (_, dateFrom, dateTo) => {
      const { service } = createService({ current: { dateFrom, dateTo } })
      expect((await service.getDeprivation(user))?.active).toBe(true)
    })

    it.each([
      ['dateFrom in the future', yearsFromNow(1), undefined],
      ['dateTo in the past', yearsFromNow(-2), yearsFromNow(-1)],
    ])('returns null for %s', async (_, dateFrom, dateTo) => {
      const { service } = createService({ current: { dateFrom, dateTo } })
      expect(await service.getDeprivation(user)).toBeNull()
    })
  })

  describe('getDeprivations', () => {
    it('returns null for an empty list', async () => {
      const { service } = createService({ all: [] })
      expect(await service.getDeprivations(user)).toBeNull()
    })

    it('returns null when no item has a dateFrom', async () => {
      const { service } = createService({ all: [{ dateFrom: null }] })
      expect(await service.getDeprivations(user)).toBeNull()
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

      expect(response?.current?.dateFrom).toStrictEqual(new Date('2022-06-15'))
      expect(response?.history.map((h) => h.dateFrom)).toStrictEqual([
        new Date('2020-03-10'),
        new Date('2018-01-01'),
      ])
    })

    it('filters out items with no dateFrom', async () => {
      const { service } = createService({
        all: [{ dateFrom: null }, { dateFrom: new Date('2021-01-01') }],
      })

      const response = await service.getDeprivations(user)

      expect(response?.current?.dateFrom).toStrictEqual(new Date('2021-01-01'))
      expect(response?.history).toStrictEqual([])
    })

    it('maps retakeLicense to retakeRequired', async () => {
      const { service } = createService({
        all: [{ dateFrom: new Date('2020-01-01'), retakeLicense: true }],
      })
      expect(
        (await service.getDeprivations(user))?.current?.retakeRequired,
      ).toBe(true)
    })
  })
})
