import { coatOfArms } from './coatOfArms'

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

export function addCoatOfArms(doc: PDFKit.PDFDocument) {
  doc.translate(270, 70).scale(0.5)

  coatOfArms(doc)

  doc.fillColor('black').scale(2).translate(-270, -70)
}

function addHeading(
  doc: PDFKit.PDFDocument,
  font: string,
  fontSise: number,
  heading: string,
) {
  doc.font(font).fontSize(fontSise).text(heading, { align: 'center' })
}

export function addHugeHeading(
  doc: PDFKit.PDFDocument,
  font: string,
  heading: string,
) {
  addHeading(doc, font, hugeFontSize, heading)
}

export function addLargeHeading(
  doc: PDFKit.PDFDocument,
  font: string,
  heading: string,
) {
  addHeading(doc, font, largeFontSize, heading)
}

export function addMediumHeading(
  doc: PDFKit.PDFDocument,
  font: string,
  heading: string,
) {
  addHeading(doc, font, mediumFontSize, heading)
}
