import React from 'react'
import { getLivesWithParent } from './ChildView'

describe('getLivesWithParents', () => {
  it('should return false, unmatching parents', () => {
    const parents = ['1111111111']
    const parent = '0000000000'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual(false)
  })
  it('should return true, matching parents', () => {
    const parents = ['1111111111']
    const parent = '1111111111'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual(true)
  })
  it('should return undefined, undefined parents', () => {
    const parents = undefined
    const parent = '1111111111'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual(undefined)
  })
  it('should return undefined, undefined candidate parent', () => {
    const parents = ['111111111']
    const parent = undefined

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual(undefined)
  })
  it('should return undefined, all props undefined', () => {
    const parents = undefined
    const parent = undefined

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual(undefined)
  })
})
