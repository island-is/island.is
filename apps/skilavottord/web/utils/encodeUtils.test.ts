import { encode } from './encodeUtils'

describe('encode', () => {
  it('should normalize and remove diacritics from a string', () => {
    expect(encode('áéíóúý')).toBe('aeiouy')
  })

  it('should replace Icelandic characters with their equivalents', () => {
    expect(encode('ðþæÞÆ')).toBe('dthaethae')
  })

  it('should remove special characters', () => {
    expect(encode('hello@world!')).toBe('helloworld')
  })

  it('should handle a mix of diacritics, Icelandic characters, and special characters', () => {
    expect(encode('hëlló ðþæ!')).toBe('hellodthae')
  })

  it('should return an empty string for an input with only special characters', () => {
    expect(encode('!@#$%^&*()')).toBe('')
  })

  it('should handle an empty string input', () => {
    expect(encode('')).toBe('')
  })

  it('should handle strings with only alphanumeric characters', () => {
    expect(encode('abc123')).toBe('abc123')
  })
})
