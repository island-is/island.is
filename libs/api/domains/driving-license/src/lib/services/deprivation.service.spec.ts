import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { DrivingLicenseDeprivationStatus } from '../models'
import { DeprivationService } from './deprivation.service'

const user = createCurrentUser()

const createService = (dto: unknown) => {
  const drivingLicenseApi = {
    getDeprivation: jest.fn().mockResolvedValue(dto),
  } as unknown as DrivingLicenseApi

  return {
    service: new DeprivationService(drivingLicenseApi),
    drivingLicenseApi,
  }
}

describe('DeprivationService', () => {
  describe('getDeprivation', () => {
    it('returns null when the response is empty', async () => {
      const { service } = createService(null)
      expect(await service.getDeprivation(user)).toBeNull()
    })

    it('returns null for the no-active-deprivation response', async () => {
      const { service } = createService({
        dateFrom: null,
        dateTo: null,
        licenseLost: false,
        deprivationName: null,
        deprivationType: null,
        licenseExpired: false,
        retakeLicense: false,
      })
      expect(await service.getDeprivation(user)).toBeNull()
    })

    it('passes the user as auth and their nationalId', async () => {
      const { service, drivingLicenseApi } = createService(null)
      await service.getDeprivation(user)
      expect(drivingLicenseApi.getDeprivation).toHaveBeenCalledWith({
        nationalId: user.nationalId,
        auth: user,
      })
    })

    it('maps the deprivation', async () => {
      const { service } = createService({
        dateFrom: new Date('2026-01-01'),
        dateTo: new Date('2027-01-01'),
        licenseLost: true,
        licenseExpired: false,
        deprivationName: 'Svipting',
        deprivationType: 3,
        retakeLicense: true,
      })

      expect(await service.getDeprivation(user)).toStrictEqual({
        dateFrom: new Date('2026-01-01'),
        dateTo: new Date('2027-01-01'),
        status: DrivingLicenseDeprivationStatus.LOST,
        name: 'Svipting',
        type: 3,
        retakeRequired: true,
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
          dateFrom: new Date('2026-01-01'),
          licenseLost,
          licenseExpired,
        })
        expect((await service.getDeprivation(user))?.status).toBe(expected)
      },
    )
  })
})
