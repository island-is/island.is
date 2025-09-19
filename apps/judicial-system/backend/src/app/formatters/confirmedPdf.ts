import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

import { formatDate, lowercase } from '@island.is/judicial-system/formatters'
import { CaseFileCategory } from '@island.is/judicial-system/types'

import {
  calculatePt,
  Confirmation,
  drawTextWithEllipsisPDFKit,
  smallFontSize,
} from './pdfHelpers'
import { PDFKitCoatOfArms } from './PDFKitCoatOfArms'

type ConfirmableCaseFileCategories =
  | CaseFileCategory.RULING
  | CaseFileCategory.COURT_RECORD

// Colors
const lightGray = rgb(0.9804, 0.9804, 0.9804)
const darkGray = rgb(0.7961, 0.7961, 0.7961)
const white = rgb(1, 1, 1)

// Spacing
const pageMargin = calculatePt(18)
const coatOfArmsX = pageMargin + calculatePt(8)
const coatOfArmsWidth = calculatePt(105)
const confirmedByHeight = calculatePt(50)
const titleX = coatOfArmsX + coatOfArmsWidth + calculatePt(8)

const createRulingConfirmation = async (
  confirmation: Confirmation,
  pdfDoc: PDFDocument,
) => {
  const pages = pdfDoc.getPages()
  const doc = pages[0]

  const { height } = doc.getSize()
  const shadowHeight = calculatePt(70)
  const institutionWidth = calculatePt(160)
  const confirmedByWidth = institutionWidth + calculatePt(48)
  const shadowWidth = institutionWidth + confirmedByWidth + coatOfArmsWidth
  const titleHeight = calculatePt(24)
  const titleWidth = institutionWidth + confirmedByWidth

  // Draw the shadow
  doc.drawRectangle({
    x: pageMargin,
    y: height - shadowHeight - pageMargin,
    width: shadowWidth,
    height: shadowHeight,
    color: lightGray,
  })

  // Draw the box around the coat of arms
  doc.drawRectangle({
    x: coatOfArmsX,
    y: height - shadowHeight - pageMargin + calculatePt(8),
    width: coatOfArmsWidth,
    height: shadowHeight,
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
    x: shadowWidth - calculatePt(24),
    y: height - pageMargin - titleHeight + calculatePt(16),
    size: calculatePt(smallFontSize),
    font: timesRomanFont,
  })

  // Draw the "Institution" box
  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsWidth,
    y: height - pageMargin - titleHeight - confirmedByHeight + calculatePt(12),
    width: institutionWidth,
    height: shadowHeight - titleHeight,
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
    height: shadowHeight - titleHeight,
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
}

const createCourtRecordConfirmation = async (
  confirmation: Confirmation,
  pdfDoc: PDFDocument,
) => {
  const pages = pdfDoc.getPages()
  const doc = pages[0]

  const { height } = doc.getSize()
  const shadowHeight = calculatePt(70)
  const institutionWidth = calculatePt(160)
  const confirmedByWidth = institutionWidth + calculatePt(48)
  const shadowWidth = institutionWidth + confirmedByWidth + coatOfArmsWidth
  const titleHeight = calculatePt(24)
  const titleWidth = institutionWidth + confirmedByWidth

  // Draw the shadow
  doc.drawRectangle({
    x: pageMargin,
    y: height - shadowHeight - pageMargin,
    width: shadowWidth,
    height: shadowHeight,
    color: lightGray,
  })

  // Draw the box around the coat of arms
  doc.drawRectangle({
    x: coatOfArmsX,
    y: height - shadowHeight - pageMargin + calculatePt(8),
    width: coatOfArmsWidth,
    height: shadowHeight,
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
    x: shadowWidth - calculatePt(24),
    y: height - pageMargin - titleHeight + calculatePt(16),
    size: calculatePt(smallFontSize),
    font: timesRomanFont,
  })

  // Draw the "Institution" box
  doc.drawRectangle({
    x: coatOfArmsX + coatOfArmsWidth,
    y: height - pageMargin - titleHeight - confirmedByHeight + calculatePt(12),
    width: institutionWidth + confirmedByWidth,
    height: shadowHeight - titleHeight,
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
}

export const createConfirmedPdf = async (
  confirmation: Confirmation,
  pdf: Buffer,
  fileType: ConfirmableCaseFileCategories,
) => {
  const pdfDoc = await PDFDocument.load(new Uint8Array(pdf))

  switch (fileType) {
    case CaseFileCategory.RULING: {
      await createRulingConfirmation(confirmation, pdfDoc)
      break
    }
    case CaseFileCategory.COURT_RECORD: {
      await createCourtRecordConfirmation(confirmation, pdfDoc)
      break
    }
    default: {
      throw new Error('CaseFileCategory not supported')
    }
  }

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
