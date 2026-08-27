import { Editor } from '@tiptap/core'

import { buildEditorExtensions } from './richTextEditorExtensions'

// The schema is the paste whitelist: whatever it cannot represent is dropped
// at parse time and can never be serialized towards the API. These tests
// round-trip HTML through a headless editor to pin that behavior down.
const roundTrip = (html: string): string => {
  const editor = new Editor({
    extensions: buildEditorExtensions(''),
    content: html,
  })
  const result = editor.getHTML()
  editor.destroy()
  return result
}

describe('rich text editor schema', () => {
  describe('representable content survives', () => {
    it('keeps paragraphs, bold and italic', () => {
      expect(roundTrip('<p>a <strong>b</strong> <em>c</em></p>')).toBe(
        '<p>a <strong>b</strong> <em>c</em></p>',
      )
    })

    it('normalizes b/i tags to strong/em', () => {
      expect(roundTrip('<p><b>a</b> <i>b</i></p>')).toBe(
        '<p><strong>a</strong> <em>b</em></p>',
      )
    })

    it('keeps highlight classes', () => {
      expect(roundTrip('<p><span class="hl-ffff00">x</span></p>')).toBe(
        '<p><span class="hl-ffff00">x</span></p>',
      )
    })

    it('keeps indent classes on paragraphs', () => {
      expect(roundTrip('<p class="indent-2">x</p>')).toBe(
        '<p class="indent-2">x</p>',
      )
    })

    it('keeps lists, including marker-none wrapper items', () => {
      expect(
        roundTrip(
          '<ul><li><p>a</p></li><li class="marker-none"><ul><li><p>b</p></li></ul></li></ul>',
        ),
      ).toBe(
        '<ul><li><p>a</p></li><li class="marker-none"><ul><li><p>b</p></li></ul></li></ul>',
      )
    })

    it('wraps legacy inline list-item content in paragraphs', () => {
      // Content saved by the previous editor holds item text directly in the
      // li; the schema re-serializes it paragraph-wrapped, which the PDF
      // renderer handles identically.
      expect(roundTrip('<ul><li>a</li><li>b</li></ul>')).toBe(
        '<ul><li><p>a</p></li><li><p>b</p></li></ul>',
      )
    })

    it('keeps hard breaks', () => {
      expect(roundTrip('<p>a<br>b</p>')).toBe('<p>a<br>b</p>')
    })
  })

  describe('foreign content is dropped or unwrapped', () => {
    it('drops style attributes', () => {
      expect(roundTrip('<p style="margin-left:40px">x</p>')).toBe('<p>x</p>')
      expect(roundTrip('<p><span style="background:yellow">x</span></p>')).toBe(
        '<p>x</p>',
      )
    })

    it('drops unknown classes', () => {
      expect(roundTrip('<p class="MsoNormal">x</p>')).toBe('<p>x</p>')
      expect(roundTrip('<p><span class="weird">x</span></p>')).toBe('<p>x</p>')
    })

    it('unwraps headings, links and other unsupported elements', () => {
      expect(roundTrip('<h1>x</h1>')).toBe('<p>x</p>')
      expect(roundTrip('<p><a href="https://example.com">x</a></p>')).toBe(
        '<p>x</p>',
      )
      expect(roundTrip('<blockquote><p>x</p></blockquote>')).toBe('<p>x</p>')
    })

    it('drops images entirely', () => {
      expect(roundTrip('<p>a<img src="x.png" alt="">b</p>')).toBe('<p>ab</p>')
    })

    it('keeps table text but no table markup', () => {
      const result = roundTrip('<table><tr><td>a</td><td>b</td></tr></table>')
      expect(result).toContain('a')
      expect(result).toContain('b')
      expect(result).not.toContain('<table')
      expect(result).not.toContain('<td')
    })

    it('never serializes a style attribute, whatever comes in', () => {
      const hostile =
        '<div style="color:red"><p style="margin:1em">' +
        '<span style="background:yellow" class="hl-ffff00">a</span>' +
        '<iframe src="https://example.com"></iframe></p></div>'
      expect(roundTrip(hostile)).not.toContain('style=')
    })
  })
})
