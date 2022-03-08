import { formatNationalId } from './formatNationalId'

describe('formatNationalId', () => {
  it('should return formatted national ids', () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    expect(formatNationalId('1111111111')).toEqual('111111-1111')
  })

  it('should not change other inputs', () => {
    expect(formatNationalId('otherstr')).toEqual('otherstr')
    expect(formatNationalId('1111111')).toEqual('1111111')
  })
})
