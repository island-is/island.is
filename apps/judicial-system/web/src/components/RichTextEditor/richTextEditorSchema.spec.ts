import { Editor } from '@tiptap/core'

import { buildEditorExtensions } from './richTextEditorExtensions'
import { normalizeRichTextHtml } from './richTextNormalization'

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
  it('serializes an empty document as markup that normalizes to an empty string', () => {
    const editor = new Editor({
      extensions: buildEditorExtensions(''),
      content: '',
    })
    const html = editor.getHTML()
    editor.destroy()
    expect(html).toMatch(/<p/)
    expect(normalizeRichTextHtml(html)).toBe('')
  })

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

    it('keeps minimal table markup', () => {
      const table =
        '<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr>' +
        '<tr><td><p>c</p></td><td><p>d</p></td></tr></tbody></table>'
      expect(roundTrip(table)).toBe(table)
    })

    it('keeps marks and paragraph structure inside cells', () => {
      const table =
        '<table><tbody><tr><td><p><strong>a</strong></p>' +
        '<p class="indent-1"><span class="hl-ffff00">b</span></p></td>' +
        '</tr></tbody></table>'
      expect(roundTrip(table)).toBe(table)
    })

    it('keeps lists inside cells', () => {
      const table =
        '<table><tbody><tr><td>' +
        '<ul><li><p>a</p></li><li><p>b</p></li></ul>' +
        '</td></tr></tbody></table>'
      expect(roundTrip(table)).toBe(table)
    })

    it('backfills an empty cell with an empty paragraph', () => {
      expect(
        roundTrip('<table><tbody><tr><td></td></tr></tbody></table>'),
      ).toBe('<table><tbody><tr><td><p></p></td></tr></tbody></table>')
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

    it('reduces stock-Tiptap table output to the minimal markup', () => {
      // What the unmodified table extension would serialize: a styled table,
      // a styled colgroup and cells carrying width/span/align attributes.
      // None of it may survive — the WAF rejects any style attribute.
      const result = roundTrip(
        '<table style="min-width: 50px"><colgroup><col style="width: 100px">' +
          '<col style="min-width: 25px"></colgroup><tbody><tr>' +
          '<td colspan="1" rowspan="1" colwidth="100" align="right"><p>a</p></td>' +
          '<td colspan="1" rowspan="1"><p>b</p></td></tr></tbody></table>',
      )
      expect(result).toBe(
        '<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr></tbody></table>',
      )
    })

    it('parses th as a plain cell', () => {
      expect(
        roundTrip(
          '<table><thead><tr><th>a</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table>',
        ),
      ).toBe(
        '<table><tbody><tr><td><p>a</p></td></tr><tr><td><p>b</p></td></tr></tbody></table>',
      )
    })

    it('hoists a nested table out behind its host table', () => {
      // The cell content expression cannot hold a table, so the parser moves
      // the inner one out behind its host instead of dropping it. The paste
      // and load normalization flattens nested tables before they reach the
      // parser, so this only pins the schema's own fallback.
      expect(
        roundTrip(
          '<table><tbody><tr><td><p>outer</p>' +
            '<table><tbody><tr><td><p>inner</p></td></tr></tbody></table>' +
            '</td></tr></tbody></table>',
        ),
      ).toBe(
        '<table><tbody><tr><td><p>outer</p></td></tr></tbody></table>' +
          '<table><tbody><tr><td><p>inner</p></td></tr></tbody></table>',
      )
    })

    it('never serializes a style attribute, whatever comes in', () => {
      const hostile =
        '<div style="color:red"><p style="margin:1em">' +
        '<span style="background:yellow" class="hl-ffff00">a</span>' +
        '<iframe src="https://example.com"></iframe></p></div>' +
        '<table style="width:50px;border:1px solid red" width="50" bgcolor="red">' +
        '<tr><td style="text-align:right" align="right" valign="top">x</td></tr></table>'
      const result = roundTrip(hostile)
      expect(result).not.toContain('style=')
      expect(result).not.toContain('align')
      expect(result).not.toContain('width')
    })
  })
})
