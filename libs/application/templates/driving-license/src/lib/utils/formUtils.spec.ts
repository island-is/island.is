import { createApplication } from '@island.is/application/testing'
import {
  isVisible,
  isApplicationForCondition,
  needsHealthCertificateCondition,
  allowFakeCondition,
  hasCompletedPrerequisitesStep,
  hasUsableRlsQualityPhoto,
  hasHealthRemarks,
  getHealthCertificateRemarks,
  isRedesignedBTempOrBFull,
} from './formUtils'
import { NO, YES } from '@island.is/application/core'
import { Remark } from '../types'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE } from '../constants'

describe('isVisible', () => {
  it('returns true when all functions return true', () => {
    expect(
      isVisible(
        () => true,
        () => true,
      )({}),
    ).toBe(true)
  })
})

describe('isApplicationForCondition', () => {
  describe('expecting B-full', () => {
    it('returns true when it is not defined', () => {
      expect(isApplicationForCondition('B-full')({}))
    })

    it('returns true when B-full is selected', () => {
      expect(
        isApplicationForCondition('B-full')({ applicationFor: 'B-full' }),
      ).toBe(true)
    })

    it('returns false when B-temp is selected', () => {
      expect(
        isApplicationForCondition('B-full')({ applicationFor: 'B-temp' }),
      ).toBe(false)
    })
  })
})

describe('needsHealthCertificateCondition', () => {
  it('returns true when one ore more values in the list is marked yes', () => {
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: YES,
            isAlcoholic: NO,
          },
        },
        { glassesCheck: { data: false, status: 'success', date: new Date() } },
      ),
    ).toBe(true)
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: YES,
            isAlcoholic: YES,
          },
        },

        { glassesCheck: { data: true, status: 'success', date: new Date() } },
      ),
    ).toBe(true)
  })

  it('returns false when none of them are marked yes', () => {
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: NO,
            isAlcoholic: NO,
          },
        },
        { glassesCheck: { data: false, status: 'success', date: new Date() } },
      ),
    ).toBe(false)
  })

  it('returns true when glasses mismatch', () => {
    expect(
      needsHealthCertificateCondition(YES)(
        {
          healthDeclaration: {
            usesContactGlasses: NO,
            isAlcoholic: NO,
          },
        },
        { glassesCheck: { data: true, status: 'success', date: new Date() } },
      ),
    ).toBe(true)
  })
})

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

describe('hasCompletedPrerequisitesStep', () => {
  it('returns true for an application where the prerequisites have been completed', () => {
    expect(
      hasCompletedPrerequisitesStep(true)({
        application: createApplication({
          answers: {
            requirementsMet: true,
          },
        }),
      }),
    ).toBe(true)
  })

  it('returns false for an empty application', () => {
    expect(
      hasCompletedPrerequisitesStep(true)({ application: createApplication() }),
    ).toBe(false)
  })
  it('returns false for an empty application', () => {
    expect(
      hasCompletedPrerequisitesStep(true)({
        application: createApplication({
          answers: {
            requirementsMet: false,
          },
        }),
      }),
    ).toBe(false)
  })
})

