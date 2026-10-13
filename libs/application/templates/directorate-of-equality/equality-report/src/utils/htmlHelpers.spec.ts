import { decodeHtmlEntities, escapeHtml, htmlToPlainText } from './htmlHelpers'

describe('escapeHtml', () => {
  it('escapes every character that could open a tag or attribute', () => {
    expect(escapeHtml(`<a href="x">O'Brien & co</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;O&#39;Brien &amp; co&lt;/a&gt;',
    )
  })
})

describe('decodeHtmlEntities', () => {
  it('decodes named, decimal and hex entities', () => {
    // nbsp decodes to U+00A0, not a plain space.
    expect(decodeHtmlEntities('a&amp;b&#39;c&#xE1;d&NBSP;e')).toBe(
      "a&b'cád\u00a0e",
    )
  })

  it('leaves unknown named entities untouched', () => {
    expect(decodeHtmlEntities('5&nbsp;&euro;')).toBe('5\u00a0&euro;')
  })

  it('leaves out-of-range and surrogate code points untouched', () => {
    expect(decodeHtmlEntities('&#x110000;')).toBe('&#x110000;')
    expect(decodeHtmlEntities('&#xD800;')).toBe('&#xD800;')
    expect(decodeHtmlEntities('&#99999999999999999999;')).toBe(
      '&#99999999999999999999;',
    )
  })
})

describe('htmlToPlainText', () => {
  it('drops tags, decodes entities and trims', () => {
    expect(htmlToPlainText('<p> Jafnr&#xE9;tti &amp; co </p>')).toBe(
      'Jafnrétti & co',
    )
  })

  it('reports an empty body for markup that carries no text', () => {
    expect(htmlToPlainText('<p><br/></p>')).toBe('')
  })

  it('does not throw on an invalid numeric entity', () => {
    expect(() => htmlToPlainText('<p>&#x110000;</p>')).not.toThrow()
  })
})
