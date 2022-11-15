import { FormatMessage } from '@island.is/cms-translations'
import {
  capitalize,
  indictmentSubTypes,
  formatDOB,
  caseTypes,
} from '@island.is/judicial-system/formatters'

import { caseFilesRecord } from '../messages'
import { Defendant } from '../modules/defendant'
import { Case } from '../modules/case'
import { Alignment, PageLink, PdfDocument } from './pdf'

export function formatDefendant(defendant: Defendant) {
  const defendantDOB = formatDOB(
    defendant.nationalId,
    defendant.noNationalId,
    '',
  )
  const defendantDOBSection = defendantDOB ? ` ${defendantDOB},` : ''

  return `${defendant.name ?? ''},${defendantDOBSection} ${
    defendant.address ?? ''
  }`
}

export const createCaseFilesRecord = async (
  theCase: Case,
  policeCaseNumber: string,
  caseFiles: (() => Promise<{
    date: string
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

  const chapters = [0, 1, 2, 3, 4, 5]
  const pageReferences: {
    chapter: number
    date: string
    name: string
    pageNumber: number
    pageLink: PageLink
  }[] = []

  const pdfDocument = await PdfDocument(
    formatMessage(caseFilesRecord.title, { policeCaseNumber }),
  )

  pdfDocument.setMargins(pageMargin, pageMargin, pageMargin, pageMargin)

  for (const caseFile of caseFiles) {
    const { date, name, chapter, buffer } = await caseFile()
    const pageNumber = pdfDocument.getPageCount()

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
          maxWidth: 500,
        })
    }

    pageReferences.push({
      chapter,
      date,
      name,
      pageNumber: pageNumber + 1,
      pageLink: pdfDocument.getPageLink(pageNumber),
    })
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
    .addText(
      capitalize(
        theCase.indictmentSubType
          ? indictmentSubTypes[theCase.indictmentSubType]
          : caseTypes[theCase.type],
      ),
      textFontSize,
      {
        position: { x: defendantIndent },
      },
    )
    .addText(
      formatMessage(caseFilesRecord.tableOfContentsHeading),
      subtitleFontSize,
      { alignment: Alignment.Center, bold: true, marginTop: 9 },
    )

  for (const chapter of chapters) {
    if (chapter === 0) {
      pdfDocument.addText(
        formatMessage(caseFilesRecord.pageNumberHeading),
        textFontSize,
        {
          alignment: Alignment.Right,
          newLine: false,
          marginTop: chapter > 0 ? 1 : 2,
        },
      )
    }

    pdfDocument.addText(
      formatMessage(caseFilesRecord.chapterName, { chapter }),
      textFontSize,
      { bold: true },
    )

    for (const pageReference of pageReferences.filter(
      (pageReference) => pageReference.chapter === chapter,
    )) {
      pdfDocument
        .addText(`${pageReference.pageNumber}`, textFontSize, {
          alignment: Alignment.Right,
          pageLink: pageReference.pageLink,
          newLine: false,
        })
        .addText(
          `${pageReference.date} - ${pageReference.name}`,
          textFontSize,
          {
            maxWidth: 400,
            pageLink: pageReference.pageLink,
            position: { x: pageReferenceIndent },
          },
        )
    }
  }

  return pdfDocument.getContents()
}
