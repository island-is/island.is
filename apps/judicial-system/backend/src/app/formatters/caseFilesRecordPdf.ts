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
  caseFiles: (() => Promise<{
    name: string
    chapter: number
    order: number
    buffer?: Buffer
  }>)[],
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  const pageMargin = 70
  const headerMargin = 35

  const headerFontSize = 8
  const titleFontSize = 16
  const subtitleFontSize = 14
  const textFontSize = 12

  const pdfDocument = await PdfDocument(
    formatMessage(caseFilesRecord.title, { policeCaseNumber }),
  )

  pdfDocument.setMargins(pageMargin, pageMargin, pageMargin, pageMargin)

  for (const caseFile of caseFiles) {
    const { name, chapter, order, buffer } = await caseFile()

    // TODO: Add error message to PDF
    if (buffer) {
      await pdfDocument.mergeDocument(buffer)
    } else {
      pdfDocument
        .addPage()
        .addTextBoldCentered(
          formatMessage(caseFilesRecord.missingFile),
          titleFontSize,
        )
        .addTextBoldCentered(name, subtitleFontSize)
    }
  }

  pdfDocument
    .addPageNumbers()
    .addPage(0)
    .addTextBold(
      `${theCase.creatingProsecutor?.institution?.name.toUpperCase()}`,
      headerFontSize,
      { y: headerMargin },
    )
    .addTextBoldCentered(
      formatMessage(caseFilesRecord.heading),
      titleFontSize,
      headerMargin + pageMargin,
    )
    .addTextBoldCentered(
      formatMessage(caseFilesRecord.policeCaseNumber, { policeCaseNumber }),
      titleFontSize,
    )
    .addTextBold(
      formatMessage(caseFilesRecord.accused),
      textFontSize,
      undefined,
      7,
      false,
    )

  for (const defendant of theCase.defendants ?? []) {
    pdfDocument.addParagraph(
      formatDefendant(defendant),
      textFontSize,
      2.5 * pageMargin,
    )
  }

  pdfDocument
    .addTextBold(
      formatMessage(caseFilesRecord.accusedOf),
      textFontSize,
      undefined,
      1,
      false,
    )
    .addText(capitalize(caseTypes[theCase.type]), textFontSize, {
      x: 2.5 * pageMargin,
    })
    .addTextBoldCentered(
      formatMessage(caseFilesRecord.tableOfContentsHeading),
      subtitleFontSize,
      undefined,
      9,
    )

  return pdfDocument.getContents()
}
