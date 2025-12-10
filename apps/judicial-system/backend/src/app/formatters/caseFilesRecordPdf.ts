import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'

import { caseFilesRecord } from '../messages'
import { Case, Defendant } from '../modules/repository'
import { Alignment, LineLink, PageLink, PdfDocument } from './pdf'

export const formatDefendant = (defendant: Defendant) => {
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
    date: Date
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
  const pageDateIndent = pageMargin + 300

  const chapters = [0, 1, 2, 3, 4, 5]
  const pageReferences: {
    chapter: number
    date: Date
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
    .addPage(0)
    .addText(
      `${theCase.prosecutorsOffice?.name.toUpperCase()}`,
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
    .addText(
      formatMessage(caseFilesRecord.accused, {
        suffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'ur',
      }),
      textFontSize,
      {
        bold: true,
        marginTop: 7,
        newLine: false,
      },
    )

  for (const defendant of theCase.defendants ?? []) {
    pdfDocument.addParagraph(
      formatDefendant(defendant),
      textFontSize,
      2.5 * pageMargin,
    )
  }

  const subtypes =
    (theCase.indictmentSubtypes &&
      theCase.indictmentSubtypes[policeCaseNumber]) ??
    []

  pdfDocument
    .addText(formatMessage(caseFilesRecord.accusedOf), textFontSize, {
      bold: true,
      marginTop: 4,
      newLine: false,
    })
    .addParagraph(
      capitalize(
        subtypes.map((subtype) => indictmentSubtypes[subtype]).join(', '),
      ),
      textFontSize,
      defendantIndent,
    )

  if (theCase.crimeScenes && theCase.crimeScenes[policeCaseNumber]) {
    pdfDocument
      .addText(formatMessage(caseFilesRecord.crimeScene), textFontSize, {
        bold: true,
        marginTop: 4,
        newLine: false,
      })
      .addParagraph(
        `${theCase.crimeScenes[policeCaseNumber].place ?? ''}${
          theCase.crimeScenes[policeCaseNumber].place &&
          theCase.crimeScenes[policeCaseNumber].date
            ? ' - '
            : ''
        }${
          theCase.crimeScenes[policeCaseNumber].date
            ? formatDate(theCase.crimeScenes[policeCaseNumber].date)
            : ''
        }`,
        textFontSize,
        defendantIndent,
      )
  }

  pdfDocument.addText(
    formatMessage(caseFilesRecord.tableOfContentsHeading),
    subtitleFontSize,
    { alignment: Alignment.Center, bold: true, marginTop: 9, marginBottom: 45 },
  )

  const pageCount = pdfDocument.getPageCount()
  const tableOfContentsLineReferences: {
    lineLink: LineLink
    pageNumber: number
    pageLink: PageLink
  }[] = []

  for (const chapter of chapters) {
    if (chapter === 0) {
      pdfDocument
        .addText(
          formatMessage(caseFilesRecord.pageNumberHeading),
          textFontSize,
          {
            bold: true,
            newLine: false,
            alignment: Alignment.Right,
          },
        )
        .addText(formatMessage(caseFilesRecord.date), textFontSize, {
          bold: true,
          newLine: false,
          alignment: Alignment.Left,
          position: { x: pageDateIndent },
        })
    }

    pdfDocument.addText(
      formatMessage(caseFilesRecord.chapterName, { chapter }),
      textFontSize,
      { bold: true, marginTop: chapter > 0 ? 4 : 0 },
    )

    for (const pageReference of pageReferences.filter(
      (pageReference) => pageReference.chapter === chapter,
    )) {
      tableOfContentsLineReferences.push({
        lineLink: pdfDocument
          .addText('', textFontSize, { newLine: false })
          .getCurrentLineLink(),
        pageNumber: pageReference.pageNumber,
        pageLink: pageReference.pageLink,
      })
      pdfDocument.addText(formatDate(pageReference.date) ?? '', textFontSize, {
        pageLink: pageReference.pageLink,
        newLine: false,
        position: { x: pageDateIndent },
        marginTop: 1,
      })

      const nameChunks = pageReference.name.match(/.{1,40}(?=\s|$)/g)

      for (const chunk of nameChunks ?? []) {
        pdfDocument.addText(chunk.trimStart(), textFontSize, {
          newLine: true,
          pageLink: pageReference.pageLink,
          position: { x: pageReferenceIndent },
        })
      }
    }
  }

  const tableOfContentsPageCount = pdfDocument.getPageCount() - pageCount

  for (const lineReference of tableOfContentsLineReferences) {
    pdfDocument
      .setCurrentLine(lineReference.lineLink)
      .addText(
        `${tableOfContentsPageCount + lineReference.pageNumber + 1}`,
        textFontSize,
        {
          alignment: Alignment.Right,
          pageLink: lineReference.pageLink,
          newLine: false,
          marginTop: 1,
        },
      )
  }

  pdfDocument.addPageNumbers(tableOfContentsPageCount)

  return pdfDocument.getContents()
}
