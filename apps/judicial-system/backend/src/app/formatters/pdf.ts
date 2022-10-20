import {
  layoutMultilineText,
  PDFDocument,
  PDFFont,
  PDFName,
  PDFPage,
  PDFRef,
  StandardFonts,
  TextAlignment,
} from 'pdf-lib'

export enum Alignment {
  Left,
  Center,
  Right,
}

export type PageLink = PDFRef

export interface PdfTextOptions {
  alignment?: Alignment
  bold?: boolean
  pageLink?: PageLink
  marginTop?: number
  newLine?: boolean
  position?: { x?: number; y?: number }
}

export interface PdfDocument {
  addPage: (position?: number) => PdfDocument
  addPageNumbers: () => PdfDocument
  addParagraph: (text: string, fontSize: number, x?: number) => PdfDocument
  addText: (
    text: string,
    fontSize: number,
    options?: PdfTextOptions,
  ) => PdfDocument
  getContents: () => Promise<Buffer>
  getPageCount: () => number
  getPageLink: (pageNumber: number) => PageLink
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
  const spacing = { line: 4, paragraph: 2 }

  let currentPage = -1
  let currentYPosition = -1

  const drawTextAbsolute = (
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    font: PDFFont,
    fontSize: number,
    pageLink?: PageLink,
  ) => {
    page.drawText(text, { x, y, font, size: fontSize })

    if (pageLink) {
      const annot = rawDocument.context.register(
        rawDocument.context.obj({
          Type: 'Annot',
          Subtype: 'Link',
          Rect: [
            x,
            y,
            x + font.widthOfTextAtSize(text, fontSize),
            y + fontSize,
          ],
          Dest: [pageLink, 'XYZ', null, null, null],
        }),
      )

      const annots = page.node.Annots()

      if (annots) {
        annots.push(annot)
      } else {
        page.node.set(PDFName.of('Annots'), rawDocument.context.obj([annot]))
      }
    }
  }

  const drawText = (
    text: string,
    font: PDFFont,
    fontSize: number,
    x?: number,
    y?: number,
    spaceAbove?: number,
    spaceBelow?: number,
    pageLink?: PageLink,
    newLine = true,
  ) => {
    const page = rawDocument.getPage(currentPage)

    if (y !== undefined) {
      currentYPosition = y
    } else if (
      currentYPosition + fontSize >
      page.getHeight() - margins.bottom
    ) {
      pdfDocument.addPage(currentPage + 1)
    } else {
      currentYPosition += (spaceAbove ?? 0) * spacing.line
    }

    drawTextAbsolute(
      page,
      text,
      x ?? margins.left,
      page.getHeight() - currentYPosition,
      font,
      fontSize,
      pageLink,
    )

    if (newLine) {
      currentYPosition += fontSize + (spaceBelow ?? spacing.line)
    }
  }

  const drawCenteredText = (
    text: string,
    font: PDFFont,
    fontSize: number,
    y?: number,
    spaceAbove?: number,
    spaceBelow?: number,
    pageLink?: PageLink,
    newLine = true,
  ) => {
    drawText(
      text,
      font,
      fontSize,
      (rawDocument.getPage(currentPage).getWidth() -
        font.widthOfTextAtSize(text, fontSize)) /
        2,
      y,
      spaceAbove,
      spaceBelow,
      pageLink,
      newLine,
    )
  }

  const pdfDocument = {
    addPage: (position = rawDocument.getPageCount()) => {
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

    addParagraph: (text: string, fontSize: number, x = margins.left) => {
      const page = rawDocument.getPage(currentPage)

      const multilineTextLayout = layoutMultilineText(text, {
        alignment: TextAlignment.Left,
        bounds: {
          x: 0,
          y: 0,
          width: page.getWidth() - x - margins.right,
          height: page.getHeight(),
        },
        font: normalFont,
        fontSize,
      })

      const indexOfLastLine = multilineTextLayout.lines.length - 1

      multilineTextLayout.lines.forEach((line, index) => {
        drawText(
          line.text,
          normalFont,
          fontSize,
          x,
          undefined,
          undefined,
          index < indexOfLastLine ? spacing.paragraph : undefined,
        )
      })

      return pdfDocument
    },

    addText: (text: string, fontSize: number, options?: PdfTextOptions) => {
      const {
        alignment = Alignment.Left,
        bold = false,
        pageLink,
        marginTop,
        newLine = true,
        position,
      } = options ?? {}
      const { x, y } = position ?? {}

      switch (alignment) {
        case Alignment.Left:
          drawText(
            text,
            bold ? boldFont : normalFont,
            fontSize,
            x,
            y,
            marginTop,
            undefined,
            pageLink,
            newLine,
          )
          break
        case Alignment.Center:
          drawCenteredText(
            text,
            bold ? boldFont : normalFont,
            fontSize,
            y,
            marginTop,
            undefined,
            pageLink,
            newLine,
          )
          break
        case Alignment.Right:
        // TODO: Implement
      }

      return pdfDocument
    },

    getContents: async () => {
      const bytes = await rawDocument.save()

      return Buffer.from(bytes)
    },

    getPageCount: () => rawDocument.getPageCount(),

    getPageLink: (pageNumber: number) => rawDocument.getPage(pageNumber).ref,

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
