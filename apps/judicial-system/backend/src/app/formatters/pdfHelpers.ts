export const baseFontSize = 11
export const mediumFontSize = 14
export const mediumPlusFontSize = 16
export const largeFontSize = 18
export const hugeFontSize = 26

export function setPageNumbers(doc: PDFKit.PDFDocument) {
  const pages = doc.bufferedPageRange()
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i)

    // Set aside the margins and reset to ensure proper alignment
    const oldMargins = doc.page.margins
    doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 }
    doc.text(`${i + 1}`, 0, doc.page.height - (oldMargins.bottom * 2) / 3, {
      align: 'center',
    })

    // Reset margins
    doc.page.margins = oldMargins
  }
}
