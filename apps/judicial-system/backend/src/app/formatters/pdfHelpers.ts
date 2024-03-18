import { applyCase } from 'beygla'

import { formatDate } from '@island.is/judicial-system/formatters'

import { coatOfArms } from './coatOfArms'
import { policeStar } from './policeStar'
import { PDFFont, PDFPage } from 'pdf-lib'

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

export const addIndictmentConfirmation = (
  doc: PDFKit.PDFDocument,
  confirmedBy: string,
  institutionName: string,
  createdDate: Date,
) => {
  const lightGray = '#FAFAFA'
  const darkGray = '#CBCBCB'
  const gold = '#ADA373'
  const pageMargin = 24
  // The shaddow and content heights are the same
  const shaddowHeight = 88
  const coatOfArmsDimensions = 88
  const coatOfArmsX = pageMargin + 8
  const titleWidth = doc.page.width - 142
  const titleHeight = 32
  const titleX = coatOfArmsX + coatOfArmsDimensions + 8
  const confirmedByWidth = 160
  const institutionWidth = confirmedByWidth + 48

  // Draw the shaddow
  doc
    .rect(pageMargin, 32, doc.page.width - 2 * pageMargin - 8, shaddowHeight)
    .fill(lightGray)
    .stroke()

  // Draw the Coat of Arms
  doc
    // This box is a squere, therefore the width and height are the same
    .rect(coatOfArmsX, pageMargin, coatOfArmsDimensions, coatOfArmsDimensions)
    .fillAndStroke('white', darkGray)
  addCoatOfArms(doc, 48, 40)

  // Draw the confirmation title
  doc
    .rect(
      coatOfArmsX + coatOfArmsDimensions,
      pageMargin,
      titleWidth,
      titleHeight,
    )
    .fillAndStroke(lightGray, darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Réttarvörslugátt', titleX, 35)
  doc.font('Times-Roman')
  // The X value here is approx. 8px after the title
  doc.text('Skjal samþykkt rafrænt', 216, 35)
  doc
    .translate(doc.page.width - 40, 33)
    .path(
      'M0.763563 11.8047H7.57201C7.85402 11.8047 8.08264 11.5761 8.08264 11.2941V5.50692C8.08264 5.22492 7.85402 4.99629 7.57201 4.99629H7.06138V3.46439C7.06138 1.86887 5.76331 0.570801 4.16779 0.570801C2.57226 0.570801 1.2742 1.86887 1.2742 3.46439V4.99629H0.763563C0.481557 4.99629 0.25293 5.22492 0.25293 5.50692V11.2941C0.25293 11.5761 0.481557 11.8047 0.763563 11.8047ZM5.61394 8.03817L4.16714 9.48496C4.06743 9.58467 3.93674 9.63455 3.80609 9.63455C3.67543 9.63455 3.54471 9.58467 3.44504 9.48496L2.72164 8.76157C2.52222 8.56215 2.52222 8.23888 2.72164 8.03943C2.92102 7.84001 3.24436 7.84001 3.44378 8.03943L3.80612 8.40174L4.89187 7.31603C5.09125 7.11661 5.41458 7.11661 5.614 7.31603C5.81339 7.51549 5.81339 7.83875 5.61394 8.03817ZM2.29546 3.46439C2.29546 2.43199 3.13539 1.59207 4.16779 1.59207C5.20019 1.59207 6.04011 2.43199 6.04011 3.46439V4.99629H2.29546V3.46439Z',
    )
    .fillAndStroke(gold, gold)

  doc.translate(-(doc.page.width - 40), -33)

  // Draw the "Confirmed by" box
  doc
    .rect(
      coatOfArmsX + coatOfArmsDimensions,
      pageMargin + titleHeight,
      confirmedByWidth,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Samþykkt af', titleX, pageMargin + titleHeight + 16)
  doc.font('Times-Roman')
  drawTextWithEllipsis(
    doc,
    applyCase('þgf', confirmedBy),
    titleX,
    pageMargin + titleHeight + 32,
    confirmedByWidth - 16,
  )

  // Draw the "Institution" box
  doc
    .rect(
      coatOfArmsX + coatOfArmsDimensions + confirmedByWidth,
      pageMargin + titleHeight,
      institutionWidth,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Embætti', titleX + confirmedByWidth, pageMargin + titleHeight + 16)
  doc.font('Times-Roman')
  doc.text(
    institutionName,
    titleX + confirmedByWidth,
    pageMargin + titleHeight + 32,
  )

  // Draw the "Indictment date" box
  doc
    .rect(
      40 + 120 + (doc.page.width - doc.page.margins.left - 104 - 104) + 8,
      pageMargin + titleHeight,
      88,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text(
    'Útgáfa ákæru',
    40 + 104 + 16 + (doc.page.width - doc.page.margins.left - 104 - 104) + 16,
    24 + 32 + 16,
    { lineBreak: false },
  )
  doc.font('Times-Roman')
  doc.text(
    formatDate(createdDate, 'P') || '',
    40 + 104 + 16 + (doc.page.width - doc.page.margins.left - 104 - 104) + 32,
    24 + 32 + 32,
    {
      lineBreak: false,
    },
  )
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

export const drawTextWithEllipsisPDFKit = (
  doc: PDFPage,
  text: string,
  font: { type: PDFFont; size: number },
  x: number,
  y: number,
  maxWidth: number,
) => {
  const ellipsis = '...'
  let width = font.type.widthOfTextAtSize(text, font.size)
  if (width <= maxWidth) {
    doc.drawText(text, { x, y, font: font.type, size: font.size })
  } else {
    while (
      width >
      maxWidth - font.type.widthOfTextAtSize(ellipsis, font.size)
    ) {
      text = text.slice(0, -1)
      width = font.type.widthOfTextAtSize(text, font.size)
    }
    doc.drawText(text + ellipsis, {
      x,
      y,
      font: font.type,
      size: font.size,
    })
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
