import { getSlugPart } from './getSlugPart'

describe('getSlugPart', () => {
  let result: string
  let part: number

  it('should return second slug', () => {
    result = 'second'
    part = 2

    expect(getSlugPart('first/second', part)).toEqual(result)
    expect(getSlugPart('first/second/third', part)).toEqual(result)
    expect(getSlugPart('/first/second/third', part)).toEqual(result)
    expect(getSlugPart('first/second/third/', part)).toEqual(result)
    expect(getSlugPart('/first//second/third/', part)).toEqual(result)
  })

  it('should return first slug', () => {
    result = 'first'
    part = 1

    expect(getSlugPart('first/second', part)).toEqual(result)
    expect(getSlugPart('first/second/third', part)).toEqual(result)
    expect(getSlugPart('/first/second/third', part)).toEqual(result)
    expect(getSlugPart('first/second/third/', part)).toEqual(result)
    expect(getSlugPart('/first//second/third/', part)).toEqual(result)
  })

  it('should return empty string', () => {
    result = ''
    part = 2

    expect(getSlugPart('first/', part)).toEqual(result)
    expect(getSlugPart('first', part)).toEqual(result)
    expect(getSlugPart('/first/', part)).toEqual(result)
    expect(getSlugPart('/', part)).toEqual(result)
    expect(getSlugPart('', part)).toEqual(result)
  })
})
