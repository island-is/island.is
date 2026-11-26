import { toAssetFileName } from './sync-strategies'

describe('toAssetFileName', () => {
  it('keeps the plain file name when the URL has no query', () => {
    expect(toAssetFileName('https://a.is/files/umsokn.pdf')).toBe('umsokn.pdf')
  })

  it('gives query URLs on the same path distinct, stable names', () => {
    const first = toAssetFileName(
      'https://www.stjornartidindi.is/PdfVersions.aspx?recordID=1',
    )
    const second = toAssetFileName(
      'https://www.stjornartidindi.is/PdfVersions.aspx?recordID=2',
    )

    expect(first).toMatch(/^PdfVersions-[0-9a-f]{10}\.pdf$/)
    expect(first).not.toBe(second)
    expect(
      toAssetFileName(
        'https://www.stjornartidindi.is/PdfVersions.aspx?recordID=1',
      ),
    ).toBe(first)
  })

  it('keeps a known original extension on query URLs', () => {
    expect(
      toAssetFileName('https://a.is/files/umsokn.docx?v=2', 'pdf', ['docx']),
    ).toMatch(/^umsokn-[0-9a-f]{10}\.docx$/)
  })
})
