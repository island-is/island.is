import { LocaleEnum } from '@island.is/nest/graphql'

import {
  byTitle,
  mapAgent,
  mapAllergyOption,
  mapHealthProfile,
  mapLanguageEnvironment,
  mapLanguageProfile,
  mapRelationType,
} from './keyInfo.mapper'

const value = (...entries: Array<[string, string]>) =>
  entries.map(([language, content]) => ({ language, content }))

const option = (overrides: Record<string, unknown> = {}) => ({
  id: 'option-1',
  key: 'mother',
  value: value(['is', 'Móðir'], ['en', 'Mother']),
  ...overrides,
})

const allergyOption = (overrides: Record<string, unknown> = {}) => ({
  ...option({ id: 'allergy-1', key: 'peanuts' }),
  type: 'foodAllergyAndIntolerance',
  ...overrides,
})

const contact = (overrides: Record<string, unknown> = {}) => ({
  id: 'agent-1',
  person: { nationalId: '0101302989', name: 'Gervimaður Afríka' },
  relationType: {
    id: 'relation-1',
    key: 'mother',
    value: value(['is', 'Móðir'], ['en', 'Mother']),
  },
  createdBy: {
    kind: 'guardian',
    displayName: 'Gervimaður Noregur',
    at: new Date('2026-03-04T10:11:12.000Z'),
  },
  canEdit: true,
  ...overrides,
})

const healthProfile = (overrides: Record<string, unknown> = {}) => ({
  epipen: true,
  medicalDiagnoses: false,
  medicationAssistance: true,
  allergies: [],
  updatedAt: null,
  updatedBy: null,
  ...overrides,
})

const languageProfile = (overrides: Record<string, unknown> = {}) => ({
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
    expect(mapRelationType(option(), LocaleEnum.Is).title).toBe('Móðir')
    expect(mapRelationType(option(), LocaleEnum.En).title).toBe('Mother')
  })

  it('falls back to the first translation when the locale is missing', () => {
    const relationType = option({ value: value(['pl', 'Matka']) })

    expect(mapRelationType(relationType, LocaleEnum.Is).title).toBe('Matka')
    expect(mapRelationType(relationType, LocaleEnum.En).title).toBe('Matka')
  })

  it('falls back only for the locale that is missing', () => {
    const relationType = option({
      value: value(['en', 'Mother'], ['pl', 'Matka']),
    })

    // `is` is missing, so it takes the first entry; `en` has its own.
    expect(mapRelationType(relationType, LocaleEnum.Is).title).toBe('Mother')
    expect(mapRelationType(relationType, LocaleEnum.En).title).toBe('Mother')
  })

  it('maps an empty translation list to an empty title', () => {
    expect(mapRelationType(option({ value: [] }), LocaleEnum.Is).title).toBe('')
  })

  it('maps a missing translation list to an empty title', () => {
    expect(
      mapRelationType(option({ value: undefined }), LocaleEnum.Is).title,
    ).toBe('')
  })
})

describe('byTitle', () => {
  it('orders titles by the collation of the requested locale', () => {
    const titles = [{ title: 'Önnur' }, { title: 'Amma' }, { title: 'Ávallt' }]

    expect(
      [...titles].sort(byTitle(LocaleEnum.Is)).map((item) => item.title),
    ).toEqual(['Amma', 'Ávallt', 'Önnur'])
  })
})

