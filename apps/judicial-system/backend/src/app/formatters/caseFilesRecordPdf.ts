import {
  layoutMultilineText,
  PDFFont,
  PDFPage,
  StandardFonts,
  TextAlignment,
} from 'pdf-lib'

import { FormatMessage } from '@island.is/cms-translations'
import {
  capitalize,
  caseTypes,
  formatNationalId,
} from '@island.is/judicial-system/formatters'

import { caseFilesRecord } from '../messages'
import { Defendant } from '../modules/defendant'
import { Case } from '../modules/case'
import { PdfDocument } from './pdf'

function drawTextAbsolute(
  page: PDFPage,
  text: string,
  s: number,
  y: number,
  font: PDFFont,
  fontSize: number,
) {
  page.drawText(text, {
    x: s,
    y: y,
    font: font,
    size: fontSize,
  })
}

function drawText(
  page: PDFPage,
  text: string,
  s: number,
  y: number,
  font: PDFFont,
  fontSize: number,
) {
  drawTextAbsolute(page, text, s, page.getHeight() - y, font, fontSize)
}

function drawCenteredText(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  fontSize: number,
) {
  drawText(
    page,
    text,
    (page.getWidth() - font.widthOfTextAtSize(text, fontSize)) / 2,
    y,
    font,
    fontSize,
  )
}

function formatDefendant(defendant: Defendant) {
  let nationalId = ''
  if (defendant.noNationalId) {
    if (defendant.nationalId) {
      nationalId = `${defendant.nationalId}, `
    }
  } else {
    nationalId = `${formatNationalId(defendant.nationalId ?? '')}, `
  }

  return `${defendant.name ?? ''}, ${nationalId}${defendant.address ?? ''}`
}

export const createCaseFilesRecord = async (
  theCase: Case,
  policeCaseNumber: string,
  caseFiles: (() => Promise<void | Buffer>)[],
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  /***** Setup ******/

  const lineSpacing = 4

  const pageMargin = 70
  const headerMargin = 35

  const headerFontSize = 8
  const titleFontSize = 16
  const subtitleFontSize = 14
  const textFontSize = 12

  const pdfDocument = await PdfDocument(
    formatMessage(caseFilesRecord.title, { policeCaseNumber }),
  )

  // TODO: Remove block
  const { rawDocument } = pdfDocument
  const normalFont = await rawDocument.embedFont(StandardFonts.TimesRoman)
  const boldFont = await rawDocument.embedFont(StandardFonts.TimesRomanBold)

  /***** Content ******/

  for (const caseFile of caseFiles) {
    const buffer = await caseFile()

    // TODO: Add error message to PDF
    buffer && (await pdfDocument.mergeDocument(buffer))
  }

  pdfDocument.addPageNumbers()
  createTableOfContents()

  const pdf = await rawDocument.save()

  return Buffer.from(pdf)

  /***** Helpers ******/

  function createTableOfContents() {
    const currentPage = rawDocument.insertPage(0)

    let yOffset = 0

    drawText(
      currentPage,
      `${theCase.creatingProsecutor?.institution?.name.toUpperCase()}`,
      pageMargin,
      (yOffset += headerMargin),
      boldFont,
      headerFontSize,
    )

    drawCenteredText(
      currentPage,
      formatMessage(caseFilesRecord.heading),
      (yOffset += pageMargin),
      boldFont,
      titleFontSize,
    )

    drawCenteredText(
      currentPage,
      formatMessage(caseFilesRecord.policeCaseNumber, { policeCaseNumber }),
      (yOffset += titleFontSize + lineSpacing),
      boldFont,
      titleFontSize,
    )

    drawText(
      currentPage,
      formatMessage(caseFilesRecord.accused),
      pageMargin,
      (yOffset += titleFontSize + 8 * lineSpacing),
      boldFont,
      textFontSize,
    )

    theCase.defendants?.forEach((defendant, defendantIndex: number) => {
      const text = formatDefendant(defendant)

      const multilineTextLayout = layoutMultilineText(text, {
        alignment: TextAlignment.Left,
        bounds: {
          x: 0,
          y: 0,
          width: currentPage.getWidth() - 2.5 * pageMargin - pageMargin,
          height: currentPage.getHeight(),
        },
        font: normalFont,
        fontSize: textFontSize,
      })

      multilineTextLayout.lines.forEach((line, lineIndex) => {
        if (defendantIndex > 0) {
          yOffset += textFontSize

          if (lineIndex > 0) {
            yOffset += lineSpacing / 2
          } else {
            yOffset += lineSpacing
          }
        } else if (lineIndex > 0) {
          yOffset += textFontSize + lineSpacing / 2
        }

        drawText(
          currentPage,
          line.text,
          2.5 * pageMargin,
          yOffset,
          normalFont,
          textFontSize,
        )
      })
    })

    drawText(
      currentPage,
      formatMessage(caseFilesRecord.accusedOf),
      pageMargin,
      (yOffset += titleFontSize + 2 * lineSpacing),
      boldFont,
      textFontSize,
    )

    drawText(
      currentPage,
      capitalize(caseTypes[theCase.type]),
      2.5 * pageMargin,
      yOffset,
      normalFont,
      textFontSize,
    )

    drawCenteredText(
      currentPage,
      formatMessage(caseFilesRecord.tableOfContentsHeading),
      (yOffset += textFontSize + 10 * lineSpacing),
      boldFont,
      subtitleFontSize,
    )
  }
}
