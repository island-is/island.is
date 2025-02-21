import {
  convertToRegex,
  extractSlugsByRouteTemplate,
  linkResolver,
  LinkType,
  replaceVariableInPath,
  routesTemplate,
  typeResolver,
} from './useLinkResolver'

describe('Link resolver', () => {
  it('should return correct path to type without variable', () => {
    const nextLinks = linkResolver('search', [], 'is')
    expect(nextLinks).toEqual({
      href: '/leit',
    })
  })
  it('should return correct path to type with variable', () => {
    const nextLinks = linkResolver('lifeeventpage', ['cat'], 'is')
    expect(nextLinks).toEqual({
      href: '/lifsvidburdir/cat',
    })
  })

  it('should return correct path for all locales', () => {
    const nextIsLinks = linkResolver('news', ['hundur'], 'is')
    expect(nextIsLinks).toEqual({
      href: '/frett/hundur',
    })

    const nextEnLinks = linkResolver('news', ['dog'], 'en')
    expect(nextEnLinks).toEqual({
      href: '/en/news/dog',
    })
  })

  it('should direct unresolvable links to 404', () => {
    const nextEnLink = linkResolver('page', [], 'en')
    expect(nextEnLink).toEqual({
      href: '/404',
    })
  })

  it('should handle content type with uppercase', () => {
    // @ts-expect-error  (testing wrong input)
    const randomCasedInput: LinkType = 'lifeEventPage'
    const nextLinks = linkResolver(randomCasedInput, ['cat'], 'is')
    expect(nextLinks).toEqual({
      href: '/lifsvidburdir/cat',
    })
  })

  it('should handle wrong content type ', () => {
    // @ts-expect-error  (testing wrong input)
    const unknownInput: LinkType = 'dogPark'
    const nextLinks = [
      linkResolver(unknownInput, [''], 'is'),
      linkResolver(unknownInput, ['cat'], 'is'),
    ]
    nextLinks.forEach((link) => {
      expect(link).toEqual({
        href: '/404',
      })
    })
  })

  it('should handle content type as empty string', () => {
    // @ts-expect-error  (testing wrong input)
    const emptyInput: LinkType = ''
    const nextLinks = linkResolver(emptyInput, [], 'is')
    expect(nextLinks).toEqual({
      href: '/404',
    })
  })

  it('should handle content type as undefined', () => {
    // @ts-expect-error  (testing wrong input)
    const undefinedInput: LinkType = undefined as unknown // unknown because strict:false
    const nextLinks = linkResolver(undefinedInput, [], 'is')
    expect(nextLinks).toEqual({
      href: '/404',
    })
  })

  it('should return external urls as next links objects', () => {
    const nextLinks = linkResolver('linkurl', ['https://example.com'], 'is')
    expect(nextLinks).toEqual({
      href: 'https://example.com',
    })
  })

  it('should have no path repetition', () => {
    const types = Object.values(routesTemplate).reduce<Array<string>>(
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
    // @ts-expect-error  (testing wrong input)
    const undefinedInput: string = undefined as unkown // unknown because strict:false
    const types = typeResolver(undefinedInput)
    expect(types).toBeNull()
  })

  it('Should handle empty path', () => {
    const types = typeResolver('')
    expect(types).toBeNull()
  })

  it('Should not resolve partial matches when ignore dynamic is false', () => {
    const types = typeResolver('/fretr/andesbar/other')
    expect(types).toBeNull()
  })

  it('Should resolve partial matches when ignore dynamic is true', () => {
    const types = typeResolver('/frett/mycustomnews', true)
    expect(types).toEqual({
      type: 'newsoverview',
      locale: 'is',
      slug: [],
    })
  })

  it('Should resolve paths with dashes', () => {
    const types = typeResolver('/andes-foo/andes-bar')
    expect(types).toEqual({
      type: 'subarticle',
      locale: 'is',
      slug: ['andes-foo', 'andes-bar'],
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
    expect(regex).toEqual('^\\/test\\/[-\\w]+$')
  })

  it('Should convert deep dynamic template string to regex', () => {
    const regex = convertToRegex('/test/[replaceme]/then/[me]/ending')
    expect(regex).toEqual('^\\/test\\/[-\\w]+\\/then\\/[-\\w]+\\/ending$')
  })

  it('Should convert static template string to regex', () => {
    const regex = convertToRegex('/test')
    expect(regex).toEqual('^\\/test$')
  })
})
