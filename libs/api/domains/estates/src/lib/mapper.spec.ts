import { LocaleEnum } from '@island.is/nest/graphql'

import { mapToEstateCollection, mapToEstatesCase } from './mapper'

const BASE_URL = 'https://download.test'

describe('mapToEstateCollection', () => {
  it('skips estates missing caseId or deceased name', () => {
    const complete = {
      caseId: 'c1',
      deceased: { name: 'Jón' },
    }

    const result = mapToEstateCollection([
      complete,
      { ...complete, caseId: null },
      { ...complete, deceased: {} },
    ])

    expect(result.map((e) => e.id)).toEqual(['c1'])
  })
})

describe('mapToEstatesCase', () => {
  it('suffixes id with locale', () => {
    const result = mapToEstatesCase(
      { caseId: { value: 'c1' } },
      LocaleEnum.En,
      BASE_URL,
    )

    expect(result.id).toBe('c1-en')
  })

  it.each([
    [LocaleEnum.En, { icelandic: 'Opið', english: 'Open' }, 'Open'],
    [LocaleEnum.En, { icelandic: 'Opið', english: '' }, 'Opið'],
    [LocaleEnum.Is, { icelandic: 'Opið', english: 'Open' }, 'Opið'],
    [LocaleEnum.Is, { icelandic: '', english: '' }, undefined],
  ])('resolves %s text %o to %s', (locale, text, expected) => {
    const result = mapToEstatesCase({ status: { text } }, locale, BASE_URL)

    expect(result.status?.text).toBe(expected)
  })

  it('drops the 0001-01-01 completedDate sentinel', () => {
    const result = mapToEstatesCase(
      {
        progress: {
          steps: [
            { completedDate: new Date('0001-01-01T00:00:00Z') },
            { completedDate: new Date('2026-01-15T00:00:00Z') },
          ],
        },
      },
      LocaleEnum.Is,
      BASE_URL,
    )

    expect(result.progress?.steps?.map((s) => s.completedDate)).toEqual([
      undefined,
      new Date('2026-01-15T00:00:00Z'),
    ])
  })
})
