import { readNationalIdQueryParameter } from './nationalRegistryQuery'

describe('readNationalIdQueryParameter', () => {
  it('should accept a national id', () => {
    expect(readNationalIdQueryParameter({ nationalId: '0101010101' })).toBe(
      '0101010101',
    )
  })

  it('should accept a national id written with a dash', () => {
    expect(readNationalIdQueryParameter({ nationalId: '010101-0101' })).toBe(
      '0101010101',
    )
  })

  it('should accept a business national id', () => {
    expect(readNationalIdQueryParameter({ nationalId: '410101-0101' })).toBe(
      '4101010101',
    )
  })

  it('should accept a national id surrounded by whitespace', () => {
    expect(readNationalIdQueryParameter({ nationalId: ' 0101010101 ' })).toBe(
      '0101010101',
    )
  })

  it('should accept a national id that fails the checksum', () => {
    // System national ids are real lookups and do not pass the checksum.
    expect(readNationalIdQueryParameter({ nationalId: '0101010100' })).toBe(
      '0101010100',
    )
  })

  // The reported attack: an extra query parameter smuggled into the value
  // turns a single lookup into a bulk search of the national registry.
  it('should refuse a value carrying another query parameter', () => {
    expect(
      readNationalIdQueryParameter({ nationalId: '&name=ari&count=1000' }),
    ).toBeUndefined()
  })

  it('should refuse a national id with a query parameter appended', () => {
    expect(
      readNationalIdQueryParameter({
        nationalId: '0101010101&name=ari&count=1000',
      }),
    ).toBeUndefined()
  })

  it('should refuse a value containing an equals sign', () => {
    expect(
      readNationalIdQueryParameter({ nationalId: 'name=ari' }),
    ).toBeUndefined()
  })

  it('should refuse a value that would change the path', () => {
    expect(
      readNationalIdQueryParameter({ nationalId: '../../v1/people' }),
    ).toBeUndefined()
  })

  it('should refuse a missing national id', () => {
    expect(readNationalIdQueryParameter({})).toBeUndefined()
  })

  it('should refuse an empty national id', () => {
    expect(readNationalIdQueryParameter({ nationalId: '' })).toBeUndefined()
  })

  it('should refuse a repeated national id', () => {
    // A repeated query parameter arrives as an array.
    expect(
      readNationalIdQueryParameter({
        nationalId: ['0101010101', '&name=ari'],
      }),
    ).toBeUndefined()
  })

  it('should refuse a national id that is too short', () => {
    expect(
      readNationalIdQueryParameter({ nationalId: '010101010' }),
    ).toBeUndefined()
  })

  it('should refuse a national id that is too long', () => {
    expect(
      readNationalIdQueryParameter({ nationalId: '01010101010' }),
    ).toBeUndefined()
  })

  it('should refuse a national id containing a letter', () => {
    expect(
      readNationalIdQueryParameter({ nationalId: '010101010a' }),
    ).toBeUndefined()
  })
})
