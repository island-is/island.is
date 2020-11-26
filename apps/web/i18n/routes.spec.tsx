import { pathNames, AnchorAttributes } from './routes'

describe('Generating routes', () => {
  it('should return correct path to covid-adgerdir with slug', () => {
    const nextLinks: AnchorAttributes = pathNames('is', 'vidspyrna-frontpage', [
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
