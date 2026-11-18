import { WorkMachineLicenseDto } from '@island.is/clients/seminars-ver'
import {
  formatDate,
  formatRightName,
  getOtherRights,
  getRenewableRights,
} from './machineLicenseRights'

const workMachineLicense: WorkMachineLicenseDto = {
  workMachineRightsDtos: [
    { category: 'D', categoryName: 'Körfukranar', validUntil: '2027-03-15' },
    { category: 'E', categoryName: 'Gröfur', validUntil: '2049-09-20' },
    { category: 'P', categoryName: 'Hleðslukranar', validUntil: '2027-03-15' },
  ],
  workMachineRightsRenewedDtos: [
    { category: 'D', categoryName: 'Körfukranar', validUntil: '2032-03-15' },
    { category: 'P', categoryName: 'Hleðslukranar', validUntil: '2032-03-15' },
  ],
}

describe('machineLicenseRights', () => {
  describe('getRenewableRights', () => {
    it('returns the renewable rights with their current validity', () => {
      expect(getRenewableRights(workMachineLicense)).toEqual([
        {
          category: 'D',
          categoryName: 'Körfukranar',
          validUntil: '2027-03-15',
        },
        {
          category: 'P',
          categoryName: 'Hleðslukranar',
          validUntil: '2027-03-15',
        },
      ])
    })

    it('returns an empty list when there is no data', () => {
      expect(getRenewableRights(undefined)).toEqual([])
    })
  })

  describe('getOtherRights', () => {
    it('returns the rights that are not renewable', () => {
      expect(getOtherRights(workMachineLicense)).toEqual([
        { category: 'E', categoryName: 'Gröfur', validUntil: '2049-09-20' },
      ])
    })

    it('returns all rights when none are renewable', () => {
      expect(
        getOtherRights({
          ...workMachineLicense,
          workMachineRightsRenewedDtos: null,
        }),
      ).toEqual(workMachineLicense.workMachineRightsDtos)
    })
  })

  describe('formatDate', () => {
    it('formats a date-only value', () => {
      expect(formatDate('2025-08-30')).toBe('30.08.2025')
    })

    it('returns an empty string for a value that cannot be parsed', () => {
      expect(formatDate('30.08.2025')).toBe('')
    })
  })

  describe('formatRightName', () => {
    it('uses the English name in English', () => {
      expect(
        formatRightName(
          {
            category: 'J',
            categoryName: 'Lyftarar',
            categoryNameEn: 'Forklifts',
          },
          'en',
        ),
      ).toBe('J - Forklifts')
    })

    it('falls back to the Icelandic name when there is no English name', () => {
      expect(
        formatRightName({ category: 'J', categoryName: 'Lyftarar' }, 'en'),
      ).toBe('J - Lyftarar')
    })

    it('shows only the category when there is no name', () => {
      expect(formatRightName({ category: 'J', categoryName: null }, 'is')).toBe(
        'J',
      )
    })
  })
})
