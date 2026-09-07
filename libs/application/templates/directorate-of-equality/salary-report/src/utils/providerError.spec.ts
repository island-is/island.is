import { createIntl } from 'react-intl'
import { messages } from '../lib/messages'
import { getProviderErrorMessage } from './providerError'

describe('getProviderErrorMessage', () => {
  it('returns undefined when there is no reason', () => {
    expect(getProviderErrorMessage(undefined)).toBeUndefined()
    expect(getProviderErrorMessage(null)).toBeUndefined()
  })

  // Shape 1: StaticText as a plain string.
  it('passes a plain string through', () => {
    expect(getProviderErrorMessage('Sniðmátið er af eldri útgáfu')).toBe(
      'Sniðmátið er af eldri útgáfu',
    )
  })

  // Shape 2: a single ProviderErrorReason.
  it('prefers summary over title on a single reason', () => {
    expect(getProviderErrorMessage({ title: 'Titill', summary: 'Nánar' })).toBe(
      'Nánar',
    )
    expect(getProviderErrorMessage({ title: 'Titill' })).toBe('Titill')
  })

  // Shape 3: ProviderErrorReason[] — a plain join would yield "[object Object]".
  it('unwraps an array of reason objects rather than stringifying them', () => {
    expect(
      getProviderErrorMessage([
        { title: 'A', summary: 'Fyrri' },
        { title: 'B', summary: 'Seinni' },
      ]),
    ).toBe('Fyrri, Seinni')
  })

  it('handles an array of plain strings', () => {
    expect(getProviderErrorMessage(['Fyrri', 'Seinni'])).toBe('Fyrri, Seinni')
  })

  // An empty join would render an empty alert instead of the generic fallback.
  it('treats an empty array as absent', () => {
    expect(getProviderErrorMessage([])).toBeUndefined()
  })

  it('treats a whitespace-only reason as absent', () => {
    expect(getProviderErrorMessage('   ')).toBeUndefined()
    expect(getProviderErrorMessage({ summary: '  ' })).toBeUndefined()
  })

  // title/summary are StaticText, so they can be MessageDescriptor objects when
  // the provider did not localize. Rendering one as a React child throws.
  it('drops a non-localized MessageDescriptor rather than returning an object', () => {
    expect(
      getProviderErrorMessage({
        summary: { id: 'some.id', defaultMessage: 'Hi' },
      }),
    ).toBeUndefined()
  })

  it('keeps usable entries when an array is partly unusable', () => {
    expect(
      getProviderErrorMessage([{ summary: 'Gilt' }, { summary: { id: 'x' } }]),
    ).toBe('Gilt')
  })
})

describe('overBenchmarkMessage pluralisation', () => {
  // Formatted through react-intl rather than intl-messageformat directly:
  // react-intl is the declared dependency and is what renders these at runtime.
  //
  // defaultLocale matters and is not optional here — react-intl formats a
  // defaultMessage fallback with defaultLocale, not locale, so omitting it
  // silently applies English plural rules. Production sets both to 'is'
  // (LocaleContext passes defaultLanguage to IntlProvider).
  const intl = createIntl({
    locale: 'is',
    defaultLocale: 'is',
    messages: {},
    onError: () => undefined,
  })

  const format = (count: number) =>
    intl.formatMessage(messages.salaryAnalysis.results.overBenchmarkMessage, {
      benchmark: '4,2',
      count,
    }) as string

  it('uses the singular noun form for one employee', () => {
    expect(format(1)).toContain('1 starfsmaður ber muninn')
  })

  it('uses the plural noun form for two', () => {
    expect(format(2)).toContain('2 starfsmenn bera muninn')
  })

  // Icelandic CLDR puts 21 in the `one` category, and the singular noun is
  // indeed correct there ("tuttugu og einn starfsmaður").
  it('follows Icelandic plural rules at 21', () => {
    expect(format(21)).toContain('21 starfsmaður ber muninn')
  })
})
