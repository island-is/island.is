import { translationsFromContentful } from './translationsFromContentful'
import { translationsFromLocal } from './translationsFromLocal'
import { mergeArray } from './mergeArray'

describe('extractFunctions', () => {
  const locales = [{ id: 'is-IS' }, { id: 'en' }]

  it('should use local values if none is defined in contentful', () => {
    const localValues = {
      'application.system:no.value.in.contentful': {
        defaultMessage: 'Takk',
        description: `Some field's description`,
      },
    }

    const contentfulValues = {
      fields: {
        strings: {
          'is-IS': [
            {
              id: 'application.system:no.value.in.contentful',
              defaultMessage: '',
              description: '',
              'is-IS': '',
              en: '',
            },
          ],
        },
      },
    }

    const local = translationsFromLocal(localValues)
    const distant = translationsFromContentful(contentfulValues as any)

    expect(mergeArray(local, distant, locales)).toStrictEqual([
      {
        id: 'application.system:no.value.in.contentful',
        defaultMessage: 'Takk',
        description: `Some field's description`,
        'is-IS': 'Takk',
        en: '',
        deprecated: false,
      },
    ])
  })

  it('should use contentful values if already defined', () => {
    const localValues = {
      'application.system:applications': {
        defaultMessage: 'Þínar umsóknir',
        description: `Some field's description`,
      },
    }

    const contentfulValues = {
      fields: {
        strings: {
          'is-IS': [
            {
              id: 'application.system:applications',
              defaultMessage: 'Þínar umsóknir',
              description: `Some field's description`,
              'is-IS': 'Skilaboð',
              en: 'Message',
            },
          ],
        },
      },
    }

    const local = translationsFromLocal(localValues)
    const distant = translationsFromContentful(contentfulValues as any)

    expect(mergeArray(local, distant, locales)).toStrictEqual([
      {
        id: 'application.system:applications',
        defaultMessage: 'Þínar umsóknir',
        description: `Some field's description`,
        'is-IS': 'Skilaboð',
        en: 'Message',
        deprecated: false,
      },
    ])
  })

  it('should use local values if object is missing inside contentful', () => {
    const localValues = {
      'application.system:new.field.missing.from.contentful': {
        defaultMessage: 'Takk',
        description: `Some field's description`,
      },
    }

    const contentfulValues = {}
    const local = translationsFromLocal(localValues)
    const distant = translationsFromContentful(contentfulValues as any)

    expect(mergeArray(local, distant, locales)).toStrictEqual([
      {
        id: 'application.system:new.field.missing.from.contentful',
        defaultMessage: 'Takk',
        description: `Some field's description`,
        'is-IS': 'Takk',
        en: '',
        deprecated: false,
      },
    ])
  })

  it('should keep the production messages even if removed from the local messages', () => {
    const localValues = {}

    const contentfulValues = {
      fields: {
        strings: {
          'is-IS': [
            {
              id: 'application.system:removed.locally',
              defaultMessage: 'Þínar umsóknir',
              description: `Some field's description`,
              'is-IS': 'Skilaboð',
              en: 'Message',
            },
          ],
        },
      },
    }

    const local = translationsFromLocal(localValues)
    const distant = translationsFromContentful(contentfulValues as any)

    expect(mergeArray(local, distant, locales)).toStrictEqual([
      {
        id: 'application.system:removed.locally',
        defaultMessage: 'Þínar umsóknir',
        description: `Some field's description`,
        'is-IS': 'Skilaboð',
        en: 'Message',
        deprecated: true,
      },
    ])
  })
})
