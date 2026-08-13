import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'

import { caseFilesRecord } from '../../messages'
import {
  Case,
  Defendant,
  PoliceDigitalCaseFile,
} from '../../modules/repository'
import { Alignment, LineLink, PageLink, PdfDocument } from '../pdfHelpers/pdf'

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

const addPoliceDigitalCaseFilesPage = (
  pdfDocument: PdfDocument,
  files: PoliceDigitalCaseFile[],
  formatMessage: FormatMessage,
  pageMargin: number,
  textFontSize: number,
  subtitleFontSize: number,
): { file: PoliceDigitalCaseFile; pageIndex: number }[] => {
  const bulletIndent = pageMargin + 16
  const valueIndent = pageMargin + 180

  const filePages: { file: PoliceDigitalCaseFile; pageIndex: number }[] = []

  pdfDocument.addPage().addText('6. Rafræn gögn (IDES)', subtitleFontSize, {
    bold: true,
    alignment: Alignment.Center,
    marginBottom: 8,
  })

  for (const file of files) {
    pdfDocument.addText(file.name, textFontSize, {
      bold: true,
      marginTop: 8,
    })

    // Capture the page after drawing the name as drawing it may have
    // overflowed to a new page
    filePages.push({
      file,
      pageIndex: pdfDocument.getCurrentLineLink().pageNumber,
    })

    pdfDocument
      .addText(`• Gagna nr: `, textFontSize, {
        bold: true,
        newLine: false,
        position: { x: bulletIndent },
      })
      .addText(file.policeDigitalFileId, textFontSize, {
        position: { x: valueIndent },
      })

    pdfDocument
      .addText(`• Upptaka nr: `, textFontSize, {
        bold: true,
        newLine: false,
        position: { x: bulletIndent },
      })
      .addText(file.policeExternalVendorId, textFontSize, {
        position: { x: valueIndent },
      })

    pdfDocument
      .addText(`• Dagsetning stofnað: `, textFontSize, {
        bold: true,
        newLine: false,
        position: { x: bulletIndent },
      })
      .addText(
        formatDate(file.displayDate?.toISOString()) ?? '',
        textFontSize,
        {
          position: { x: valueIndent },
        },
      )
  }

  return filePages
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
  policeDigitalCaseFiles: PoliceDigitalCaseFile[],
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
    date?: Date
    name: string
    pageNumber: number
    pageLink: PageLink
  }[] = []

  // Create the PDF document
  const pdfDocument = await PdfDocument(
    formatMessage(caseFilesRecord.title, { policeCaseNumber }),
  )

  pdfDocument.setMargins(pageMargin, pageMargin, pageMargin, pageMargin)

  // Add each case file to the document
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

    // Store reference for table of contents
    pageReferences.push({
      chapter,
      date,
      name,
      pageNumber: pageNumber + 1,
      pageLink: pdfDocument.getPageLink(pageNumber),
    })
  }

  // Add police digital case files pages (IDES)
  if (policeDigitalCaseFiles.length > 0) {
    const sortedFiles = [...policeDigitalCaseFiles].sort(
      (a, b) => (a.orderWithinChapter ?? 0) - (b.orderWithinChapter ?? 0),
    )
    const digitalCaseFilePages = addPoliceDigitalCaseFilesPage(
      pdfDocument,
      sortedFiles,
      formatMessage,
      pageMargin,
      textFontSize,
      subtitleFontSize,
    )

    for (const { file, pageIndex } of digitalCaseFilePages) {
      pageReferences.push({
        chapter: 5,
        date: file.displayDate,
        name: file.name,
        pageNumber: pageIndex + 1,
        pageLink: pdfDocument.getPageLink(pageIndex),
      })
    }
  }

  // Create the cover page
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

  // Add defendants
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

  // Add charge description
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

  // Add crime scene
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

  // Add table of contents heading
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

  // Add table of contents entries
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

    // Add chapter heading
    pdfDocument.addText(
      formatMessage(caseFilesRecord.chapterName, { chapter }),
      textFontSize,
      { bold: true, marginTop: chapter > 0 ? 4 : 0 },
    )

    // Add page references for each case file in the chapter
    for (const pageReference of pageReferences.filter(
      (pageReference) => pageReference.chapter === chapter,
    )) {
      // The line link must be captured with the same top margin as the date,
      // name and page number are drawn with. Otherwise the link can be
      // captured at the bottom of a page while the rest of the line overflows
      // to the next page, and stamping the page number at the link position
      // later inserts an extra page into the finished document.
      tableOfContentsLineReferences.push({
        lineLink: pdfDocument
          .addText('', textFontSize, { newLine: false, marginTop: 1 })
          .getCurrentLineLink(),
        pageNumber: pageReference.pageNumber,
        pageLink: pageReference.pageLink,
      })
      pdfDocument.addText(formatDate(pageReference.date) ?? '', textFontSize, {
        pageLink: pageReference.pageLink,
        newLine: false,
        position: { x: pageDateIndent },
      })

      // Split the name at whitespace into chunks of at most 40 characters,
      // hard-splitting runs longer than 40 characters, which would otherwise
      // not match and be silently dropped
      const nameChunks = pageReference.name.match(/.{1,40}(?=\s|$)|.{1,40}/g)

      // Add name in chunks of max 40 characters
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

  // Add page numbers to table of contents. The line links already include
  // the line's top margin, so no margin may be added here as that could
  // overflow the page and insert an extra page into the finished document.
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
        },
      )
  }

  // Add page numbers to all pages
  pdfDocument.addPageNumbers(tableOfContentsPageCount)

  return pdfDocument.getContents()
}
