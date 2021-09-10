/* eslint-disable local-rules/disallow-kennitalas */

import { parseNationalIdFromXRoadClient } from './jwt.strategy.utils'

describe('parseNationalIdFromXRoadClient', () => {
  it('should return null when no national id is present', () => {
    expect(parseNationalIdFromXRoadClient('')).toBe(null)
    expect(parseNationalIdFromXRoadClient('asdf')).toBe(null)
    expect(parseNationalIdFromXRoadClient('IS/GOV/missing')).toBe(null)
    expect(parseNationalIdFromXRoadClient('IS/GOV/123456789/missing')).toBe(
      null,
    )
  })

  it('should return national id when present', () => {
    expect(
      parseNationalIdFromXRoadClient('IS/GOV/1111111119/institution'),
    ).toBe('1111111119')

    expect(
      parseNationalIdFromXRoadClient('IS/GOV/1811921519/institution'),
    ).toBe('1811921519')
  })

  it('should return null when invalid national id is present', () => {
    expect(
      parseNationalIdFromXRoadClient('IS/GOV/9111111119/institution'),
    ).toBe(null)
  })
})
