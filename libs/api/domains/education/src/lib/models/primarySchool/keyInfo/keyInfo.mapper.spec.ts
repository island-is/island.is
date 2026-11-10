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
  byTitle,
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
  it('picks the translation for the requested locale', () => {
    expect(mapRelationType(option(), 'is').title).toBe('Móðir')
    expect(mapRelationType(option(), 'en').title).toBe('Mother')
  })

  it('falls back to the first translation when the locale is missing', () => {
    const relationType = option({ value: value(['pl', 'Matka']) })

    expect(mapRelationType(relationType, 'is').title).toBe('Matka')
    expect(mapRelationType(relationType, 'en').title).toBe('Matka')
  })

  it('falls back only for the locale that is missing', () => {
    const relationType = option({
      value: value(['en', 'Mother'], ['pl', 'Matka']),
    })

    // `is` is missing, so it takes the first entry; `en` has its own.
    expect(mapRelationType(relationType, 'is').title).toBe('Mother')
    expect(mapRelationType(relationType, 'en').title).toBe('Mother')
  })

  it('maps an empty translation list to an empty title', () => {
    expect(mapRelationType(option({ value: [] }), 'is').title).toBe('')
  })

  it('maps a missing translation list to an empty title', () => {
    const relationType = option({
      value: undefined as unknown as Array<KeyOptionValueOutput>,
    })

    expect(mapRelationType(relationType, 'is').title).toBe('')
  })
})

describe('byTitle', () => {
  it('orders titles by the collation of the requested locale', () => {
    const titles = [{ title: 'Önnur' }, { title: 'Amma' }, { title: 'Ávallt' }]

    expect([...titles].sort(byTitle('is')).map((t) => t.title)).toEqual([
      'Amma',
      'Ávallt',
      'Önnur',
    ])
  })
})

describe('mapRelationType', () => {
  it('exposes the key as the relation', () => {
    expect(mapRelationType(option(), 'is')).toEqual({
      id: 'option-1',
      relation: 'mother',
      title: 'Móðir',
    })
  })
})

describe('mapLanguageEnvironment', () => {
  it('exposes the key as the code', () => {
    expect(
      mapLanguageEnvironment(
        option({ id: 'env-1', key: 'onlyIcelandic' }),
        'is',
      ),
    ).toEqual({
      id: 'env-1',
      code: 'onlyIcelandic',
      title: 'Móðir',
    })
  })
})

describe('mapAllergyOption', () => {
  it('tags the food key-option list as food', () => {
    expect(mapAllergyOption(allergyOption(), 'is').type).toBe('food')
  })

  it('tags the general allergy key-option list as other', () => {
    expect(
      mapAllergyOption(allergyOption({ type: OTHER_ALLERGY_TYPE }), 'is').type,
    ).toBe('other')
  })

  it('tags a key-option type it does not know as other', () => {
    expect(
      mapAllergyOption(allergyOption({ type: 'somethingElse' }), 'is').type,
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
      'is',
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
      'is',
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
      'is',
    )

    expect(profile.updatedAt).toBe('2026-03-04T10:11:12.000Z')
    expect(profile.updatedBy).toEqual({
      kind: 'organization',
      displayName: 'Skóli',
    })
  })

  it('maps a missing audit trail to undefined', () => {
    const profile = mapHealthProfile(healthProfile(), 'is')

    expect(profile.updatedAt).toBeUndefined()
    expect(profile.updatedBy).toBeUndefined()
  })

  it('maps a null displayName to undefined', () => {
    const profile = mapHealthProfile(
      healthProfile({
        updatedBy: { kind: UpdatedByOutputKindEnum.System, displayName: null },
      }),
      'is',
    )

    expect(profile.updatedBy).toEqual({
      kind: 'system',
      displayName: undefined,
    })
  })
})

describe('mapLanguageProfile', () => {
  it('maps the profile through', () => {
    expect(mapLanguageProfile(languageProfile(), 'is')).toEqual({
      languageEnvironment: {
        id: 'env-1',
        code: 'onlyIcelandic',
        title: 'Eingöngu íslenska',
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
      'is',
    )

    expect(profile.languageEnvironment).toBeUndefined()
    expect(profile.preferredLanguage).toBeUndefined()
  })
})

describe('mapAgent', () => {
  it('maps a contact through, serialising the registration date', () => {
    expect(mapAgent(contact(), 'is')).toEqual({
      id: 'agent-1',
      person: { nationalId: '0101302989', name: 'Gervimaður Afríka' },
      relationType: {
        id: 'relation-1',
        title: 'Móðir',
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
    expect(
      mapAgent(contact({ relationType: null }), 'is').relationType,
    ).toEqual({
      id: '',
      title: '',
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
      'is',
    )

    expect(agent.createdBy.displayName).toBeUndefined()
  })
})
