import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib'

import { formatDate } from '@island.is/judicial-system/formatters'
import { CaseFileCategory } from '@island.is/judicial-system/types'

import {
  calculatePt,
  Confirmation,
  confirmationFontSize,
  confirmationLayout,
  drawTextWithEllipsisPDFKit,
  formatActor,
} from '../pdfHelpers'
import { PDFKitCoatOfArms } from '../svgs/PDFKitCoatOfArms'

type ConfirmableCaseFileCategories =
  | CaseFileCategory.RULING
  | CaseFileCategory.COURT_RECORD
  | CaseFileCategory.COURT_INDICTMENT_RULING_ORDER

export const hasConfirmableCaseFileCategories = (
  category: CaseFileCategory | undefined,
): category is ConfirmableCaseFileCategories => {
  return (
    category === CaseFileCategory.RULING ||
    category === CaseFileCategory.COURT_RECORD ||
    category === CaseFileCategory.COURT_INDICTMENT_RULING_ORDER
  )
}

// Colors
const lightGray = rgb(0.9804, 0.9804, 0.9804)
const darkGray = rgb(0.7961, 0.7961, 0.7961)
const white = rgb(1, 1, 1)

interface ConfirmationBox {
  title: string
  content: string
  widthPercent: number // 0-100
}

interface ConfirmationFonts {
  regular: PDFFont
  bold: PDFFont
}

// Draws the same stamp as drawConfirmation in pdfHelpers, for documents that
// were uploaded as finished PDFs rather than generated. pdf-lib measures y
// from the bottom of the page and positions text by its baseline, so every
// position is computed from the top of the page, like pdfkit does, and
// flipped when drawn.
const drawConfirmation = (
  page: PDFPage,
  fonts: ConfirmationFonts,
  confirmation: Confirmation,
  boxes: ConfirmationBox[],
) => {
  const {
    pageMargin,
    shadowHeight,
    coatOfArmsWidth,
    coatOfArmsHeight,
    offset,
    titleHeight,
    padding,
    boxTextTop,
    boxLineHeight,
    coatOfArms,
  } = confirmationLayout
  const { width: pageWidth, height: pageHeight } = page.getSize()
  const fontSize = calculatePt(confirmationFontSize)
  const ascent = fonts.regular.heightAtSize(fontSize, { descender: false })

  const totalWidth = pageWidth - pageMargin * 2
  const contentX = pageMargin + offset + coatOfArmsWidth
  const contentWidth = totalWidth - coatOfArmsWidth
  const contentTop = pageMargin - offset

  const fromTop = (y: number) => pageHeight - y

  const drawBox = (
    x: number,
    top: number,
    width: number,
    height: number,
    color: ReturnType<typeof rgb>,
  ) =>
    page.drawRectangle({
      x,
      y: fromTop(top + height),
      width,
      height,
      color,
      borderColor: darkGray,
      borderWidth: 1,
    })

  const drawText = (text: string, x: number, top: number, font: PDFFont) =>
    page.drawText(text, { x, y: fromTop(top + ascent), size: fontSize, font })

  // Draw the shadow background
  page.drawRectangle({
    x: pageMargin,
    y: fromTop(pageMargin + shadowHeight),
    width: totalWidth,
    height: shadowHeight,
    color: lightGray,
  })

  // Draw the coat of arms box, offset up and to the right of the shadow
  drawBox(
    pageMargin + offset,
    contentTop,
    coatOfArmsWidth,
    coatOfArmsHeight,
    white,
  )
  PDFKitCoatOfArms(page, {
    x: pageMargin + coatOfArms.offsetX,
    y: fromTop(pageMargin + coatOfArms.offsetY),
    scale: coatOfArms.scale,
  })

  // Draw the title box
  drawBox(contentX, contentTop, contentWidth, titleHeight, lightGray)

  const titleTextTop = contentTop + titleHeight / 2 - fontSize / 2
  const titleX = contentX + padding
  const title = 'Réttarvörslugátt'

  drawText(title, titleX, titleTextTop, fonts.bold)
  drawText(
    'Rafræn staðfesting',
    titleX + fonts.bold.widthOfTextAtSize(`${title}  `, fontSize),
    titleTextTop,
    fonts.regular,
  )

  const dateString = formatDate(confirmation.date) ?? ''
  drawText(
    dateString,
    contentX +
      contentWidth -
      padding -
      fonts.regular.widthOfTextAtSize(dateString, fontSize),
    titleTextTop,
    fonts.regular,
  )

  // Draw the boxes below the title
  const boxTop = contentTop + titleHeight
  const boxHeight = shadowHeight - titleHeight
  let currentX = contentX

  for (const box of boxes) {
    const boxWidth = (contentWidth * box.widthPercent) / 100

    drawBox(currentX, boxTop, boxWidth, boxHeight, white)
    drawText(box.title, currentX + padding, boxTop + boxTextTop, fonts.bold)
    drawTextWithEllipsisPDFKit(
      page,
      box.content,
      { type: fonts.regular, size: fontSize },
      currentX + padding,
      fromTop(boxTop + boxTextTop + boxLineHeight + ascent),
      boxWidth - padding * 2,
    )

    currentX += boxWidth
  }
}

const getConfirmationBoxes = (
  confirmation: Confirmation,
  fileType: ConfirmableCaseFileCategories,
): ConfirmationBox[] => {
  const institution = {
    title: 'Dómstóll',
    content: confirmation.institution,
    widthPercent: 100,
  }

  switch (fileType) {
    case CaseFileCategory.RULING:
    case CaseFileCategory.COURT_INDICTMENT_RULING_ORDER:
      return [
        { ...institution, widthPercent: 50 },
        {
          title: 'Samþykktaraðili',
          content: formatActor(confirmation.actor, confirmation.title),
          widthPercent: 50,
        },
      ]
    case CaseFileCategory.COURT_RECORD:
      return [institution]
  }
}

export const createConfirmedPdf = async (
  confirmation: Confirmation,
  pdf: Buffer,
  fileType: ConfirmableCaseFileCategories,
) => {
  if (!hasConfirmableCaseFileCategories(fileType)) {
    throw new Error('CaseFileCategory not supported')
  }

  const pdfDoc = await PDFDocument.load(new Uint8Array(pdf))
  const fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    bold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
  }

  drawConfirmation(
    pdfDoc.getPage(0),
    fonts,
    confirmation,
    getConfirmationBoxes(confirmation, fileType),
  )

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
