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

  const defendantIndent = 2.5 * pageMargin
  const pageReferenceIndent = pageMargin + 20

  const pageReferences: {
    chapter: number
    name: string
    pageNumber: number
  }[] = []

  const pdfDocument = await PdfDocument(
    formatMessage(caseFilesRecord.title, { policeCaseNumber }),
  )

  pdfDocument.setMargins(pageMargin, pageMargin, pageMargin, pageMargin)

  for (const caseFile of caseFiles) {
    const { name, chapter, buffer } = await caseFile()

    pageReferences.push({
      chapter,
      name,
      pageNumber: pdfDocument.getPageCount() + 1,
    })

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
      position: { x: defendantIndent },
    })
    .addText(
      formatMessage(caseFilesRecord.tableOfContentsHeading),
      subtitleFontSize,
      { alignment: Alignment.Center, bold: true, marginTop: 9 },
    )

  for (const chapter of [0, 1, 2, 3, 4, 5]) {
    pdfDocument.addText(
      formatMessage(caseFilesRecord.chapter, { chapter }),
      textFontSize,
      { bold: true, marginTop: chapter > 0 ? 1 : 2 },
    )

    for (const pageReference of pageReferences.filter(
      (pageReference) => pageReference.chapter === chapter,
    )) {
      pdfDocument.addText(
        `${pageReference.name} ${pageReference.pageNumber}`,
        textFontSize,
        {
          pageLink: pageReference.pageNumber,
          position: { x: pageReferenceIndent },
        },
      )
    }
  }

  return pdfDocument.getContents()
}
