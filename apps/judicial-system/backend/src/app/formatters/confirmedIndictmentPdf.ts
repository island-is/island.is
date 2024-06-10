import { applyCase } from 'beygla'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

import { formatDate } from '@island.is/judicial-system/formatters'

import {
  drawTextWithEllipsisPDFKit,
  IndictmentConfirmation,
} from './pdfHelpers'
import { PDFKitCoatOfArms } from './PDFKitCoatOfArms'

export const createConfirmedIndictment = async (
  confirmation: IndictmentConfirmation,
  indictmentPDF: Buffer,
): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.load(indictmentPDF)
  const pages = pdfDoc.getPages()
  const doc = pages[0]

  const lightGray = rgb(0.9804, 0.9804, 0.9804)
  const darkGray = rgb(0.7961, 0.7961, 0.7961)
  const gold = rgb(0.6784, 0.6392, 0.451)
  const white = rgb(1, 1, 1)
  const pageMargin = 24
  // The shaddow and content heights are the same
  const shaddowHeight = 88
  const coatOfArmsDimensions = 88
  const coatOfArmsX = pageMargin + 8
  const titleWidth = doc.getWidth() - 142
  const titleHeight = 32
  const titleX = coatOfArmsX + coatOfArmsDimensions + 8
  const confirmedByWidth = 160
  const institutionWidth = confirmedByWidth + 62

  const { width, height } = doc.getSize()

  doc.drawRectangle({
    x: pageMargin,
    y: height - shaddowHeight - 32,
    width: doc.getWidth() - 2 * pageMargin - 8,
    height: shaddowHeight,
    color: lightGray,
  })

  doc.drawRectangle({
    x: coatOfArmsX,
    y: height - coatOfArmsDimensions - pageMargin,
    width: coatOfArmsDimensions,
    height: coatOfArmsDimensions,
    color: rgb(1, 1, 1),
    borderColor: darkGray,
    borderWidth: 1,
  })

  PDFKitCoatOfArms(doc, height)

  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsDimensions,
    y: height - pageMargin - titleHeight,
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
    y: height - 44,
    size: 12,
    font: timesRomanBoldFont,
  })

  doc.drawText('Skjal samþykkt rafrænt', {
    x: 220,
    y: height - 44,
    size: 12,
    font: timesRomanFont,
  })

  doc.drawSvgPath(
    'M0.763563 11.8047H7.57201C7.85402 11.8047 8.08264 11.5761 8.08264 11.2941V5.50692C8.08264 5.22492 7.85402 4.99629 7.57201 4.99629H7.06138V3.46439C7.06138 1.86887 5.76331 0.570801 4.16779 0.570801C2.57226 0.570801 1.2742 1.86887 1.2742 3.46439V4.99629H0.763563C0.481557 4.99629 0.25293 5.22492 0.25293 5.50692V11.2941C0.25293 11.5761 0.481557 11.8047 0.763563 11.8047ZM5.61394 8.03817L4.16714 9.48496C4.06743 9.58467 3.93674 9.63455 3.80609 9.63455C3.67543 9.63455 3.54471 9.58467 3.44504 9.48496L2.72164 8.76157C2.52222 8.56215 2.52222 8.23888 2.72164 8.03943C2.92102 7.84001 3.24436 7.84001 3.44378 8.03943L3.80612 8.40174L4.89187 7.31603C5.09125 7.11661 5.41458 7.11661 5.614 7.31603C5.81339 7.51549 5.81339 7.83875 5.61394 8.03817ZM2.29546 3.46439C2.29546 2.43199 3.13539 1.59207 4.16779 1.59207C5.20019 1.59207 6.04011 2.43199 6.04011 3.46439V4.99629H2.29546V3.46439Z',
    { color: gold, x: width - 38, y: height - 34 },
  )

  // Draw the "Confirmed by" box
  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsDimensions,
    y: height - pageMargin - titleHeight - 56,
    width: confirmedByWidth,
    height: shaddowHeight - titleHeight,
    color: white,
    borderColor: darkGray,
    borderWidth: 1,
  })

  doc.drawText('Staðfest af', {
    x: coatOfArmsX + coatOfArmsDimensions + 8,
    y: height - pageMargin - titleHeight - 24,
    size: 12,
    font: timesRomanBoldFont,
  })

  if (confirmation?.actor) {
    timesRomanFont.widthOfTextAtSize(applyCase('þgf', confirmation.actor), 12)
    drawTextWithEllipsisPDFKit(
      doc,
      applyCase('þgf', confirmation.actor),
      { type: timesRomanFont, size: 12 },
      coatOfArmsX + coatOfArmsDimensions + 8,
      height - pageMargin - titleHeight - 40,
      confirmedByWidth - 16,
    )
  }

  // Draw the "Institution" box
  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsDimensions + confirmedByWidth,
    y: height - pageMargin - titleHeight - 56,
    width: institutionWidth,
    height: shaddowHeight - titleHeight,
    color: white,
    borderColor: darkGray,
    borderWidth: 1,
  })

  doc.drawText('Embætti', {
    x: coatOfArmsX + coatOfArmsDimensions + confirmedByWidth + 8,
    y: height - pageMargin - titleHeight - 24,
    size: 12,
    font: timesRomanBoldFont,
  })

  if (confirmation?.institution) {
    doc.drawText(confirmation.institution, {
      x: coatOfArmsX + coatOfArmsDimensions + confirmedByWidth + 8,
      y: height - pageMargin - titleHeight - 40,
      font: timesRomanFont,
      size: 12,
    })
  }

  // Draw the "Indictment date" box
  doc.drawRectangle({
    x: width - 88 - 22,
    y: height - pageMargin - titleHeight - 56,
    width: 88,
    height: shaddowHeight - titleHeight,
    color: white,
    borderColor: darkGray,
    borderWidth: 1,
  })

  doc.drawText('Útgáfa ákæru', {
    x: width - 88 - 16,
    y: height - pageMargin - titleHeight - 24,
    size: 12,
    font: timesRomanBoldFont,
  })

  if (confirmation?.date) {
    const dateFormattedDate = formatDate(confirmation.date, 'P')

    if (dateFormattedDate) {
      doc.drawText(dateFormattedDate, {
        x: width - 88 - 16,
        y: height - pageMargin - titleHeight - 40,
        font: timesRomanFont,
        size: 12,
      })
    }
  }

  const pdfBytes = await pdfDoc.save()

  return Buffer.from(pdfBytes)
}
