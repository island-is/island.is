import {
  allowFakeCondition,
  getCodes,
  hasUsableRlsQualityPhoto,
} from './formUtils'
import { NO, YES } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import {
  B_ADVANCED,
  BE,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
  Pickup,
} from '../constants'

describe('allowFakeCondition', () => {
  it('works', () => {
    expect(allowFakeCondition(YES)({ fakeData: { useFakeData: YES } })).toBe(
      true,
    )
    expect(allowFakeCondition(YES)({ fakeData: { useFakeData: NO } })).toBe(
      false,
    )
    expect(allowFakeCondition(YES)({ fakeData: {} })).toBe(false)
    expect(allowFakeCondition(YES)({})).toBe(false)
  })
})

describe('hasUsableRlsQualityPhoto', () => {
  const wrap = (data: unknown): ExternalData =>
    ({
      qualityPhotoAndSignature: {
        data,
        date: new Date(),
        status: 'success' as const,
      },
    } as ExternalData)

  it('returns true when RLS returns imageId + binary', () => {
    expect(
      hasUsableRlsQualityPhoto(
        wrap({ imageId: 1390033, imageTypeId: 1, photo: 'base64data' }),
      ),
    ).toBe(true)
  })

  // Regression: legacy RLS records return metadata + signature but no photo
  // binary. Submission resolves photo by reference (imageId) so the user
  // should still pass eligibility and see the option.
  it('returns true when imageId is present but photo is null', () => {
    expect(
      hasUsableRlsQualityPhoto(
        wrap({
          imageId: 1390033,
          imageTypeId: 1,
          imageTypeName: 'Passamynd',
          photo: null,
        }),
      ),
    ).toBe(true)
  })

  it('returns false when imageId is null', () => {
    expect(hasUsableRlsQualityPhoto(wrap({ imageId: null, photo: null }))).toBe(
      false,
    )
  })

  it('returns false when externalData is empty', () => {
    expect(hasUsableRlsQualityPhoto({})).toBe(false)
  })

  it('returns false when data is null', () => {
    expect(hasUsableRlsQualityPhoto(wrap(null))).toBe(false)
  })
})

describe('getCodes', () => {
  const buildApplication = (answers: Record<string, unknown>): Application =>
    ({ answers } as Application)

  it('returns the BE charge code for a BE application', () => {
    expect(getCodes(buildApplication({ applicationFor: BE }))).toEqual([
      { code: CHARGE_ITEM_CODES[BE] },
    ])
  })

  it('returns the advanced charge code for a B-advanced application', () => {
    expect(getCodes(buildApplication({ applicationFor: B_ADVANCED }))).toEqual([
      { code: CHARGE_ITEM_CODES[B_ADVANCED] },
    ])
  })

  it('appends the delivery fee when delivery method is POST', () => {
    expect(
      getCodes(
        buildApplication({
          applicationFor: BE,
          delivery: { deliveryMethod: Pickup.POST },
        }),
      ),
    ).toEqual([
      { code: CHARGE_ITEM_CODES[BE] },
      { code: CHARGE_ITEM_CODES[DELIVERY_FEE] },
    ])
  })

  it('does not append the delivery fee for DISTRICT pickup', () => {
    expect(
      getCodes(
        buildApplication({
          applicationFor: B_ADVANCED,
          delivery: { deliveryMethod: Pickup.DISTRICT },
        }),
      ),
    ).toEqual([{ code: CHARGE_ITEM_CODES[B_ADVANCED] }])
  })

  // The summary price renderer relies on this throw being guarded; if it ever
  // stops throwing, that guard becomes dead and an unpriced charge could slip
  // through.
  it('throws when applicationFor is missing', () => {
    expect(() => getCodes(buildApplication({}))).toThrow(
      'No selected charge item code',
    )
  })
})
