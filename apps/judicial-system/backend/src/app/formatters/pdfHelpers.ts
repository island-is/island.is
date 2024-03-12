import { coatOfArms } from './coatOfArms'
import { policeStar } from './policeStar'

export const smallFontSize = 9
export const baseFontSize = 11
export const basePlusFontSize = 12
export const mediumFontSize = 14
export const mediumPlusFontSize = 16
export const largeFontSize = 18
export const hugeFontSize = 26
export const giganticFontSize = 33

const setFont = (doc: PDFKit.PDFDocument, font?: string) => {
  if (font) {
    doc.font(font)
  }
}

const addCenteredText = (
  doc: PDFKit.PDFDocument,
  fontSise: number,
  heading: string,
  font?: string,
) => {
  setFont(doc, font)

  doc.fontSize(fontSise).text(heading, { align: 'center', paragraphGap: 1 })
}

const addText = (
  doc: PDFKit.PDFDocument,
  fontSise: number,
  text: string,
  font?: string,
  continued = false,
) => {
  setFont(doc, font)

  doc.fontSize(fontSise).text(text, { continued, paragraphGap: 1 })
}

const addJustifiedText = (
  doc: PDFKit.PDFDocument,
  fontSise: number,
  text: string,
  font?: string,
) => {
  setFont(doc, font)

  doc.fontSize(fontSise).text(text, { align: 'justify', paragraphGap: 1 })
}

export const setTitle = (doc: PDFKit.PDFDocument, title: string) => {
  if (doc.info) {
    doc.info['Title'] = title
  }
}

export const addFooter = (doc: PDFKit.PDFDocument, smallPrint?: string) => {
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

export const addCoatOfArms = (
  doc: PDFKit.PDFDocument,
  x?: number,
  y?: number,
) => {
  doc.translate(x ?? 270, y ?? 70).scale(0.5)

  coatOfArms(doc)

  doc
    .fillColor('black')
    .scale(2)
    .translate(x ? -x : -270, y ? -y : -70)
}

export const addPoliceStar = (doc: PDFKit.PDFDocument) => {
  doc.translate(270, 70).scale(0.04)

  doc.image(policeStar, 0, 0, { fit: [1350, 1350] })

  doc.scale(25).translate(-270, -70)
}

export const setLineGap = (doc: PDFKit.PDFDocument, lineGap: number) => {
  doc.lineGap(lineGap)
}

export const drawTextWithEllipsis = (
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) => {
  const ellipsis = '...'
  let width = doc.widthOfString(text)
  if (width <= maxWidth) {
    doc.text(text, x, y)
  } else {
    while (width > maxWidth - doc.widthOfString(ellipsis)) {
      text = text.slice(0, -1)
      width = doc.widthOfString(text)
    }
    doc.text(text + ellipsis, x, y)
  }
}

export const addEmptyLines = (
  doc: PDFKit.PDFDocument,
  lines = 1,
  x?: number,
) => {
  for (let i = 0; i < lines; i++) {
    doc.text(' ', x)
  }
}

export const addGiganticHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addCenteredText(doc, giganticFontSize, heading, font)
}

export const addHugeHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addCenteredText(doc, hugeFontSize, heading, font)
}

export const addLargeHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addCenteredText(doc, largeFontSize, heading, font)
}

export const addMediumPlusHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addCenteredText(doc, mediumPlusFontSize, heading, font)
}

export const addMediumHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addCenteredText(doc, mediumFontSize, heading, font)
}

export const addLargeText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addText(doc, largeFontSize, text, font)
}

export const addMediumText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addText(doc, mediumFontSize, text, font)
}

export const addNormalPlusText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
  continued?: boolean,
) => {
  addText(doc, basePlusFontSize, text, font, continued)
}

export const addNormalPlusCenteredText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addCenteredText(doc, basePlusFontSize, text, font)
}

export const addNormalText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
  continued?: boolean,
) => {
  addText(doc, baseFontSize, text, font, continued)
}

export const addNormalJustifiedText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addJustifiedText(doc, baseFontSize, text, font)
}

export const addNormalPlusJustifiedText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addJustifiedText(doc, basePlusFontSize, text, font)
}

export const addNormalCenteredText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addCenteredText(doc, baseFontSize, text, font)
}

export const addNumberedList = (
  doc: PDFKit.PDFDocument,
  list: string[],
  font?: string,
) => {
  setFont(doc, font)

  doc.fontSize(baseFontSize).list(list, {
    listType: 'numbered',
  })
}
