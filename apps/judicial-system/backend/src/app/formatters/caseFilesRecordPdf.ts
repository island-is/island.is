import { FormatMessage } from '@island.is/cms-translations'
import {
  capitalize,
  caseTypes,
  formatNationalId,
} from '@island.is/judicial-system/formatters'

import { caseFilesRecord } from '../messages'
import { Defendant } from '../modules/defendant'
import { Case } from '../modules/case'
import { Alignment, PdfDocument } from './pdf'

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

    if (buffer) {
      await pdfDocument.mergeDocument(buffer)
    } else {
      pdfDocument
        .addPage()
        .addText(formatMessage(caseFilesRecord.missingFile), titleFontSize, {
          alignment: Alignment.Center,
          bold: true,
        })
        .addText(name, subtitleFontSize, {
          alignment: Alignment.Center,
          bold: true,
        })
    }
  }

  pdfDocument
    .addPageNumbers()
    .addPage(0)
    .addText(
      `${theCase.creatingProsecutor?.institution?.name.toUpperCase()}`,
      headerFontSize,
      { bold: true, position: { y: headerMargin } },
    )
    .addText(formatMessage(caseFilesRecord.heading), titleFontSize, {
      alignment: Alignment.Center,
      bold: true,
      position: { y: headerMargin + pageMargin },
    })
    .addText(
      formatMessage(caseFilesRecord.policeCaseNumber, { policeCaseNumber }),
      titleFontSize,
      { alignment: Alignment.Center, bold: true },
    )
    .addText(formatMessage(caseFilesRecord.accused), textFontSize, {
      bold: true,
      marginTop: 7,
      newLine: false,
    })

  for (const defendant of theCase.defendants ?? []) {
    pdfDocument.addParagraph(
      formatDefendant(defendant),
      textFontSize,
      2.5 * pageMargin,
    )
  }

  pdfDocument
    .addText(formatMessage(caseFilesRecord.accusedOf), textFontSize, {
      bold: true,
      marginTop: 1,
      newLine: false,
    })
    .addText(capitalize(caseTypes[theCase.type]), textFontSize, {
      position: { x: 2.5 * pageMargin },
    })
    .addText(
      formatMessage(caseFilesRecord.tableOfContentsHeading),
      subtitleFontSize,
      { alignment: Alignment.Center, bold: true, marginTop: 9 },
    )

  return pdfDocument.getContents()
}
