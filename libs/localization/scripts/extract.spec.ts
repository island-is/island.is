import { updateDefaultsObject, updateStringsObject } from './utils'

describe('extractFunctions', () => {
  const locales = [{ id: 'is-IS' }, { id: 'en' }]

  it('should update defaults strings if changed locally', () => {
    const localValues = {
      'application.system:no.value.in.contentful': {
        defaultMessage: 'Takk',
        description: `Some field's description`,
        deprecated: false,
      },
    }

    const contentfulValues = {
      fields: {
        defaults: {
          'is-IS': {
            'application.system:no.value.in.contentful': {
              defaultMessage: 'Old default message',
              description: 'Description',
            },
          },
        },
      },
    } as any

    expect(updateDefaultsObject(contentfulValues, localValues)).toStrictEqual({
      'application.system:no.value.in.contentful': {
        defaultMessage: 'Takk',
        description: `Some field's description`,
        deprecated: false,
      },
    })
  })

  it('should pass `deprecated` to true if the contentful message is not defined locally anymore', () => {
    const localValues = {}

    const contentfulValues = {
      fields: {
        defaults: {
          'is-IS': {
            'application.system:removed.locally': {
              defaultMessage: 'Þínar umsóknir',
              description: `Some field's description`,
            },
          },
        },
      },
    } as any

    expect(updateDefaultsObject(contentfulValues, localValues)).toStrictEqual({
      'application.system:removed.locally': {
        defaultMessage: 'Þínar umsóknir',
        description: `Some field's description`,
        deprecated: true,
      },
    })
  })

  it('should use local defaultMessage to populate icelandic translation if not existing in contentful yet', () => {
    const localValues = {
      'application.system:new.field.missing.from.contentful': {
        defaultMessage: 'Takk',
        description: `Some field's description`,
        deprecated: false,
      },
    }

    const contentfulValues = { fields: {} } as any

    expect(updateDefaultsObject(contentfulValues, localValues)).toStrictEqual({
      'application.system:new.field.missing.from.contentful': {
        defaultMessage: 'Takk',
        description: `Some field's description`,
        deprecated: false,
      },
    })
  })

  it('should use Contentful values if already defined and use local ones when undefined in Contentful', () => {
    const localValues = {
      'application.system:applications': {
        defaultMessage: 'Þínar umsóknir',
        description: `Some field's description`,
        deprecated: false,
      },
      'application.system:heading': {
        defaultMessage: 'Daginn',
        description: `Heading's copy`,
        deprecated: false,
      },
      'application.system:back': {
        defaultMessage: 'Til baka',
        description: 'Back button copy',
        deprecated: false,
      },
    }

    const contentfulValues = {
      fields: {
        strings: {
          'is-IS': {
            'application.system:applications': 'Þínar umsóknir',
            'application.system:heading': 'Goðan daginn',
          },
          en: {
            'application.system:applications': 'Your applications',
            'application.system:heading': 'Good morning',
          },
        },
      },
    } as any

    expect(
      updateStringsObject(contentfulValues, localValues, locales),
    ).toStrictEqual({
      'is-IS': {
        'application.system:applications': 'Þínar umsóknir',
        'application.system:heading': 'Goðan daginn',
        'application.system:back': 'Til baka',
      },
      en: {
        'application.system:applications': 'Your applications',
        'application.system:heading': 'Good morning',
        'application.system:back': '',
      },
    })
  })
})
