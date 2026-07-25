import { sanitizeRichTextHtml } from './sanitizeRichTextHtml'

describe('sanitizeRichTextHtml', () => {
  it('should strip script tags', () => {
    const result = sanitizeRichTextHtml(
      '<p>Hello</p><script>alert("xss")</script>',
    )

    expect(result).toBe('<p>Hello</p>')
  })

  it('should preserve allowed formatting tags', () => {
    const result = sanitizeRichTextHtml(
      '<p><strong>Bold</strong> <span style="background-color:#ffff00">highlight</span></p>',
    )

    expect(result).toBe(
      '<p><strong>Bold</strong> <span style="background-color:#ffff00">highlight</span></p>',
    )
  })

  it('should preserve paragraph indentation', () => {
    const result = sanitizeRichTextHtml(
      '<p style="padding-left:40px">Indented</p>',
    )

    expect(result).toBe('<p style="padding-left:40px">Indented</p>')
  })
})
