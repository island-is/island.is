import { useNamespace, useNamespaceStrict } from './useNamespace'

const messages = {
  title: 'My Title',
  explicitlyEmpty: '',
  nully: null,
} as const

describe('useNamespaceStrict', () => {
  const n = useNamespaceStrict(messages)
  {
    // Quick function signature testing
    const fooTyped1: 'My Title' = n('title')
    const fooTyped2: 'nully' = n('nully')
    const fooTyped3: 'nully' = n('nully', null)
    const fooTyped4: 'hello' = n('nully', 'hello')
    // @ts-expect-error  (proof it doesn't return any)
    const fooErr1: RegExp = n('title')
  }

  it('should return a string value', () => {
    expect(n('title')).toEqual('My Title')
    expect(n('title', 'Ignored fallback')).toEqual('My Title')
  })
  it('should return a explicitly empty string values', () => {
    expect(n('explicitlyEmpty')).toEqual('')
    expect(n('explicitlyEmpty', 'Ignored fallback')).toEqual('')
  })

  it('should return the key for defined but nully values', () => {
    expect(n('nully')).toEqual('nully')
    expect(n('nully', undefined)).toEqual('nully')
  })
  it('should return non-nully fallback value for defined but nully values', () => {
    expect(n('nully', 'Fallback text')).toEqual('Fallback text')
  })

  // Test handling of "invalid/unknown" keys
  // @ts-expect-error  (testing bad input)
  const invalidInput: keyof typeof messages = 'not_a_key'

  it('should return the key for unknown keys', () => {
    expect(n(invalidInput)).toEqual(invalidInput)
    expect(n(invalidInput, undefined)).toEqual(invalidInput)
  })
  it('should return non-nully fallback value for unknown keys', () => {
    expect(n(invalidInput, 'Fallback text')).toEqual('Fallback text')
  })
})

describe('useNamespace', () => {
  const n = useNamespace(messages)
  {
    // Quick function signature testing to ensure it to returns `any`
    const fooAny1: number = n('asdfasdf')
    const fooAny2: Element = n('asdfasdf', null)
    const fooAny3: Array<RegExp> = n('asdfasdf', 'yo')
  }

  it('should return a string value', () => {
    expect(n('title')).toEqual('My Title')
    expect(n('title', 'Ignored fallback')).toEqual('My Title')
  })
  it('should return a explicitly empty string values', () => {
    expect(n('explicitlyEmpty')).toEqual('')
    expect(n('explicitlyEmpty', 'Ignored fallback')).toEqual('')
  })

  it('should return the key for defined but nully values', () => {
    expect(n('nully')).toEqual('nully')
    expect(n('nully', undefined)).toEqual('nully')
  })
  it('should return non-nully fallback value for defined but nully values', () => {
    expect(n('nully', 'Fallback text')).toEqual('Fallback text')
  })

  // Test handling of "invalid/unknown" keys
  it('should return the key for unknown keys', () => {
    expect(n('not_a_key')).toEqual('not_a_key')
    expect(n('not_a_key', undefined)).toEqual('not_a_key')
  })
  it('should return non-nully fallback value for unknown keys', () => {
    expect(n('not_a_key', 'Fallback text')).toEqual('Fallback text')
  })
})
