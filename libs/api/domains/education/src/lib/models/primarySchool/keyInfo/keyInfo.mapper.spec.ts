import {
  AllergyOutputTypeEnum,
  CreatedByOutputKindEnum,
  UpdatedByOutputKindEnum,
  FOOD_ALLERGY_TYPE,
  OTHER_ALLERGY_TYPE,
  type AllergyOption,
  type EmergencyContactOutput,
  type HealthProfileOutput,
  type KeyOptionValueOutput,
  type LanguageProfileOutput,
  type Option,
} from '@island.is/clients/mms/frigg'

import {
  mapAgent,
  mapAllergyOption,
  mapHealthProfile,
  mapLanguageEnvironment,
  mapLanguageProfile,
  mapRelationType,
} from './keyInfo.mapper'

const value = (
  ...entries: Array<[string, string]>
): Array<KeyOptionValueOutput> =>
  entries.map(([language, content]) => ({ language, content }))

const option = (
  overrides: Partial<Option> = {},
): Option & { value: Array<KeyOptionValueOutput> } => ({
  id: 'option-1',
  key: 'mother',
  value: value(['is', 'Móðir'], ['en', 'Mother']),
  ...overrides,
})

const allergyOption = (overrides: Partial<AllergyOption> = {}) =>
  ({
    ...option({ id: 'allergy-1', key: 'peanuts' }),
    type: FOOD_ALLERGY_TYPE,
    ...overrides,
  } as AllergyOption)

const contact = (
  overrides: Partial<EmergencyContactOutput> = {},
): EmergencyContactOutput => ({
  id: 'agent-1',
  person: { nationalId: '0101302989', name: 'Gervimaður Afríka' },
  relationType: {
    id: 'relation-1',
    key: 'mother',
    value: value(['is', 'Móðir'], ['en', 'Mother']),
  },
  createdBy: {
    kind: CreatedByOutputKindEnum.Guardian,
    displayName: 'Gervimaður Noregur',
    at: new Date('2026-03-04T10:11:12.000Z'),
  },
  canEdit: true,
  ...overrides,
})

const healthProfile = (
  overrides: Partial<HealthProfileOutput> = {},
): HealthProfileOutput => ({
  epipen: true,
  medicalDiagnoses: false,
  medicationAssistance: true,
  allergies: [],
  updatedAt: null,
  updatedBy: null,
  ...overrides,
})

const languageProfile = (
  overrides: Partial<LanguageProfileOutput> = {},
): LanguageProfileOutput => ({
  languageEnvironment: {
    id: 'env-1',
    key: 'onlyIcelandic',
    value: value(['is', 'Eingöngu íslenska'], ['en', 'Only Icelandic']),
  },
  preferredLanguage: 'is',
  languages: ['is', 'pl'],
  interpreter: false,
  signLanguage: false,
  updatedAt: null,
  updatedBy: null,
  ...overrides,
})

describe('localize', () => {
  it('picks the matching translation per locale', () => {
    expect(mapRelationType(option()).title).toEqual({
      is: 'Móðir',
      en: 'Mother',
    })
  })

  it('falls back to the first translation when a locale is missing', () => {
    const title = mapRelationType(
      option({ value: value(['pl', 'Matka']) }),
    ).title

    expect(title).toEqual({ is: 'Matka', en: 'Matka' })
  })

  it('falls back per locale, keeping the one that is present', () => {
    const title = mapRelationType(
      option({ value: value(['en', 'Mother'], ['pl', 'Matka']) }),
    ).title

    // `is` is missing, so it takes the first entry; `en` keeps its own.
    expect(title).toEqual({ is: 'Mother', en: 'Mother' })
  })

  it('maps an empty translation list to empty strings', () => {
    expect(mapRelationType(option({ value: [] })).title).toEqual({
      is: '',
      en: '',
    })
  })

  it('maps a missing translation list to empty strings', () => {
    const title = mapRelationType(
      option({ value: undefined as unknown as Array<KeyOptionValueOutput> }),
    ).title

    expect(title).toEqual({ is: '', en: '' })
  })
})

describe('mapRelationType', () => {
  it('exposes the key as the relation', () => {
    expect(mapRelationType(option())).toEqual({
      id: 'option-1',
      relation: 'mother',
      title: { is: 'Móðir', en: 'Mother' },
    })
  })
})

describe('mapLanguageEnvironment', () => {
  it('exposes the key as the code', () => {
    expect(
      mapLanguageEnvironment(option({ id: 'env-1', key: 'onlyIcelandic' })),
    ).toEqual({
      id: 'env-1',
      code: 'onlyIcelandic',
      title: { is: 'Móðir', en: 'Mother' },
    })
  })
})

