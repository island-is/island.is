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
export const xsFontSize = 5
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
  scale?: number,
) => {
  doc.save()

  doc.translate(x ?? 270, y ?? 70).scale(scale ?? 0.4)

  coatOfArms(doc)

  doc.fillColor('black')
  doc.restore()
}

export const addPoliceStar = (doc: PDFKit.PDFDocument) => {
  doc.translate(270, 70).scale(0.04)

  doc.image(policeStar, 0, 0, { fit: [1350, 1350] })

  doc.scale(25).translate(-270, -70)
}

interface InfoBox {
  title: string
  content: string
  widthPercent: number // 0-100
}

interface ConfirmationConfig {
  boxes: InfoBox[]
  confirmationText: string
  showLockIcon?: boolean
  date?: Date
}

export const formatActor = (name: string, title?: string) => {
  return `${name}${title ? `, ${lowercase(title)}` : ''}`
}

export const drawConfirmation = (
  doc: PDFKit.PDFDocument,
  config: ConfirmationConfig,
) => {
  const { boxes, confirmationText, showLockIcon = false, date } = config

  const pageMargin = calculatePt(18)
  const shaddowHeight = calculatePt(48)
  const coatOfArmsHeight = calculatePt(48)
  const coatOfArmsWidth = calculatePt(88)
  const coatOfArmsX = pageMargin + calculatePt(8)
  const titleHeight = calculatePt(16)
  const titleX = coatOfArmsX + coatOfArmsWidth + calculatePt(8)
  const fontSize = calculatePt(xsFontSize) * 0.7

  // Page width minus 2 times the page margin
  const totalWidth = doc.page.width - pageMargin * 2
  const availableBoxWidth = totalWidth - coatOfArmsWidth

  doc.save()

  doc.x = pageMargin
  doc.y = pageMargin

  // Draw the shaddow background
  doc.rect(doc.x, doc.y, totalWidth, shaddowHeight).fill(lightGray)

  // Draw the Coat of Arms box. Note that the x and y is offset by
  // 8pts to create a shadow effect
  doc
    .rect(
      doc.x + calculatePt(8),
      doc.y - calculatePt(8),
      coatOfArmsWidth,
      coatOfArmsHeight,
    )
    .fillAndStroke('white', darkGray)

  // Draw the actual Coat of Arms. Note that the x and y is offset by
  // some magic numbers to center it in the box
  addCoatOfArms(doc, doc.x + calculatePt(35), doc.y - calculatePt(1), 0.25)

  // Draw the title box
  const titleBoxY = doc.y - calculatePt(8)
  const titleTextY = titleBoxY + titleHeight / 2 - fontSize / 2

  doc
    .rect(
      coatOfArmsX + coatOfArmsWidth,
      titleBoxY,
      totalWidth - coatOfArmsWidth,
      titleHeight,
    )
    .fillAndStroke(lightGray, darkGray)

  // Draw the title text
  doc.fill('black')
  doc.font('Times-Bold')
  doc
    .fontSize(calculatePt(xsFontSize))
    .text('Réttarvörslugátt', titleX, titleTextY, {
      continued: true,
      lineBreak: false,
    })

  doc.text('  ', { continued: true })

  doc.font('Times-Roman')
  doc.text(confirmationText, { lineBreak: false })

  // Draw lock icon if needed
  if (showLockIcon) {
    doc
      .translate(totalWidth + calculatePt(8), doc.y - calculatePt(8))
      .scale(0.5)
      .path(
        'M2.76356 11.8047H9.57201C9.85402 11.8047 10.0826 11.5761 10.0826 11.2941V5.50692C10.0826 5.22492 9.85402 4.99629 9.57201 4.99629H9.06138V3.46439C9.06138 1.86887 7.76331 0.570801 6.16779 0.570801C4.57226 0.570801 3.2742 1.86887 3.2742 3.46439V4.99629H2.76356C2.48156 4.99629 2.25293 5.22492 2.25293 5.50692V11.2941C2.25293 11.5761 2.48156 11.8047 2.76356 11.8047ZM7.61394 8.03817L6.16714 9.48496C6.06743 9.58467 5.93674 9.63455 5.80609 9.63455C5.67543 9.63455 5.54471 9.58467 5.44504 9.48496L4.72164 8.76157C4.52222 8.56215 4.52222 8.23888 4.72164 8.03943C4.92102 7.84001 5.24436 7.84001 5.44378 8.03943L5.80612 8.40174L6.89187 7.31603C7.09125 7.11661 7.41458 7.11661 7.614 7.31603C7.81339 7.51549 7.81339 7.83875 7.61394 8.03817ZM4.29546 3.46439C4.29546 2.43199 5.13539 1.59207 6.16779 1.59207C7.20019 1.59207 8.04011 2.43199 8.04011 3.46439V4.99629H4.29546V3.46439Z',
      )
      .lineWidth(0.5)
      .fillAndStroke(gold, gold)

    doc.restore()
  } else if (date) {
    const dateString = formatDate(date) ?? ''
    const dateWidth = doc.widthOfString(dateString)

    doc
      .fontSize(calculatePt(xsFontSize))
      .text(
        formatDate(date) ?? '',
        coatOfArmsX +
          coatOfArmsWidth +
          (totalWidth - coatOfArmsWidth) -
          dateWidth -
          calculatePt(8),
        titleTextY,
        {
          align: 'right',
          width: dateWidth,
        },
      )
  }

  const boxY = titleBoxY + titleHeight
  const boxHeight = shaddowHeight - titleHeight
  let currentX = coatOfArmsX + coatOfArmsWidth

  boxes.forEach((box) => {
    // Draw the box
    const boxWidth = (availableBoxWidth * box.widthPercent) / 100

    doc
      .rect(currentX, boxY, boxWidth, boxHeight)
      .fillAndStroke('white', darkGray)
    doc.fill('black')
    doc.font('Times-Bold')
    doc.text(box.title, currentX + calculatePt(8), boxY + calculatePt(9), {
      lineGap: 1,
      width: boxWidth - calculatePt(16),
    })
    doc.font('Times-Roman')
    doc.text(box.content)

    currentX += boxWidth
  })

  doc.fillColor('black')
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
