import { coatOfArms } from './coatOfArms'

export const baseFontSize = 11
export const mediumFontSize = 14
export const mediumPlusFontSize = 16
export const largeFontSize = 18
export const hugeFontSize = 26

function setFont(doc: PDFKit.PDFDocument, font?: string) {
  if (font) {
    doc.font(font)
  }
}

function addHeading(
  doc: PDFKit.PDFDocument,
  fontSise: number,
  heading: string,
  font?: string,
) {
  setFont(doc, font)

  doc.fontSize(fontSise).text(heading, { align: 'center' })
}

export function setTitle(doc: PDFKit.PDFDocument, title: string) {
  if (doc.info) {
    doc.info['Title'] = title
  }
}

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

export function setLineGap(doc: PDFKit.PDFDocument, lineGap: number) {
  doc.lineGap(lineGap)
}

export function addHugeHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addHeading(doc, hugeFontSize, heading, font)
}

export function addLargeHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addHeading(doc, largeFontSize, heading, font)
}

export function addMediumPlusHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addHeading(doc, mediumPlusFontSize, heading, font)
}

export function addMediumHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addHeading(doc, mediumFontSize, heading, font)
}

export function addNumberedList(
  doc: PDFKit.PDFDocument,
  list: string[],
  font?: string,
) {
  setFont(doc, font)

  doc.fontSize(baseFontSize).list(list, {
    listType: 'numbered',
  })
}
