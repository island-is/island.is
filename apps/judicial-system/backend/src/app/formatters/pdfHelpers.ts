import { coatOfArms } from './coatOfArms'
import { policeStar } from './policeStar'

export const smallFontSize = 9
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

function addCenteredText(
  doc: PDFKit.PDFDocument,
  fontSise: number,
  heading: string,
  font?: string,
) {
  setFont(doc, font)

  doc.fontSize(fontSise).text(heading, { align: 'center', paragraphGap: 1 })
}

function addText(
  doc: PDFKit.PDFDocument,
  fontSise: number,
  text: string,
  font?: string,
  continued = false,
) {
  setFont(doc, font)

  doc.fontSize(fontSise).text(text, { continued, paragraphGap: 1 })
}

function addJustifiedText(
  doc: PDFKit.PDFDocument,
  fontSise: number,
  text: string,
  font?: string,
) {
  setFont(doc, font)

  doc.fontSize(fontSise).text(text, { align: 'justify', paragraphGap: 1 })
}

export function setTitle(doc: PDFKit.PDFDocument, title: string) {
  if (doc.info) {
    doc.info['Title'] = title
  }
}

export function addFooter(doc: PDFKit.PDFDocument, smallPrint?: string) {
  const pages = doc.bufferedPageRange()
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i)

    // Set aside the margins and reset to ensure proper alignment
    const oldMargins = doc.page.margins
    doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 }
    doc.text(`${i + 1}`, 0, doc.page.height - (oldMargins.bottom * 2) / 3, {
      align: 'center',
    })

    if (smallPrint) {
      doc
        .fontSize(smallFontSize)
        .text(smallPrint, 0, doc.page.height - (oldMargins.bottom * 5) / 12, {
          align: 'center',
        })
    }

    // Reset margins
    doc.page.margins = oldMargins
  }
}

export function addCoatOfArms(doc: PDFKit.PDFDocument) {
  doc.translate(270, 70).scale(0.5)

  coatOfArms(doc)

  doc.fillColor('black').scale(2).translate(-270, -70)
}

export function addPoliceStar(doc: PDFKit.PDFDocument) {
  doc.translate(270, 70).scale(0.04)

  doc.image(policeStar, 0, 0, { fit: [1350, 1350] })

  doc.scale(25).translate(-270, -70)
}

export function setLineGap(doc: PDFKit.PDFDocument, lineGap: number) {
  doc.lineGap(lineGap)
}

export function addEmptyLines(doc: PDFKit.PDFDocument, lines = 1) {
  for (let i = 0; i < lines; i++) {
    doc.text(' ')
  }
}

export function addHugeHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addCenteredText(doc, hugeFontSize, heading, font)
}

export function addLargeHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addCenteredText(doc, largeFontSize, heading, font)
}

export function addMediumPlusHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addCenteredText(doc, mediumPlusFontSize, heading, font)
}

export function addMediumHeading(
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) {
  addCenteredText(doc, mediumFontSize, heading, font)
}

export function addLargeText(
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) {
  addText(doc, largeFontSize, text, font)
}

export function addMediumText(
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) {
  addText(doc, mediumFontSize, text, font)
}

export function addNormalText(
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
  continued?: boolean,
) {
  addText(doc, baseFontSize, text, font, continued)
}

export function addNormalJustifiedText(
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) {
  addJustifiedText(doc, baseFontSize, text, font)
}

export function addNormalCenteredText(
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) {
  addCenteredText(doc, baseFontSize, text, font)
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
