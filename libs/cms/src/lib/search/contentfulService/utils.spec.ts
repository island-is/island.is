import { parseSyncApiNode } from './utils'

describe('sync api parsing', () => {
  it('should mutate object correctly', () => {
    const testObject = {
      sys: {},
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
        news: {
          tags: ['some-organization-slug'],
          size: 4,
          order: 'desc',
          organization: 'some-organization-slug',
          lang: 'is',
        },
        relatedContent: {},
        activeTranslations: {},
      },
    }

    parseSyncApiNode(testObject, 'is', ['activeTranslations'])

    expect(testObject).toStrictEqual({
      sys: { locale: 'is-IS' },
      fields: {
        title: 'Prufa',
        group: {
          fields: {
            title: 'Titill hóps',
          },
        },
        slug: null,
        relatedContent: {},
        activeTranslations: {},
        news: {
          tags: ['some-organization-slug'],
          size: 4,
          order: 'desc',
          organization: 'some-organization-slug',
          lang: 'is',
        },
      },
    })
  })
})
