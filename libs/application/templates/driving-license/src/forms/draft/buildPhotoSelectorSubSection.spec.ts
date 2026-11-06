import { createElement, FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { FormValue } from '@island.is/application/types'
import { PHOTO_FRAME_HEIGHT, PHOTO_FRAME_WIDTH } from './photoIllustration'
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

  describe('photo options render in one fixed frame', () => {
    // Þjóðskrá and RLS photos arrive at different pixel sizes, and a plain image
    // illustration rendered each at its natural size, so the two options came
    // out visibly mismatched. Both must go through the same fixed frame.
    const externalData = {
      allPhotosFromThjodskra: {
        data: {
          images: [
            {
              biometricId: 'facial-1',
              content: 'AAAA',
              contentSpecification: 'FACIAL',
            },
          ],
        },
        date: new Date(),
        status: 'success',
      },
      qualityPhotoAndSignature: {
        data: { imageId: 1, pohto: 'BBBB' },
        date: new Date(),
        status: 'success',
      },
    }

    const findNode = (node: unknown, id: string): unknown => {
      const item = node as { id?: string; children?: unknown[] }
      if (item?.id === id) return item
      for (const child of item?.children ?? []) {
        const found = findNode(child, id)
        if (found) return found
      }
      return undefined
    }

    it.each([
      subSectionQualityPhotoBE,
      subSectionQualityPhoto65,
      subSectionQualityPhotoTemp,
      subSectionQualityPhotoBFull,
    ])('%#: renders the Þjóðskrá and RLS photos at the same size', (s) => {
      const radio = findNode(s, 'selectLicensePhoto') as {
        options: (
          application: unknown,
        ) => Array<{ value: string; illustration: FC }>
      }
      const options = radio.options({ externalData })

      expect(options.map(({ value }) => value)).toEqual([
        'facial-1',
        'qualityPhoto',
      ])
      for (const { illustration } of options) {
        const html = renderToStaticMarkup(createElement(illustration))
        expect(html).toContain(`width="${PHOTO_FRAME_WIDTH}"`)
        expect(html).toContain(`height="${PHOTO_FRAME_HEIGHT}"`)
        expect(html).toContain('object-fit:contain')
      }
    })
  })
})
