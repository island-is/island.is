import React from 'react'
import { getLivesWithParent } from './ChildView'

describe('getLivesWithParents', () => {
  it('should return Nei, unmatching parents', () => {
    const parents = ['0101704359']
    const parent = '123'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual('Nei')
  })
  it('should return Já, matching parents', () => {
    const parents = ['0101704359']
    const parent = '0101704359'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual('Já')
  })
  it('should return undefined, undefined parents', () => {
    const parents = undefined
    const parent = '0101704359'

    const result = getLivesWithParent(parents, parent)

    expect(result).toEqual(undefined)
  })
  it('should return undefined, undefined candidate parent', () => {
    const parents = ['0101704359']
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
