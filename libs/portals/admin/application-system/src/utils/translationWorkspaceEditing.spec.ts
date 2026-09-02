import { isOwnedTranslationMessageId } from '@island.is/application/utils'

import { buildTranslationsToSave } from './translationWorkspaceEditing'

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
