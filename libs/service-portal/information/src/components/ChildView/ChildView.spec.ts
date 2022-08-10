import React from 'react'
import { getLivesWithParent } from './ChildView'

describe('getLivesWithParents', () => {
  it('should return Nei, unmatching parents', () => {
    const parents = ['1111111111']
    const parent = '0000000000'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual('Nei')
  })
  it('should return Já, matching parents', () => {
    const parents = ['1111111111']
    const parent = '1111111111'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual('Já')
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