describe('hasUsableRlsQualityPhoto', () => {
  const wrap = (data: unknown) =>
    ({
      qualityPhotoAndSignature: {
        data,
        date: new Date(),
        status: 'success' as const,
      },
    } as any)

  it('returns true when RLS returns imageId + binary', () => {
    expect(
      hasUsableRlsQualityPhoto(
        wrap({ imageId: 1390033, imageTypeId: 1, pohto: 'base64data' }),
      ),
    ).toBe(true)
  })

  // Regression: legacy RLS records return metadata + signature but no photo
  // binary. Submission resolves photo by reference (imageId) so the user
  // should still pass eligibility and see the option.
  it('returns true when imageId is present but pohto is null', () => {
    expect(
      hasUsableRlsQualityPhoto(
        wrap({
          imageId: 1390033,
          imageTypeId: 1,
          imageTypeName: 'Passamynd',
          pohto: null,
        }),
      ),
    ).toBe(true)
  })

  it('returns false when imageId is null', () => {
    expect(hasUsableRlsQualityPhoto(wrap({ imageId: null, pohto: null }))).toBe(
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

describe('hasHealthRemarks', () => {
  const wrap = (remarks: Remark[] | undefined) =>
    ({
      currentLicense: {
        data: { remarks },
        date: new Date(),
        status: 'success' as const,
      },
    } as any)

  it('returns false when remarks is empty', () => {
    expect(hasHealthRemarks(wrap([]))).toBe(false)
  })

  // Regression: code 71 ("samrit" / duplicate license) is administrative,
  // not medical. Reported prod shape from a real applicant — the BE form
  // previously opened the health-certificate upload for this user.
  it('returns false for administrative code 71 (samrit)', () => {
    expect(
      hasHealthRemarks(
        wrap([
          {
            code: '71',
            description:
              'Samrit ökuskírteinis nr. (auðkennisstafir ESB/SÞ fyrir þriðju lönd, t.d.„71.987654321.HR").',
          },
        ]),
      ),
    ).toBe(false)
  })

  it('returns true for vision subcode 01.06', () => {
    expect(
      hasHealthRemarks(
        wrap([{ code: '01.06', description: 'Gleraugu eða snertilinsur' }]),
      ),
    ).toBe(true)
  })

  it('returns true for parent code 01', () => {
    expect(
      hasHealthRemarks(
        wrap([{ code: '01', description: 'Leiðrétting sjónar og/eða vörn.' }]),
      ),
    ).toBe(true)
  })

  it('returns true when a medical remark is mixed with an administrative one', () => {
    expect(
      hasHealthRemarks(
        wrap([
          { code: '71', description: 'Samrit' },
          { code: '02', description: 'Heyrnartæki/samskiptastoð.' },
        ]),
      ),
    ).toBe(true)
  })

  it('returns false when currentLicense.data is missing', () => {
    expect(hasHealthRemarks({})).toBe(false)
  })
})

describe('getHealthCertificateRemarks', () => {
  it('returns only allowlisted remarks from a mixed input', () => {
    const result = getHealthCertificateRemarks([
      { code: '71', description: 'Samrit' },
      { code: '01.06', description: 'Gleraugu eða snertilinsur' },
      { code: '400', description: 'Other restriction' },
      { code: '03.01', description: 'Stoðtæki fyrir hönd' },
    ])
    expect(result.map((r) => r.code)).toEqual(['01.06', '03.01'])
  })

  it('returns an empty array for undefined input', () => {
    expect(getHealthCertificateRemarks(undefined)).toEqual([])
  })

  it('returns an empty array when nothing matches', () => {
    expect(
      getHealthCertificateRemarks([
        { code: '71', description: 'Samrit' },
        { code: '400', description: 'Other' },
      ]),
    ).toEqual([])
  })
})

describe('isRedesignedBTempOrBFull', () => {
  it.each([
    [{ applicationFor: B_TEMP, isBTempRedesignEnabled: true }, true],
    [{ applicationFor: B_FULL, isBFullRedesignEnabled: true }, true],
    // Each product reads only its own flag: the cross-flag pairs are the
    // copy-paste error this predicate invites, and getting one wrong would put
    // a draft on the v6 endpoint with no upload rendered (or the reverse).
    [{ applicationFor: B_TEMP, isBFullRedesignEnabled: true }, false],
    [{ applicationFor: B_FULL, isBTempRedesignEnabled: true }, false],
    [{ applicationFor: B_TEMP }, false],
    [{ applicationFor: B_FULL }, false],
    [{ applicationFor: B_TEMP, isBTempRedesignEnabled: false }, false],
    [{ applicationFor: B_FULL, isBFullRedesignEnabled: false }, false],
    // The flag is persisted from a feature-flag client, so anything other than
    // a real `true` must not opt a draft in.
    [{ applicationFor: B_TEMP, isBTempRedesignEnabled: 'true' }, false],
    // Other products never match, whichever flags are set.
    [
      {
        applicationFor: BE,
        isBTempRedesignEnabled: true,
        isBFullRedesignEnabled: true,
      },
      false,
    ],
    [
      {
        applicationFor: B_FULL_RENEWAL_65,
        isBTempRedesignEnabled: true,
        isBFullRedesignEnabled: true,
      },
      false,
    ],
    [{}, false],
  ])('%p -> %s', (answers, expected) => {
    expect(isRedesignedBTempOrBFull(answers)).toBe(expected)
  })
})
