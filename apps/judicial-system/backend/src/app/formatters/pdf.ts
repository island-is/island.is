import { PDFDocument, PDFFont, PDFPage, StandardFonts } from 'pdf-lib'

export interface PdfDocument {
  rawDocument: PDFDocument
  mergeDocument: (buffer: Buffer) => Promise<PdfDocument>
  addPageNumbers: () => PdfDocument
  getContents: () => Promise<Buffer>
}

export const PdfDocument = async (title?: string): Promise<PdfDocument> => {
  const rawDocument = await PDFDocument.create()
  title && rawDocument.setTitle(title)
  const normalFont = await rawDocument.embedFont(StandardFonts.TimesRoman)
  const boldFont = await rawDocument.embedFont(StandardFonts.TimesRomanBold)

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

  const pdfDocument = {
    rawDocument: rawDocument,

    mergeDocument: async (buffer: Buffer) => {
      const filePdfDoc = await PDFDocument.load(buffer)

      const pages = await rawDocument.copyPages(
        filePdfDoc,
        filePdfDoc.getPageIndices(),
      )

      pages.forEach((page) => rawDocument.addPage(page))

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

    getContents: async () => {
      const bytes = await rawDocument.save()

      return Buffer.from(bytes)
    },
  }

  return pdfDocument
}