describe('mapRelationType', () => {
  it('exposes the key as the relation', () => {
    expect(mapRelationType(option(), LocaleEnum.Is)).toEqual({
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
        LocaleEnum.Is,
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
    expect(mapAllergyOption(allergyOption(), LocaleEnum.Is).type).toBe('food')
  })

  it('tags the general allergy key-option list as other', () => {
    expect(
      mapAllergyOption(allergyOption({ type: 'allergy' }), LocaleEnum.Is).type,
    ).toBe('other')
  })

  it('tags a key-option type it does not know as other', () => {
    expect(
      mapAllergyOption(allergyOption({ type: 'somethingElse' }), LocaleEnum.Is)
        .type,
    ).toBe('other')
  })
})

describe('mapHealthProfile allergies', () => {
  const allergy = (type: string) => ({
    id: `allergy-${type}`,
    key: type,
    value: value(['is', type]),
    type,
  })

  it('keeps food allergies in the food category', () => {
    const profile = mapHealthProfile(
      healthProfile({ allergies: [allergy('food')] }),
      LocaleEnum.Is,
    )

    expect(profile.allergies[0].type).toBe('food')
  })

  it('folds medicine and environmental allergies into other', () => {
    const profile = mapHealthProfile(
      healthProfile({
        allergies: [allergy('medicine'), allergy('environmental')],
      }),
      LocaleEnum.Is,
    )

    expect(profile.allergies.map((item) => item.type)).toEqual([
      'other',
      'other',
    ])
  })
})

describe('mapHealthProfile audit fields', () => {
  it('passes the update timestamp through as a date', () => {
    const updatedAt = new Date('2026-03-04T10:11:12.000Z')
    const profile = mapHealthProfile(
      healthProfile({
        updatedAt,
        updatedBy: { kind: 'organization', displayName: 'Skóli' },
      }),
      LocaleEnum.Is,
    )

    expect(profile.updatedAt).toBe(updatedAt)
    expect(profile.updatedBy).toEqual({
      kind: 'organization',
      displayName: 'Skóli',
    })
  })

  it('maps a missing audit trail to undefined', () => {
    const profile = mapHealthProfile(healthProfile(), LocaleEnum.Is)

    expect(profile.updatedAt).toBeUndefined()
    expect(profile.updatedBy).toBeUndefined()
  })

  it('maps a null displayName to undefined', () => {
    const profile = mapHealthProfile(
      healthProfile({
        updatedBy: { kind: 'system', displayName: null },
      }),
      LocaleEnum.Is,
    )

    expect(profile.updatedBy).toEqual({
      kind: 'system',
      displayName: undefined,
    })
  })

  it('maps a kind it does not know to unknown', () => {
    const profile = mapHealthProfile(
      healthProfile({ updatedBy: { kind: 'somethingElse' } }),
      LocaleEnum.Is,
    )

    expect(profile.updatedBy?.kind).toBe('unknown')
  })
})

describe('mapLanguageProfile', () => {
  it('maps the profile through', () => {
    expect(mapLanguageProfile(languageProfile(), LocaleEnum.Is)).toEqual({
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
      LocaleEnum.Is,
    )

    expect(profile.languageEnvironment).toBeUndefined()
    expect(profile.preferredLanguage).toBeUndefined()
  })
})

describe('mapAgent', () => {
  it('maps a contact through, keeping the registration date', () => {
    const registeredAt = new Date('2026-03-04T10:11:12.000Z')

    expect(
      mapAgent(
        contact({
          createdBy: {
            kind: 'guardian',
            displayName: 'Gervimaður Noregur',
            at: registeredAt,
          },
        }),
        LocaleEnum.Is,
      ),
    ).toEqual({
      id: 'agent-1',
      person: { nationalId: '0101302989', name: 'Gervimaður Afríka' },
      relationType: {
        id: 'relation-1',
        title: 'Móðir',
      },
      createdBy: {
        kind: 'guardian',
        displayName: 'Gervimaður Noregur',
        at: registeredAt,
      },
      canEdit: true,
    })
  })

  it('leaves the relation type out when MMS has none', () => {
    expect(
      mapAgent(contact({ relationType: null }), LocaleEnum.Is).relationType,
    ).toBeUndefined()
  })

  it('maps a null createdBy displayName to undefined', () => {
    const agent = mapAgent(
      contact({
        createdBy: {
          kind: 'unknown',
          displayName: null,
          at: new Date('2026-03-04T10:11:12.000Z'),
        },
      }),
      LocaleEnum.Is,
    )

    expect(agent.createdBy.displayName).toBeUndefined()
  })
})
