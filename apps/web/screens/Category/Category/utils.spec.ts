import {
  getActiveCategory,
  getHashArr,
  getHashString,
  updateHashArray,
} from './utils'

describe('Update hash array', () => {
  const categoryId = 'kisa'
  it('should return array with new item', () => {
    const hashArr = ['hundur', 'fugl']
    const updatedHashArray = ['hundur', 'fugl', 'kisa']
    expect(updateHashArray(hashArr, categoryId)).toEqual(updatedHashArray)
  })

  it('should return array without id', () => {
    const hashArr = ['hundur', 'fugl', 'kisa']
    const updatedHashArray = ['hundur', 'fugl']
    expect(updateHashArray(hashArr, categoryId)).toEqual(updatedHashArray)
  })

  it('should return array without id', () => {
    const hashArr = ['hundur', 'kisa', 'fugl']
    const updatedHashArray = ['hundur', 'fugl']
    expect(updateHashArray(hashArr, categoryId)).toEqual(updatedHashArray)
  })

  it('should return empty array', () => {
    expect(updateHashArray([], '')).toEqual([])
  })

  it('should return array with id', () => {
    const hashArr = []
    const updatedHashArray = [categoryId]
    expect(updateHashArray(hashArr, categoryId)).toEqual(updatedHashArray)
  })

  it('should not add empty string to arr', () => {
    const hashArr = ['fugl', 'hundur', 'kisa']
    expect(updateHashArray(hashArr, '')).toEqual(hashArr)
  })

  it('should handle undefined id', () => {
    const hashArr = ['fugl', 'hundur', 'kisa']
    expect(updateHashArray(hashArr, undefined)).toEqual(hashArr)
  })

  it('should handle null id', () => {
    const hashArr = ['fugl', 'hundur', 'kisa']
    expect(updateHashArray(hashArr, null)).toEqual(hashArr)
  })

  it('should handle null hash array', () => {
    expect(updateHashArray(null, 'fugl')).toEqual(['fugl'])
  })

  it('should handle undefined hash array', () => {
    expect(updateHashArray(undefined, 'fugl')).toEqual(['fugl'])
  })

  it('should handle undefined hash array and undefined id', () => {
    expect(updateHashArray(undefined, undefined)).toEqual([])
  })

  it('should handle null hash array and null id', () => {
    expect(updateHashArray(null, null)).toEqual([])
  })
})

describe('Get Active Category', () => {
  it('should return null', () => {
    const hashString = ['#']
    expect(getActiveCategory(hashString)).toBeNull()
  })

  it('should return kisa', () => {
    const hashString = ['#hundur', 'fugl', 'kisa']
    expect(getActiveCategory(hashString)).toEqual('kisa')
  })

  it('should return hundur', () => {
    const hashString = ['#', 'hundur']
    expect(getActiveCategory(hashString)).toEqual('hundur')
  })

  it('should return fugl', () => {
    const hashString = ['#hundur', 'fugl']
    expect(getActiveCategory(hashString)).toEqual('fugl')
  })

  it('should return null', () => {
    const hashString = null
    expect(getActiveCategory(hashString)).toBeNull()
  })

  it('should return null', () => {
    const hashString = undefined
    expect(getActiveCategory(hashString)).toBeNull()
  })
})

describe('Get Hash String from Hash Array', () => {
  it('should return empty string', () => {
    const hashArr = ['']
    expect(getHashString(hashArr)).toEqual('')
  })

  it('should handle null and return empty string', () => {
    const hashArr = null
    expect(getHashString(hashArr)).toEqual('')
  })

  it('should handle undefined and return empty string', () => {
    const hashArr = undefined
    expect(getHashString(hashArr)).toEqual('')
  })

  it('should return the string kisa', () => {
    const hashArr = ['kisa']
    expect(getHashString(hashArr)).toEqual('kisa')
  })

  it('should return comma separated string', () => {
    const hashArr = ['kisa', 'hundur']
    expect(getHashString(hashArr)).toEqual('kisa,hundur')
  })
})

describe('Get Hash String from Hash Array', () => {
  it('should return null if given empty string', () => {
    const hash = ''
    expect(getHashArr(hash)).toBeNull()
  })

  it('should handle null', () => {
    const hash = null
    expect(getHashArr(hash)).toBeNull()
  })

  it('should handle undefined', () => {
    const hash = undefined
    expect(getHashArr(hash)).toBeNull()
  })

  it('should return the array with string kisa', () => {
    const hash = 'kisa'
    expect(getHashArr(hash)).toEqual(['kisa'])
  })

  it('should turn separated string to an array', () => {
    const hash = 'kisa,hundur'
    expect(getHashArr(hash)).toEqual(['kisa', 'hundur'])
  })
})
