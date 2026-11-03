import { isOwnedTranslationMessageId } from '@island.is/application/utils'

import {
  buildTranslationsToSave,
  packGoogleTranslateBatches,
} from './translationWorkspaceEditing'

describe('buildTranslationsToSave', () => {
  it('does not save shared-namespace keys into the application namespace', () => {
    const saved = buildTranslationsToSave(
      {
        is: {
          'hb.application:draft.title': 'Persónuupplýsingar',
          'uiForms.application:applicantInfo.labels.name': 'Fullt nafn',
        },
        en: {},
      },
      {},
      'hb.application',
    )

    expect(saved).toEqual([
      {
        namespace: 'hb.application',
        messageKey: 'hb.application:draft.title',
        valueIs: 'Persónuupplýsingar',
      },
    ])
    expect(
      isOwnedTranslationMessageId(
        'uiForms.application:applicantInfo.labels.name',
        ['hb.application'],
      ),
    ).toBe(false)
  })
})

describe('packGoogleTranslateBatches', () => {
  it('splits by character budget so a 100-item batch cannot exceed the request cap', () => {
    const items = Array.from({ length: 4 }, (_, index) => ({
      id: `key-${index}`,
      sourceText: 'a'.repeat(10_000),
    }))

    const { batches, skippedOversized } = packGoogleTranslateBatches(
      items,
      100,
      30_000,
      5_000,
    )

    expect(skippedOversized).toBe(4)
    expect(batches).toEqual([])
  })

  it('packs items that fit and isolates leftover capacity into the next batch', () => {
    const items = [
      { id: 'one', sourceText: 'a'.repeat(20_000) },
      { id: 'two', sourceText: 'b'.repeat(20_000) },
      { id: 'three', sourceText: 'c'.repeat(100) },
    ]

    const { batches, skippedOversized } = packGoogleTranslateBatches(
      items,
      100,
      30_000,
      25_000,
    )

    expect(skippedOversized).toBe(0)
    expect(batches).toHaveLength(2)
    expect(batches[0].map((item) => item.id)).toEqual(['one'])
    expect(batches[1].map((item) => item.id)).toEqual(['two', 'three'])
  })
})
