import { PDFFont, PDFPage } from 'pdf-lib'

import { formatDate, lowercase } from '@island.is/judicial-system/formatters'

import { coatOfArms } from './coatOfArms'
import { policeStar } from './policeStar'

export interface Confirmation {
  actor: string
  title?: string
  institution: string
  date: Date
}

export const calculatePt = (px: number) => Math.ceil(px * 0.74999943307122)
export const smallFontSize = 9
export const baseFontSize = 11
export const basePlusFontSize = 12
export const mediumFontSize = 14
export const mediumPlusFontSize = 16
export const largeFontSize = 18
export const hugeFontSize = 26
export const giganticFontSize = 33

const lightGray = '#FAFAFA'
const darkGray = '#CBCBCB'
const gold = '#ADA373'

const setFont = (doc: PDFKit.PDFDocument, font?: string) => {
  if (font) {
    doc.font(font)
  }
}

const addAlignedText = (
  doc: PDFKit.PDFDocument,
  fontSize: number,
  heading: string,
  alignment: 'center' | 'left' | 'right' | 'justify',
  font?: string,
) => {
  setFont(doc, font)

  doc.fontSize(fontSize).text(heading, { align: alignment, paragraphGap: 1 })
}

const addText = (
  doc: PDFKit.PDFDocument,
  fontSize: number,
  text: string,
  font?: string,
  continued = false,
) => {
  setFont(doc, font)

  doc.fontSize(fontSize).text(text, { continued, paragraphGap: 1 })
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
  doc.translate(x ?? 270, y ?? 70).scale(0.4)

  coatOfArms(doc)

  doc
    .fillColor('black')
    .scale(2.5)
    .translate(x ? -x : -270, y ? -y : -70)
}

export const addPoliceStar = (doc: PDFKit.PDFDocument) => {
  doc.translate(270, 70).scale(0.04)

  doc.image(policeStar, 0, 0, { fit: [1350, 1350] })

  doc.scale(25).translate(-270, -70)
}

