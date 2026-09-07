import { FormValue } from '@island.is/application/types'
import { subSectionQualityPhotoBE } from './subSectionQualityPhotoBE'
import { subSectionQualityPhoto65 } from './subSectionQualityPhoto65'
import { subSectionQualityPhotoTemp } from './subSectionQualityPhotoTemp'
import { subSectionQualityPhotoBFull } from './subSectionQualityPhotoBFull'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE } from '../../lib/constants'

// These three sub-sections are produced by the shared
// `buildPhotoSelectorSubSection` builder. This spec pins the behaviour that must
// stay identical after collapsing the three former copies into one builder:
//   - each still gates on the right product,
//   - 65+ and B-temp stay hidden unless their redesign flag is on (they are off
//     in prod), while BE has no flag and is always shown for BE,
//   - the warning banner shows for 65+/B-temp but not BE,
//   - the inner form-node ids are unchanged (so in-flight drafts are unaffected).

type Built = typeof subSectionQualityPhotoBE

const evalCondition = (subSection: Built, answers: FormValue): boolean => {
  const { condition } = subSection
  if (typeof condition !== 'function') {
    throw new Error('expected a dynamic (function) condition')
  }
  // isVisible() only reads answers; externalData and user are unused here.
  return condition(answers, {}, null)
}

// Collect every descendant field id under a sub-section.
const collectIds = (node: unknown): string[] => {
  const item = node as { id?: string; children?: unknown[] }
  const here = item?.id ? [item.id] : []
  const kids = Array.isArray(item?.children)
    ? item.children.flatMap(collectIds)
    : []
  return [...here, ...kids]
}

describe('buildPhotoSelectorSubSection', () => {
  describe('sub-section ids are stable', () => {
    it.each([
      [subSectionQualityPhotoBE, 'photoStepBE'],
      [subSectionQualityPhoto65, 'photoStep65'],
      [subSectionQualityPhotoTemp, 'photoStepTemp'],
      [subSectionQualityPhotoBFull, 'photoStepBFull'],
    ])('%#: has the expected id', (subSection, expectedId) => {
      expect(subSection.id).toBe(expectedId)
    })
  })

  describe('BE — no flag, always shown for BE', () => {
    it('shows for BE regardless of any redesign flag', () => {
      expect(
        evalCondition(subSectionQualityPhotoBE, { applicationFor: BE }),
      ).toBe(true)
    })
    it('is hidden for other products', () => {
      expect(
        evalCondition(subSectionQualityPhotoBE, { applicationFor: B_FULL }),
      ).toBe(false)
    })
  })

  describe('65+ — gated on is65RenewalRedesignEnabled', () => {
    it('is hidden when the redesign flag is off (prod default)', () => {
      expect(
        evalCondition(subSectionQualityPhoto65, {
          applicationFor: B_FULL_RENEWAL_65,
        }),
      ).toBe(false)
    })
    it('shows when the redesign flag is on', () => {
      expect(
        evalCondition(subSectionQualityPhoto65, {
          applicationFor: B_FULL_RENEWAL_65,
          is65RenewalRedesignEnabled: true,
        }),
      ).toBe(true)
    })
    it('is hidden for the wrong product even with the flag on', () => {
      expect(
        evalCondition(subSectionQualityPhoto65, {
          applicationFor: B_TEMP,
          is65RenewalRedesignEnabled: true,
        }),
      ).toBe(false)
    })
  })

  describe('B-temp — gated on isBTempRedesignEnabled', () => {
    it('is hidden when the redesign flag is off (prod default)', () => {
      expect(
        evalCondition(subSectionQualityPhotoTemp, { applicationFor: B_TEMP }),
      ).toBe(false)
    })
    it('shows when the redesign flag is on', () => {
      expect(
        evalCondition(subSectionQualityPhotoTemp, {
          applicationFor: B_TEMP,
          isBTempRedesignEnabled: true,
        }),
      ).toBe(true)
    })
  })

  describe('B-full — gated on isBFullRedesignEnabled', () => {
    it('is hidden when the redesign flag is off (prod default)', () => {
      expect(
        evalCondition(subSectionQualityPhotoBFull, { applicationFor: B_FULL }),
      ).toBe(false)
    })
    it('shows when the redesign flag is on', () => {
      expect(
        evalCondition(subSectionQualityPhotoBFull, {
          applicationFor: B_FULL,
          isBFullRedesignEnabled: true,
        }),
      ).toBe(true)
    })
    it('is hidden for the wrong product even with the flag on', () => {
      expect(
        evalCondition(subSectionQualityPhotoBFull, {
          applicationFor: B_TEMP,
          isBFullRedesignEnabled: true,
        }),
      ).toBe(false)
    })
  })

  describe('warning banner presence follows withNoPhotoAlert', () => {
    it('BE omits the noUsablePhotoAlert banner', () => {
      expect(collectIds(subSectionQualityPhotoBE)).not.toContain(
        'noUsablePhotoAlert',
      )
    })
    it('65+, B-temp and B-full include the noUsablePhotoAlert banner', () => {
      expect(collectIds(subSectionQualityPhoto65)).toContain(
        'noUsablePhotoAlert',
      )
      expect(collectIds(subSectionQualityPhotoTemp)).toContain(
        'noUsablePhotoAlert',
      )
      expect(collectIds(subSectionQualityPhotoBFull)).toContain(
        'noUsablePhotoAlert',
      )
    })
  })

  describe('inner form-node ids are preserved (no draft migration)', () => {
    it.each([
      subSectionQualityPhotoBE,
      subSectionQualityPhoto65,
      subSectionQualityPhotoTemp,
      subSectionQualityPhotoBFull,
    ])('%#: keeps selectPhoto / selectLicensePhoto / photoDescription', (s) => {
      const ids = collectIds(s)
      expect(ids).toEqual(
        expect.arrayContaining([
          'selectPhoto',
          'selectLicensePhoto',
          'photoDescription',
        ]),
      )
    })
  })
})
