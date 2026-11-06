import { buildEqualityContentBody } from './equalityContent'

const base64 = (value: string) => Buffer.from(value).toString('base64')
const decode = (value?: string) =>
  Buffer.from(value ?? '', 'base64').toString('utf-8')

/**
 * A PDF whose bytes do NOT survive a UTF-8 round trip.
 *
 * The header is ASCII on purpose — that is what makes the corruption dangerous.
 * `%PDF-` passes through `toString('utf-8')` unharmed, so DMR's signature check
 * still succeeds on a file whose body has been destroyed, and nothing fails
 * until the document is merged into an approval.
 */
const REAL_PDF_BYTES = Buffer.concat([
  Buffer.from('%PDF-1.7\n', 'ascii'),
  Buffer.from([0x80, 0x81, 0xfe, 0xff, 0x00, 0x9d, 0xc0, 0xee]),
])

describe('buildEqualityContentBody', () => {
  describe('HTML content', () => {
    it('strips markup that sanitize-html does not allow', () => {
      const body = buildEqualityContentBody({
        equalityReportContent: base64('<p>Áætlun</p><script>alert(1)</script>'),
      })

      const html = decode(body.equalityReportContent)

      expect(html).toContain('Áætlun')
      expect(html).not.toContain('<script>')
    })

    it('strips a javascript: href, which mammoth passes straight through', () => {
      const body = buildEqualityContentBody({
        equalityReportContent: base64(
          '<a href="javascript:alert(1)">smella</a>',
        ),
      })

      expect(decode(body.equalityReportContent)).not.toContain('javascript:')
    })

    it('leaves an absent value absent rather than sanitising undefined', () => {
      expect(buildEqualityContentBody({})).toEqual({
        equalityReportContent: undefined,
      })
    })
  })

  describe('PDF content', () => {
    /**
     * ⚠️ The reason this file exists. Routing a PDF through the HTML
     * sanitiser's `toString('utf-8')` replaces every non-UTF-8 byte with
     * U+FFFD and returns a same-shaped, entirely corrupt file.
     */
    it('forwards the base64 byte-for-byte, unsanitised', () => {
      const pdfBase64 = REAL_PDF_BYTES.toString('base64')

      const body = buildEqualityContentBody({
        equalityReportPdf: pdfBase64,
        equalityReportPdfFilename: 'aaetlun.pdf',
      })

      expect(body.equalityReportPdf).toBe(pdfBase64)
      expect(
        Buffer.from(body.equalityReportPdf ?? '', 'base64').equals(
          REAL_PDF_BYTES,
        ),
      ).toBe(true)
    })

    it('carries the filename, which DMR requires alongside a PDF', () => {
      const body = buildEqualityContentBody({
        equalityReportPdf: REAL_PDF_BYTES.toString('base64'),
        equalityReportPdfFilename: 'aaetlun.pdf',
      })

      expect(body.equalityReportPdfFilename).toBe('aaetlun.pdf')
    })

    it('never sends both kinds at once', () => {
      // DMR rejects both-at-once. If the client somehow sends both, the PDF
      // wins here rather than producing a body that is guaranteed to 400.
      const body = buildEqualityContentBody({
        equalityReportContent: base64('<p>Áætlun</p>'),
        equalityReportPdf: REAL_PDF_BYTES.toString('base64'),
        equalityReportPdfFilename: 'aaetlun.pdf',
      })

      expect(body.equalityReportPdf).toBeDefined()
      expect(body.equalityReportContent).toBeUndefined()
    })

    /**
     * Guards the branch itself rather than its output: were the PDF ever routed
     * through the sanitiser, this is the assertion that would fail, and it
     * fails loudly instead of shipping a corrupt file.
     */
    it('does not mangle bytes the way a UTF-8 round trip would', () => {
      const pdfBase64 = REAL_PDF_BYTES.toString('base64')
      const mangled = Buffer.from(
        Buffer.from(pdfBase64, 'base64').toString('utf-8'),
      ).toString('base64')

      // The round trip really is destructive for these bytes — otherwise this
      // whole test would pass for the wrong reason.
      expect(mangled).not.toBe(pdfBase64)

      const body = buildEqualityContentBody({
        equalityReportPdf: pdfBase64,
        equalityReportPdfFilename: 'aaetlun.pdf',
      })

      expect(body.equalityReportPdf).not.toBe(mangled)
    })
  })
})