export const addConfirmation = (
  doc: PDFKit.PDFDocument,
  confirmation: Confirmation,
) => {
  const pageMargin = calculatePt(18)
  const shaddowHeight = calculatePt(70)
  const coatOfArmsWidth = calculatePt(105)
  const coatOfArmsX = pageMargin + calculatePt(8)
  const titleHeight = calculatePt(24)
  const titleX = coatOfArmsX + coatOfArmsWidth + calculatePt(8)
  const institutionWidth = calculatePt(297)
  const confirmedByWidth = institutionWidth + calculatePt(48)
  const shaddowWidth = institutionWidth + confirmedByWidth + coatOfArmsWidth
  const titleWidth = institutionWidth + confirmedByWidth

  // Draw the shadow
  doc
    .rect(pageMargin, pageMargin + calculatePt(8), shaddowWidth, shaddowHeight)
    .fill(lightGray)
    .stroke()

  // Draw the coat of arms
  doc
    .rect(coatOfArmsX, pageMargin, coatOfArmsWidth, shaddowHeight)
    .fillAndStroke('white', darkGray)

  addCoatOfArms(doc, calculatePt(49), calculatePt(24))

  // Draw the title
  doc
    .rect(coatOfArmsX + coatOfArmsWidth, pageMargin, titleWidth, titleHeight)
    .fillAndStroke(lightGray, darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc
    .fontSize(calculatePt(smallFontSize))
    .text('Réttarvörslugátt', titleX, pageMargin + calculatePt(9))
  doc.font('Times-Roman')
  // The X value here is approx. 8px after the title
  doc.text('Rafræn staðfesting', calculatePt(210), pageMargin + calculatePt(9))
  doc.text(
    formatDate(confirmation.date) ?? '',
    0,
    pageMargin + calculatePt(9),
    {
      align: 'right',
      width: 575,
    },
  )
  doc.moveDown(0)

  // Draw the institution
  doc
    .rect(
      coatOfArmsX + coatOfArmsWidth,
      pageMargin + titleHeight,
      institutionWidth,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Dómstóll', titleX, pageMargin + titleHeight + calculatePt(10))
  doc.font('Times-Roman')
  drawTextWithEllipsis(
    doc,
    confirmation.institution,
    titleX,
    pageMargin + titleHeight + calculatePt(22),
    institutionWidth - calculatePt(16),
  )

  // Draw the actor
  doc
    .rect(
      coatOfArmsX + coatOfArmsWidth + institutionWidth,
      pageMargin + titleHeight,
      confirmedByWidth,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text(
    'Samþykktaraðili',
    titleX + institutionWidth,
    pageMargin + titleHeight + calculatePt(10),
  )
  doc.font('Times-Roman')
  doc.text(
    `${confirmation.actor}${
      confirmation.title ? `, ${lowercase(confirmation.title)}` : ''
    }`,
    titleX + institutionWidth,
    pageMargin + titleHeight + calculatePt(22),
  )

  doc.fillColor('black')
}

export const addIndictmentConfirmation = (
  doc: PDFKit.PDFDocument,
  confirmation: Confirmation,
) => {
  const pageMargin = calculatePt(18)
  const shaddowHeight = calculatePt(90)
  const coatOfArmsWidth = calculatePt(105)
  const coatOfArmsHeight = calculatePt(90)
  const coatOfArmsX = pageMargin + calculatePt(8)
  const titleWidth = 496 - pageMargin
  const titleHeight = calculatePt(32)
  const titleX = coatOfArmsX + coatOfArmsWidth + calculatePt(8)
  const confirmedByWidth = calculatePt(250)
  const institutionWidth = confirmedByWidth + calculatePt(48)

  // Draw the shaddow
  doc
    .rect(
      pageMargin,
      pageMargin + calculatePt(8),
      doc.page.width - calculatePt(8) - 2 * pageMargin,
      shaddowHeight,
    )
    .fill(lightGray)
    .stroke()

  // Draw the Coat of Arms
  doc
    .rect(coatOfArmsX, pageMargin, coatOfArmsWidth, coatOfArmsHeight)
    .fillAndStroke('white', darkGray)

  addCoatOfArms(doc, calculatePt(49), calculatePt(33))

  // Draw the confirmation title
  doc
    .rect(coatOfArmsX + coatOfArmsWidth, pageMargin, titleWidth, titleHeight)
    .fillAndStroke(lightGray, darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc
    .fontSize(calculatePt(smallFontSize))
    .text('Réttarvörslugátt', titleX, pageMargin + calculatePt(12))
  doc.font('Times-Roman')
  // The X value here is approx. 8px after the title
  doc.text(
    'Skjal samþykkt rafrænt',
    calculatePt(210),
    pageMargin + calculatePt(12),
  )
  doc
    .translate(
      coatOfArmsX + coatOfArmsWidth + titleWidth - calculatePt(24),
      pageMargin + calculatePt(8),
    )
    .path(
      'M2.76356 11.8047H9.57201C9.85402 11.8047 10.0826 11.5761 10.0826 11.2941V5.50692C10.0826 5.22492 9.85402 4.99629 9.57201 4.99629H9.06138V3.46439C9.06138 1.86887 7.76331 0.570801 6.16779 0.570801C4.57226 0.570801 3.2742 1.86887 3.2742 3.46439V4.99629H2.76356C2.48156 4.99629 2.25293 5.22492 2.25293 5.50692V11.2941C2.25293 11.5761 2.48156 11.8047 2.76356 11.8047ZM7.61394 8.03817L6.16714 9.48496C6.06743 9.58467 5.93674 9.63455 5.80609 9.63455C5.67543 9.63455 5.54471 9.58467 5.44504 9.48496L4.72164 8.76157C4.52222 8.56215 4.52222 8.23888 4.72164 8.03943C4.92102 7.84001 5.24436 7.84001 5.44378 8.03943L5.80612 8.40174L6.89187 7.31603C7.09125 7.11661 7.41458 7.11661 7.614 7.31603C7.81339 7.51549 7.81339 7.83875 7.61394 8.03817ZM4.29546 3.46439C4.29546 2.43199 5.13539 1.59207 6.16779 1.59207C7.20019 1.59207 8.04011 2.43199 8.04011 3.46439V4.99629H4.29546V3.46439Z',
    )
    .lineWidth(0.5)
    .fillAndStroke(gold, gold)

  doc
    .lineWidth(1)
    .translate(
      -(coatOfArmsX + coatOfArmsWidth + titleWidth - calculatePt(24)),
      -calculatePt(pageMargin + calculatePt(16)),
    )

  // Draw the "Confirmed by" box
  doc
    .rect(
      coatOfArmsX + coatOfArmsWidth,
      pageMargin + titleHeight,
      confirmedByWidth,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text(
    'Samþykktaraðili',
    titleX,
    pageMargin + titleHeight + calculatePt(16),
  )
  doc.font('Times-Roman')

  drawTextWithEllipsis(
    doc,
    `${confirmation.actor}${
      confirmation.title ? `, ${lowercase(confirmation.title)}` : ''
    }`,
    titleX,
    pageMargin + titleHeight + calculatePt(32),
    confirmedByWidth - calculatePt(16),
  )

  // Draw the "Institution" box
  doc
    .rect(
      coatOfArmsX + coatOfArmsWidth + confirmedByWidth,
      pageMargin + titleHeight,
      institutionWidth,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text(
    'Embætti',
    titleX + confirmedByWidth,
    pageMargin + titleHeight + calculatePt(16),
  )
  doc.font('Times-Roman')
  doc.text(
    confirmation.institution,
    titleX + confirmedByWidth,
    pageMargin + titleHeight + calculatePt(32),
  )

  // Draw the "Indictment date" box
  doc
    .rect(
      pageMargin + coatOfArmsWidth + confirmedByWidth + institutionWidth,
      pageMargin + titleHeight,
      76,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text(
    'Útgáfa ákæru',
    coatOfArmsX + coatOfArmsWidth + titleWidth - calculatePt(68),
    pageMargin + titleHeight + calculatePt(16),
    { lineBreak: false },
  )
  doc.font('Times-Roman')
  doc.text(
    formatDate(confirmation.date) ?? '',
    coatOfArmsX + coatOfArmsWidth + titleWidth - calculatePt(55),
    pageMargin + titleHeight + calculatePt(32),
    { lineBreak: false },
  )
}

export const addIndictmentCourtRecordConfirmation = (
  doc: PDFKit.PDFDocument,
  confirmation: Confirmation,
) => {
  const pageMargin = calculatePt(18)
  const shaddowHeight = calculatePt(90)
  const coatOfArmsWidth = calculatePt(105)
  const coatOfArmsHeight = calculatePt(90)
  const coatOfArmsX = pageMargin + calculatePt(8)
  const titleWidth = calculatePt(642)
  const titleHeight = calculatePt(32)
  const titleX = coatOfArmsX + coatOfArmsWidth + calculatePt(8)

  // Draw the shaddow
  doc
    .rect(
      pageMargin,
      pageMargin + calculatePt(8),
      coatOfArmsWidth + titleWidth,
      shaddowHeight,
    )
    .fill(lightGray)
    .stroke()

  // Draw the Coat of Arms
  doc
    .rect(coatOfArmsX, pageMargin, coatOfArmsWidth, coatOfArmsHeight)
    .fillAndStroke('white', darkGray)

  addCoatOfArms(doc, calculatePt(49), calculatePt(33))

  // Draw the confirmation title
  doc
    .rect(coatOfArmsX + coatOfArmsWidth, pageMargin, titleWidth, titleHeight)
    .fillAndStroke(lightGray, darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc
    .fontSize(calculatePt(smallFontSize))
    .text('Réttarvörslugátt', titleX, pageMargin + calculatePt(12))
  doc.font('Times-Roman')
  doc.text(
    'Rafræn staðfesting',
    calculatePt(210),
    pageMargin + calculatePt(12),
    { lineBreak: false },
  )

  const date = formatDate(confirmation.date) ?? ''
  const dateWidth = doc.widthOfString(date)

  doc.text(
    date,
    coatOfArmsX + coatOfArmsWidth + titleWidth - dateWidth - calculatePt(8),
  )

  doc.lineWidth(1)

  // Draw the "Institution" box
  doc
    .rect(
      coatOfArmsX + coatOfArmsWidth,
      pageMargin + titleHeight,
      titleWidth,
      shaddowHeight - titleHeight,
    )
    .fillAndStroke('white', darkGray)
  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Dómstóll', titleX, pageMargin + titleHeight + calculatePt(16))
  doc.font('Times-Roman')
  doc.text(
    confirmation.institution,
    titleX,
    pageMargin + titleHeight + calculatePt(32),
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
  addAlignedText(doc, giganticFontSize, heading, 'center', font)
}

export const addHugeHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, hugeFontSize, heading, 'center', font)
}

export const addLargeHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, largeFontSize, heading, 'center', font)
}

export const addMediumPlusHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, mediumPlusFontSize, heading, 'center', font)
}

export const addMediumHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, mediumFontSize, heading, 'center', font)
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

export const addMediumCenteredText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, mediumFontSize, text, 'center', font)
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
  addAlignedText(doc, basePlusFontSize, text, 'center', font)
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
  addAlignedText(doc, baseFontSize, text, 'justify', font)
}

