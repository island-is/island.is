import { removeLocaleKeysFromEntry } from './utils'

describe('test', () => {
  it('should', () => {
    const testObject = {
      fields: {
        title: {
          'is-IS': 'Prufa',
          en: 'Test',
        },
        group: {
          'is-IS': {
            fields: {
              title: {
                'is-IS': 'Titill hóps',
                en: 'Group title',
              },
            },
          },
        },
        slug: {
          en: 'test',
        },
        relatedContent: {},
        activeTranslations: {},
      },
    }

    removeLocaleKeysFromEntry(testObject, 'is', 'activeTranslations')

    expect(testObject).toStrictEqual({
      fields: {
        title: 'Prufa',
        group: {
          fields: {
            title: 'Titill hóps',
          },
        },
        slug: null,
        relatedContent: null,
        activeTranslations: {},
      },
    })
  })
})
