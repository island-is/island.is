import { PDFDocument, PDFFont, PDFPage, StandardFonts } from 'pdf-lib'

export interface PdfDocument {
  rawDocument: PDFDocument
  addPage: (position: number) => PdfDocument
  addPageNumbers: () => PdfDocument
  addTextBold: (
    text: string,
    fontSize: number,
    position?: { x?: number; y?: number },
  ) => PdfDocument
  getContents: () => Promise<Buffer>
  mergeDocument: (buffer: Buffer) => Promise<PdfDocument>
  setMargins: (
    top: number,
    right: number,
    bottom: number,
    left: number,
  ) => PdfDocument
}

export const PdfDocument = async (title?: string): Promise<PdfDocument> => {
  const rawDocument = await PDFDocument.create()
  if (title) {
    rawDocument.setTitle(title)
  }

  const normalFont = await rawDocument.embedFont(StandardFonts.TimesRoman)
  const boldFont = await rawDocument.embedFont(StandardFonts.TimesRomanBold)

  const margins = { top: 0, right: 0, bottom: 0, left: 0 }
  const spacing = { line: 2, paragraph: 4 }

  let currentPage = -1
  let currentYPosition = -1

  const drawTextAbsolute = (
    page: PDFPage,
    text: string,
    s: number,
    y: number,
    font: PDFFont,
    fontSize: number,
  ) => {
    page.drawText(text, {
      x: s,
      y: y,
      font: font,
      size: fontSize,
    })
  }

  const drawText = (
    text: string,
    font: PDFFont,
    fontSize: number,
    x?: number,
    y?: number,
    spaceBelow?: number,
  ) => {
    const page = rawDocument.getPage(currentPage)

    if (y !== undefined) {
      currentYPosition = y
    } else if (
      currentYPosition + fontSize >
      page.getHeight() - margins.bottom
    ) {
      pdfDocument.addPage(currentPage + 1)
    }

    drawTextAbsolute(
      page,
      text,
      x ?? margins.left,
      page.getHeight() - currentYPosition,
      font,
      fontSize,
    )
    currentYPosition += fontSize + (spaceBelow ?? spacing.paragraph)
  }

  const pdfDocument = {
    rawDocument: rawDocument,

    addPage: (position: number) => {
      rawDocument.insertPage(position)

      currentPage = position
      currentYPosition = margins.top

      return pdfDocument
    },

    addPageNumbers: () => {
      const pageNumberRightMargin = 10
      const pageNumberBottomMargin = 15
      const pageNumberFontSize = 20

      let pageNumber = 0

      rawDocument.getPages().forEach((page) => {
        const pageNumberText = `${++pageNumber}`
        const pageNumberTextWidth = boldFont.widthOfTextAtSize(
          pageNumberText,
          pageNumberFontSize,
        )

        drawTextAbsolute(
          page,
          pageNumberText,
          page.getWidth() - pageNumberRightMargin - pageNumberTextWidth,
          pageNumberBottomMargin,
          boldFont,
          pageNumberFontSize,
        )
      })

      return pdfDocument
    },

    addTextBold: (
      text: string,
      fontSize: number,
      position?: { x?: number; y?: number },
    ) => {
      drawText(text, boldFont, fontSize, position?.x, position?.y)

      return pdfDocument
    },

    getContents: async () => {
      const bytes = await rawDocument.save()

      return Buffer.from(bytes)
    },

    mergeDocument: async (buffer: Buffer) => {
      const filePdfDoc = await PDFDocument.load(buffer)

      const pages = await rawDocument.copyPages(
        filePdfDoc,
        filePdfDoc.getPageIndices(),
      )

      pages.forEach((page) => rawDocument.addPage(page))

      return pdfDocument
    },

    setMargins: (top: number, right: number, bottom: number, left: number) => {
      margins.top = top
      margins.right = right
      margins.bottom = bottom
      margins.left = left

      return pdfDocument
    },
  }

  return pdfDocument
}