describe('mapAllergyOption', () => {
  it('tags the food key-option list as food', () => {
    expect(mapAllergyOption(allergyOption()).type).toBe('food')
  })

  it('tags the general allergy key-option list as other', () => {
    expect(
      mapAllergyOption(allergyOption({ type: OTHER_ALLERGY_TYPE })).type,
    ).toBe('other')
  })

  it('tags a key-option type it does not know as other', () => {
    expect(
      mapAllergyOption(allergyOption({ type: 'somethingElse' })).type,
    ).toBe('other')
  })
})

describe('mapHealthProfile allergies', () => {
  const allergy = (type: AllergyOutputTypeEnum) => ({
    id: `allergy-${type}`,
    key: type,
    value: value(['is', type]),
    type,
  })

  it('keeps food allergies in the food category', () => {
    const profile = mapHealthProfile(
      healthProfile({ allergies: [allergy(AllergyOutputTypeEnum.Food)] }),
    )

    expect(profile.allergies[0].type).toBe('food')
  })

  it('folds medicine and environmental allergies into other', () => {
    const profile = mapHealthProfile(
      healthProfile({
        allergies: [
          allergy(AllergyOutputTypeEnum.Medicine),
          allergy(AllergyOutputTypeEnum.Environmental),
        ],
      }),
    )

    expect(profile.allergies.map((item) => item.type)).toEqual([
      'other',
      'other',
    ])
  })
})

describe('mapHealthProfile audit fields', () => {
  it('serialises updatedAt to an ISO string', () => {
    const profile = mapHealthProfile(
      healthProfile({
        updatedAt: new Date('2026-03-04T10:11:12.000Z'),
        updatedBy: {
          kind: UpdatedByOutputKindEnum.Organization,
          displayName: 'Skóli',
        },
      }),
    )

    expect(profile.updatedAt).toBe('2026-03-04T10:11:12.000Z')
    expect(profile.updatedBy).toEqual({
      kind: 'organization',
      displayName: 'Skóli',
    })
  })

  it('maps a missing audit trail to undefined', () => {
    const profile = mapHealthProfile(healthProfile())

    expect(profile.updatedAt).toBeUndefined()
    expect(profile.updatedBy).toBeUndefined()
  })

  it('maps a null displayName to undefined', () => {
    const profile = mapHealthProfile(
      healthProfile({
        updatedBy: { kind: UpdatedByOutputKindEnum.System, displayName: null },
      }),
    )

    expect(profile.updatedBy).toEqual({
      kind: 'system',
      displayName: undefined,
    })
  })
})

describe('mapLanguageProfile', () => {
  it('maps the profile through', () => {
    expect(mapLanguageProfile(languageProfile())).toEqual({
      languageEnvironment: {
        id: 'env-1',
        code: 'onlyIcelandic',
        title: { is: 'Eingöngu íslenska', en: 'Only Icelandic' },
      },
      preferredLanguage: 'is',
      languages: ['is', 'pl'],
      interpreter: false,
      signLanguage: false,
      updatedAt: undefined,
      updatedBy: undefined,
    })
  })

  it('maps a null language environment and preferred language to undefined', () => {
    const profile = mapLanguageProfile(
      languageProfile({ languageEnvironment: null, preferredLanguage: null }),
    )

    expect(profile.languageEnvironment).toBeUndefined()
    expect(profile.preferredLanguage).toBeUndefined()
  })
})

describe('mapAgent', () => {
  it('maps a contact through, serialising the registration date', () => {
    expect(mapAgent(contact())).toEqual({
      id: 'agent-1',
      person: { nationalId: '0101302989', name: 'Gervimaður Afríka' },
      relationType: {
        id: 'relation-1',
        title: { is: 'Móðir', en: 'Mother' },
      },
      createdBy: {
        kind: 'guardian',
        displayName: 'Gervimaður Noregur',
        at: '2026-03-04T10:11:12.000Z',
      },
      canEdit: true,
    })
  })

  it('falls back to an empty relation type when MMS has none', () => {
    expect(mapAgent(contact({ relationType: null })).relationType).toEqual({
      id: '',
      title: { is: '', en: '' },
    })
  })

  it('maps a null createdBy displayName to undefined', () => {
    const agent = mapAgent(
      contact({
        createdBy: {
          kind: CreatedByOutputKindEnum.Unknown,
          displayName: null,
          at: new Date('2026-03-04T10:11:12.000Z'),
        },
      }),
    )

    expect(agent.createdBy.displayName).toBeUndefined()
  })
})