export const addNormalPlusJustifiedText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, basePlusFontSize, text, 'justify', font)
}

export const addNormalCenteredText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, baseFontSize, text, 'center', font)
}

export const addNormalRightAlignedText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, baseFontSize, text, 'right', font)
}

export const addNumberedList = (
  doc: PDFKit.PDFDocument,
  items: string[],
  start = 1,
  font?: string,
) => {
  const originalX = doc.x

  setFont(doc, font)

  const x = doc.page.margins.left + 18
  const gap = 6

  const maxIndex = start + items.length - 1
  const labelExample = `${maxIndex}.`
  const labelBoxWidth = doc.widthOfString(labelExample)

  const rightMargin = doc.page.margins.right
  const itemX = x + labelBoxWidth + gap
  const wrapWidth = doc.page.width - rightMargin - itemX

  const pageBottomY = doc.page.height - doc.page.margins.bottom

  for (const [i, item] of items.entries()) {
    const label = `${start + i}.`
    const textHeight = doc.heightOfString(label, {
      width: wrapWidth,
      height: 1.2,
    })
    const labelWidth = doc.widthOfString(label)
    const labelX = x + (labelBoxWidth - labelWidth)

    if (doc.y + textHeight > pageBottomY) {
      doc.addPage()
    }
    const y = doc.y

    doc.text(label, labelX, y)
    drawTextWithEllipsis(doc, ` ${item}`, itemX, y, wrapWidth)
  }

  doc.x = originalX
}
