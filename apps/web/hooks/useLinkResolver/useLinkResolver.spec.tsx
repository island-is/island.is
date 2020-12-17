export {}
/*
TODO: Write tests
import {
  pathNames,
  AnchorAttributes,
  removeSlugFromPath,
  replaceSlugInPath,
} from './useLinkResolver'

describe('Generating routes', () => {
  it('should return correct path to covid-adgerdir with slug', () => {
    const nextLinks: AnchorAttributes = pathNames('is', 'adgerdirfrontpage', [
      'cat',
    ])
    expect(nextLinks).toEqual({
      as: '/covid-adgerdir',
      href: '/covid-adgerdir',
    })
  })

  it('should return correct path to life events with slug', () => {
    const nextLinks: AnchorAttributes = pathNames('is', 'lifeeventpage', [
      'cat',
    ])
    expect(nextLinks).toEqual({
      as: '/lifsvidburdur/cat',
      href: '/lifsvidburdur/[slug]',
    })
  })

  it('should return correct path to life events without slug', () => {
    const nextLinks: AnchorAttributes = pathNames('is', 'lifeeventpage')
    expect(nextLinks).toEqual({
      as: '/lifsvidburdur',
      href: '/lifsvidburdur',
    })
  })

  it('should return correct path to news with slug', () => {
    const nextLinks: AnchorAttributes = pathNames('is', 'news', ['dog'])
    expect(nextLinks).toEqual({
      as: '/frett/dog',
      href: '/frett/[slug]',
    })
  })

  it('should return correct path to news without slug', () => {
    const nextLinks: AnchorAttributes = pathNames('is', 'news')
    expect(nextLinks).toEqual({
      as: '/frett',
      href: '/frett',
    })
  })
})

describe('Special cases routes', () => {
  it('should return as and href identical', () => {
    const nextLinks: AnchorAttributes = pathNames('is', 'page', [
      'stafraent-island',
    ])
    expect(nextLinks).toEqual({
      as: '/stofnanir/stafraent-island',
      href: '/stofnanir/stafraent-island',
    })
  })
})

describe('Route exceptions', () => {
  it('should handle content type with uppercase', () => {
    const lifeEvent: any = 'lifeEvent'
    const nextLinks: AnchorAttributes = pathNames('is', lifeEvent, ['cat'])
    expect(nextLinks).toEqual({
      as: '/lifsvidburdur/cat',
      href: '/lifsvidburdur/[slug]',
    })
  })

  it('should handle wrong content type ', () => {
    const contentType: any = 'dogPark'
    const nextLinks: AnchorAttributes = pathNames('is', contentType, ['cat'])
    expect(nextLinks).toEqual({
      as: '/',
      href: '/',
    })
  })

  it('should handle content type as empty string', () => {
    const contentType: any = ''
    const nextLinks: AnchorAttributes = pathNames('is', contentType, ['cat'])
    expect(nextLinks).toEqual({
      as: '/',
      href: '/',
    })
  })

  it('should handle content type as undefined', () => {
    const contentType = undefined
    const nextLinks: AnchorAttributes = pathNames('is', contentType, ['cat'])
    expect(nextLinks).toEqual({
      as: '/',
      href: '/',
    })
  })
})

describe('Regex operations', () => {
  it('should replace first slug in path with "bunny"', () => {
    const path = '/lifsvidburdur/[slug]'
    const resolvedPath: string = replaceSlugInPath(path, 'bunny')
    expect(resolvedPath).toEqual('/lifsvidburdur/bunny')
  })

  it('should replace slugs in path with replacement strings', () => {
    const slugs: string[] = ['bird', 'hamster', 'fish']
    let path = '/sky/[slug]/cage/[slug]/tank/[subslug]'
    for (let i = 0; i < slugs.length; i++) {
      path = replaceSlugInPath(path, slugs[i])
    }
    expect(path).toEqual('/sky/bird/cage/hamster/tank/fish')
  })

  it('should remove slug from path', () => {
    const path = '/lifsvidburdur/[slug]'
    const resolvedPath: string = removeSlugFromPath(path)
    expect(resolvedPath).toEqual('/lifsvidburdur')
  })

  it('should remove all slugs from path', () => {
    const path = '/sky/[slug]/cage/[slug]/tank/[subslug]'
    const resolvedPath: string = removeSlugFromPath(path)
    expect(resolvedPath).toEqual('/sky/cage/tank')
  })
})
*/
