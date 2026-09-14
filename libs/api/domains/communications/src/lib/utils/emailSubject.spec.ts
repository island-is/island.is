import { Form } from '@island.is/cms'

import { injectFormFieldValuesIntoEmailSubject } from './emailSubject'

const form = {
  id: 'form-id',
  title: 'Test form',
  fields: [
    { id: 'abc123', title: 'Nafn stofnunar', name: 'institution' },
    { id: 'def456', title: 'Tegund erindis', name: '' },
  ],
} as Form

describe('injectFormFieldValuesIntoEmailSubject', () => {
  it('should replace a field token with the value the user entered', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject('[abc123] - Nýtt erindi', form, [
        { id: 'abc123', value: 'Reykjavíkurborg' },
      ]),
    ).toBe('Reykjavíkurborg - Nýtt erindi')
  })

  it('should replace multiple field tokens', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject('[abc123] - [def456]', form, [
        { id: 'abc123', value: 'Reykjavíkurborg' },
        { id: 'def456', value: 'Fyrirspurn' },
      ]),
    ).toBe('Reykjavíkurborg - Fyrirspurn')
  })

  it('should allow fields to be referenced by name', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject(
        '[institution] - Nýtt erindi',
        form,
        [{ id: 'abc123', value: 'Reykjavíkurborg' }],
      ),
    ).toBe('Reykjavíkurborg - Nýtt erindi')
  })

  it('should not allow fields to be referenced by title', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject(
        '[Nafn stofnunar] - Nýtt erindi',
        form,
        [{ id: 'abc123', value: 'Reykjavíkurborg' }],
      ),
    ).toBe('[Nafn stofnunar] - Nýtt erindi')
  })

  it('should ignore casing and whitespace around the token', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject('[ ABC123 ] - Nýtt erindi', form, [
        { id: 'abc123', value: 'Reykjavíkurborg' },
      ]),
    ).toBe('Reykjavíkurborg - Nýtt erindi')
  })

  it('should leave unknown tokens untouched', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject('[typo] - Nýtt erindi', form, [
        { id: 'abc123', value: 'Reykjavíkurborg' },
      ]),
    ).toBe('[typo] - Nýtt erindi')
  })

  it('should handle fields that the user left blank', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject('[abc123] - Nýtt erindi', form, [
        { id: 'abc123', value: '' },
      ]),
    ).toBe('- Nýtt erindi')
  })

  it('should strip newlines from injected values', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject('[abc123]', form, [
        { id: 'abc123', value: 'Reykjavíkurborg\nBcc: attacker@example.com' },
      ]),
    ).toBe('Reykjavíkurborg Bcc: attacker@example.com')
  })

  it('should truncate long injected values', () => {
    const value = 'a'.repeat(150)
    expect(
      injectFormFieldValuesIntoEmailSubject('[abc123]', form, [
        { id: 'abc123', value },
      ]),
    ).toBe('a'.repeat(100))
  })

  it('should ignore values for fields that do not belong to the form', () => {
    expect(
      injectFormFieldValuesIntoEmailSubject('[other] - Nýtt erindi', form, [
        { id: 'other', value: 'Reykjavíkurborg' },
      ]),
    ).toBe('[other] - Nýtt erindi')
  })

  it('should return the subject as is when no field values are sent', () => {
    expect(injectFormFieldValuesIntoEmailSubject('Nýtt erindi', form)).toBe(
      'Nýtt erindi',
    )
  })
})
