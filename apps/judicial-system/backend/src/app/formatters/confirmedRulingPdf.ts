import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

import { formatDate, lowercase } from '@island.is/judicial-system/formatters'

import {
  calculatePt,
  Confirmation,
  drawTextWithEllipsisPDFKit,
  smallFontSize,
} from './pdfHelpers'
import { PDFKitCoatOfArms } from './PDFKitCoatOfArms'

export const createConfirmedRuling = async (
  confirmation: Confirmation,
  rulingPDF: Buffer,
): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.load(rulingPDF)
  const pages = pdfDoc.getPages()
  const doc = pages[0]

  const lightGray = rgb(0.9804, 0.9804, 0.9804)
  const darkGray = rgb(0.7961, 0.7961, 0.7961)
  const white = rgb(1, 1, 1)
  const { height } = doc.getSize()
  const pageMargin = calculatePt(18)
  const shaddowHeight = calculatePt(70)
  const coatOfArmsWidth = calculatePt(105)
  const coatOfArmsX = pageMargin + calculatePt(8)
  const titleHeight = calculatePt(24)
  const titleX = coatOfArmsX + coatOfArmsWidth + calculatePt(8)
  const institutionWidth = calculatePt(160)
  const confirmedByWidth = institutionWidth + calculatePt(48)
  const confirmedByHeight = calculatePt(50)
  const titleWidth = institutionWidth + confirmedByWidth
  const shaddowWidth = institutionWidth + confirmedByWidth + coatOfArmsWidth

  // Draw the shadow
  doc.drawRectangle({
    x: pageMargin,
    y: height - shaddowHeight - pageMargin,
    width: shaddowWidth,
    height: shaddowHeight,
    color: lightGray,
  })

  // Draw the box around the coat of arms
  doc.drawRectangle({
    x: coatOfArmsX,
    y: height - shaddowHeight - pageMargin + calculatePt(8),
    width: coatOfArmsWidth,
    height: shaddowHeight,
    color: rgb(1, 1, 1),
    borderColor: darkGray,
    borderWidth: 1,
  })

  PDFKitCoatOfArms(doc, height + 8)

  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsWidth,
    y: height - pageMargin - titleHeight + calculatePt(8),
    width: titleWidth,
    height: titleHeight,
    color: lightGray,
    borderColor: darkGray,
    borderWidth: 1,
  })

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesRomanBoldFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanBold,
  )
  doc.drawText('Réttarvörslugátt', {
    x: titleX,
    y: height - pageMargin - titleHeight + calculatePt(16),
    size: calculatePt(smallFontSize),
    font: timesRomanBoldFont,
  })

  doc.drawText('Rafræn staðfesting', {
    x: 158,
    y: height - pageMargin - titleHeight + calculatePt(16),
    size: calculatePt(smallFontSize),
    font: timesRomanFont,
  })

  doc.drawText(formatDate(confirmation.date) || '', {
    x: shaddowWidth - calculatePt(24),
    y: height - pageMargin - titleHeight + calculatePt(16),
    size: calculatePt(smallFontSize),
    font: timesRomanFont,
  })

  // Draw the "Institution" box
  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsWidth,
    y: height - pageMargin - titleHeight - confirmedByHeight + calculatePt(12),
    width: institutionWidth,
    height: shaddowHeight - titleHeight,
    color: white,
    borderColor: darkGray,
    borderWidth: 1,
  })

  doc.drawText('Dómstóll', {
    x: titleX,
    y: height - pageMargin - titleHeight - calculatePt(10),
    size: calculatePt(smallFontSize),
    font: timesRomanBoldFont,
  })

  if (confirmation?.institution) {
    doc.drawText(confirmation.institution, {
      x: titleX,
      y: height - pageMargin - titleHeight - calculatePt(22),
      font: timesRomanFont,
      size: calculatePt(smallFontSize),
    })
  }

  // Draw the "Institution" box
  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsWidth + institutionWidth,
    y: height - pageMargin - titleHeight - confirmedByHeight + calculatePt(12),
    width: confirmedByWidth,
    height: shaddowHeight - titleHeight,
    color: white,
    borderColor: darkGray,
    borderWidth: 1,
  })

  doc.drawText('Samþykktaraðili', {
    x: titleX + institutionWidth,
    y: height - pageMargin - titleHeight - calculatePt(10),
    size: calculatePt(smallFontSize),
    font: timesRomanBoldFont,
  })

  if (confirmation?.actor) {
    timesRomanFont.widthOfTextAtSize(
      `${confirmation.actor}${
        confirmation.title ? `, ${lowercase(confirmation.title)}` : ''
      }`,
      calculatePt(smallFontSize),
    )
    drawTextWithEllipsisPDFKit(
      doc,
      `${confirmation.actor}${
        confirmation.title ? `, ${lowercase(confirmation.title)}` : ''
      }`,
      { type: timesRomanFont, size: calculatePt(smallFontSize) },
      titleX + institutionWidth,
      height - pageMargin - titleHeight - calculatePt(22),
      confirmedByWidth - 16,
    )
  }

  const pdfBytes = await pdfDoc.save()

  return Buffer.from(pdfBytes)
}
