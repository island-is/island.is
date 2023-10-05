import { LicenseId } from '../license.types'
import { mapLicenseIdToLicenseType } from '../utils/mapLicenseId'

describe('Utils', () => {
  describe('mapLicenseId', () => {
    describe('should map license id to a type when valid id is provided', () => {
      it('should map firearmLicense to FirearmLicense', () => {
        expect(mapLicenseIdToLicenseType(LicenseId.FIREARM_LICENSE)).toMatch(
          'FirearmLicense',
        )
      })
      it('should map driversLicense to DriversLicense', () => {
        expect(mapLicenseIdToLicenseType(LicenseId.DRIVERS_LICENSE)).toMatch(
          'DriversLicense',
        )
      })
      it('should map disabilityLicense to DisabilityLicense', () => {
        expect(mapLicenseIdToLicenseType(LicenseId.DISABILITY_LICENSE)).toMatch(
          'DisabilityLicense',
        )
      })
    })
  })
})
