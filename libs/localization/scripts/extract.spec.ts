import {
  convertToLocalArray,
  convertToContentfulArray,
  mergeArray,
} from './extract'

describe('extractFunctions', () => {
  it('should use local values if none is defined in contentful', () => {
    const localValues = {
      'application.system:no.value.in.contentful': {
        defaultMessage: 'Takk',
        description: 'Thanks',
      },
    }

    const contentfulValues = {
      fields: {
        strings: {
          'is-IS': [
            {
              id: 'application.system:no.value.in.contentful',
              defaultMessage: '',
              'is-IS': '',
              en: '',
            },
          ],
        },
      },
    }

    const local = convertToLocalArray(localValues)
    const distant = convertToContentfulArray(contentfulValues as any)

    expect(mergeArray(local, distant)).toStrictEqual([
      {
        id: 'application.system:no.value.in.contentful',
        defaultMessage: 'Takk',
        'is-IS': 'Takk',
        en: 'Thanks',
      },
    ])
  })

  it('should use contentful values if already defined', () => {
    const localValues = {
      'application.system:applications': {
        defaultMessage: 'Þínar umsóknir',
        description: 'this is gonna be overwritten',
      },
    }

    const contentfulValues = {
      fields: {
        strings: {
          'is-IS': [
            {
              id: 'application.system:applications',
              defaultMessage: 'Þínar umsóknir',
              'is-IS': 'Skilaboð',
              en: 'Message',
            },
          ],
        },
      },
    }

    const local = convertToLocalArray(localValues)
    const distant = convertToContentfulArray(contentfulValues as any)

    expect(mergeArray(local, distant)).toStrictEqual([
      {
        id: 'application.system:applications',
        defaultMessage: 'Þínar umsóknir',
        'is-IS': 'Skilaboð',
        en: 'Message',
      },
    ])
  })

  it('should use local values if object is missing inside contentful', () => {
    const localValues = {
      'application.system:new.field.missing.from.contentful': {
        defaultMessage: 'Takk',
        description: 'Thanks',
      },
    }

    const contentfulValues = {}
    const local = convertToLocalArray(localValues)
    const distant = convertToContentfulArray(contentfulValues as any)

    expect(mergeArray(local, distant)).toStrictEqual([
      {
        id: 'application.system:new.field.missing.from.contentful',
        defaultMessage: 'Takk',
        'is-IS': 'Takk',
        en: 'Thanks',
      },
    ])
  })
})
