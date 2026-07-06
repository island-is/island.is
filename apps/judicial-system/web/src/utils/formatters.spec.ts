import { containsHtml, textToHtml } from './formatters'

describe('containsHtml', () => {
  test('should detect html content', () => {
    expect(containsHtml('<p>fyrir umferðarlagabrot</p>')).toBe(true)
    expect(containsHtml('bla <strong>bla</strong> bla')).toBe(true)
    expect(containsHtml('bla<br />bla')).toBe(true)
  })

  test('should not detect plain text as html', () => {
    expect(containsHtml('fyrir umferðarlagabrot með því að hafa ekið')).toBe(
      false,
    )
    expect(containsHtml('mældur hraði < 90 km/klst')).toBe(false)
    expect(containsHtml('')).toBe(false)
  })
})

describe('textToHtml', () => {
  test('should wrap plain text in a paragraph', () => {
    expect(textToHtml('fyrir umferðarlagabrot')).toBe(
      '<p>fyrir umferðarlagabrot</p>',
    )
  })

  test('should convert each line to a paragraph', () => {
    expect(textToHtml('fyrsta línan\nönnur línan')).toBe(
      '<p>fyrsta línan</p><p>önnur línan</p>',
    )
  })

  test('should escape html special characters in plain text', () => {
    expect(textToHtml('hraði < 90 km/klst & meira')).toBe(
      '<p>hraði &lt; 90 km/klst &amp; meira</p>',
    )
  })

  test('should pass rich text through unchanged', () => {
    const html = '<p>fyrir <strong>umferðarlagabrot</strong></p>'

    expect(textToHtml(html)).toBe(html)
  })

  test('should pass an empty string through unchanged', () => {
    expect(textToHtml('')).toBe('')
  })
})
