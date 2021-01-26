import {
  linkResolver,
  typeResolver,
  LinkType,
  routesTemplate,
  extractSlugsByRouteTemplate,
  replaceVariableInPath,
  convertToRegex,
} from './useLinkResolver'

describe('Link resolver', () => {
  it('should return correct path to type with out variable', () => {
    const nextLinks = linkResolver('adgerdirfrontpage', [], 'is')
    expect(nextLinks).toEqual('/covid-adgerdir')
  })

  it('should return correct path to type with variable', () => {
    const nextLinks = linkResolver('lifeeventpage', ['cat'], 'is')
    expect(nextLinks).toEqual('/lifsvidburdur/cat')
  })

  it('should return correct path for all locales', () => {
    const nextIsLinks = linkResolver('news', ['hundur'], 'is')
    expect(nextIsLinks).toEqual('/frett/hundur')

    const nextEnLinks = linkResolver('news', ['dog'], 'en')
    expect(nextEnLinks).toEqual('/en/news/dog')
  })

  it('should direct unresolvable links to 404', () => {
    const nextEnLink = linkResolver('page', [], 'en')
    expect(nextEnLink).toEqual('/404')
  })

  it('should handle content type with uppercase', () => {
    const nextLinks = linkResolver('lifeEventPage' as LinkType, ['cat'], 'is')
    expect(nextLinks).toEqual('/lifsvidburdur/cat')
  })

  it('should handle wrong content type ', () => {
    const nextLinks = [
      linkResolver('dogPark' as LinkType, [''], 'is'),
      linkResolver('dogPark' as LinkType, ['cat'], 'is'),
    ]
    nextLinks.map((link) => {
      expect(link).toEqual('/404')
    })
  })

  it('should handle content type as empty string', () => {
    const nextLinks = linkResolver('' as LinkType, [], 'is')
    expect(nextLinks).toEqual('/404')
  })

  it('should handle content type as undefined', () => {
    const nextLinks = linkResolver(undefined as LinkType, [], 'is')
    expect(nextLinks).toEqual('/404')
  })

  it('should return external urls as next links objects', () => {
    const nextLinks = linkResolver(
      'linkurl' as LinkType,
      ['https://example.com'],
      'is',
    )
    expect(nextLinks).toEqual('https://example.com')
  })

  it('should have no path repetition', () => {
    const types = Object.values(routesTemplate).reduce(
      (types, templateObject) => {
        if (templateObject.en) {
          types.push(templateObject.en)
        }
        if (templateObject.is) {
          types.push(templateObject.is)
        }
        return types
      },
      [],
    )
    expect(types.length === new Set(types).size).toBeTruthy()
  })

  it('should have no link type repetition', () => {
    const types = Object.keys(routesTemplate).map((type) => type.toLowerCase())
    expect(types.length === new Set(types).size).toBeTruthy()
  })
})

describe('Type resolver', () => {
  it('Should find path with variables', () => {
    const types = typeResolver('/flokkur/mycustomcategory')
    expect(types).toEqual({
      type: 'articlecategory',
      locale: 'is',
      slug: ['mycustomcategory'],
    })
  })

  it('Should match path without variables', () => {
    const types = typeResolver('/frett')
    expect(types).toEqual({
      type: 'newsoverview',
      locale: 'is',
      slug: [],
    })
  })

  it('Should support multiple locales', () => {
    const typesIs = typeResolver('/frett/mycustomnews')
    expect(typesIs).toEqual({
      type: 'news',
      locale: 'is',
      slug: ['mycustomnews'],
    })

    const typesEn = typeResolver('/en/news/mycustomnews')
    expect(typesEn).toEqual({
      type: 'news',
      locale: 'en',
      slug: ['mycustomnews'],
    })
  })

  it('Should handle undefined', () => {
    const types = typeResolver(undefined)
    expect(types).toBeNull()
  })

  it('Should handle empty path', () => {
    const types = typeResolver('')
    expect(types).toBeNull()
  })

  it('Should ignore dynamic paths', () => {
    const types = typeResolver('/frett/mycustomnews', true)
    expect(types).toEqual({
      type: 'newsoverview',
      locale: 'is',
      slug: [],
    })
  })
})

describe('Extract slugs by route template', () => {
  it('Should handle short static paths', () => {
    const slug = extractSlugsByRouteTemplate('/en', '/en')
    expect(slug).toEqual([])
  })

  it('Should handle short dynamic paths', () => {
    const slug = extractSlugsByRouteTemplate('/theslug', '/[slug]')
    expect(slug).toEqual(['theslug'])
  })

  it('Should handle long static paths', () => {
    const slug = extractSlugsByRouteTemplate(
      '/mega/long/path',
      '/mega/long/path',
    )
    expect(slug).toEqual([])
  })

  it('Should handle long dynamic paths', () => {
    const slug = extractSlugsByRouteTemplate(
      '/mega/long/path',
      '/[slug]/[subSlug]/[subSubSlug]',
    )
    expect(slug).toEqual(['mega', 'long', 'path'])
  })
})

describe('Replace variable in path', () => {
  it('Should replace variable ins string', () => {
    const path = replaceVariableInPath('/test/[replaceme]', 'case')
    expect(path).toEqual('/test/case')
  })
})

describe('Convert to regex', () => {
  it('Should convert dynamic template string to regex', () => {
    const regex = convertToRegex('/test/[replaceme]')
    expect(regex).toEqual('\\/test\\/\\w+$')
  })

  it('Should convert static template string to regex', () => {
    const regex = convertToRegex('/test')
    expect(regex).toEqual('\\/test$')
  })
})
