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

interface TextOptions {
  alignment?: Alignment
  bold?: boolean
  pageLink?: PageLink
  marginTop?: number
  marginBottom?: number
  maxWidth?: number
  newLine?: boolean
  position?: { x?: number; y?: number }
}

export enum Alignment {
  Left,
  Center,
  Right,
}

export type PageLink = PDFRef

export interface LineLink {
  pageNumber: number
  y: number
}

export interface PdfDocument {
  addPage: (position?: number) => PdfDocument
  addPageNumbers: () => PdfDocument
  addParagraph: (text: string, fontSize: number, x?: number) => PdfDocument
  addText: (
    text: string,
    fontSize: number,
    options?: TextOptions,
  ) => PdfDocument
  getContents: () => Promise<Buffer>
  getCurrentLineLink: () => LineLink
  getPageCount: () => number
  getPageLink: (pageNumber: number) => PageLink
  mergeDocument: (buffer: Buffer) => Promise<PdfDocument>
  setCurrentLine: (lineLink: LineLink) => PdfDocument
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
  const scalePageIndexes: number[] = []

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
    x: number,
    y?: number,
    spaceAbove = 0,
    spaceBelow = spacing.line,
    pageLink?: PageLink,
    newLine = true,
  ) => {
    let page = rawDocument.getPage(currentPage)

    if (y !== undefined) {
      currentYPosition = y
    } else if (
      currentYPosition + spaceAbove * spacing.line + fontSize >
      page.getHeight() - margins.bottom
    ) {
      pdfDocument.addPage(currentPage + 1)
      page = rawDocument.getPage(currentPage)
    } else {
      currentYPosition += spaceAbove * spacing.line
    }

    drawTextAbsolute(
      page,
      text,
      x,
      page.getHeight() - currentYPosition,
      font,
      fontSize,
      pageLink,
    )

    if (newLine) {
      currentYPosition += fontSize + spaceBelow
    }
  }

  const getPageNumberPosition = (
    page: PDFPage,
    textWidth: number,
    fontSize: number,
  ) => {
    const { width, height } = page.getSize()
    const scale = width > 1000 && height > 1000 ? 5 : 1

    return {
      x: page.getWidth() - 10 - textWidth - (scale > 1 ? 70 : 0),
      y: 15 + (scale > 1 ? 60 : 0),
      scaledFontSize: fontSize * scale,
    }
  }

  const scaleToA4 = (page: PDFPage) => {
    const { width, height } = page.getSize()
    const targetWidth = 595.28 // A4 width in points
    const targetHeight = 841.89 // A4 height in points
    const scaleX = targetWidth / width
    const scaleY = targetHeight / height
    const scale = Math.min(scaleX, scaleY)

    page.scaleContent(scale, scale)
    page.setSize(targetWidth, targetHeight)

    return page
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

      rawDocument.getPages().forEach((page, index) => {
        const pageNumberText = `${++pageNumber}`
        const pageNumberTextWidth = boldFont.widthOfTextAtSize(
          pageNumberText,
          pageNumberFontSize,
        )
        const pageIsScaled = scalePageIndexes.includes(index - 1)

        drawTextAbsolute(
          page,
          pageNumberText,
          (page.getWidth() - pageNumberRightMargin - pageNumberTextWidth) *
            (pageIsScaled ? 5 : 1),
          pageNumberBottomMargin * (pageIsScaled ? 4.5 : 1),
          boldFont,
          pageNumberFontSize * (pageIsScaled ? 4.5 : 1),
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

    addText: (text: string, fontSize: number, options?: TextOptions) => {
      const {
        alignment = Alignment.Left,
        bold = false,
        pageLink,
        marginTop,
        marginBottom,
        maxWidth,
        newLine = true,
        position,
      } = options ?? {}
      let { x } = position ?? {}
      const { y } = position ?? {}
      const font = bold ? boldFont : normalFont

      if (maxWidth && font.widthOfTextAtSize(text, fontSize) > maxWidth) {
        while (
          text.length > 0 &&
          font.widthOfTextAtSize(`${text}...`, fontSize) > maxWidth
        ) {
          text = text.slice(0, -1)
        }
        text = `${text}...`
      }

      switch (alignment) {
        case Alignment.Left:
          x = x ?? margins.left
          break
        case Alignment.Center:
          x =
            (rawDocument.getPage(currentPage).getWidth() -
              font.widthOfTextAtSize(text, fontSize)) /
            2
          break
        case Alignment.Right:
          x =
            rawDocument.getPage(currentPage).getWidth() -
            (x ?? margins.right) -
            font.widthOfTextAtSize(text, fontSize)
      }

      drawText(
        text,
        font,
        fontSize,
        x,
        y,
        marginTop,
        marginBottom,
        pageLink,
        newLine,
      )

      return pdfDocument
    },

    getContents: async () => {
      const bytes = await rawDocument.save()

      return Buffer.from(bytes)
    },

    getCurrentLineLink: () => ({
      pageNumber: currentPage,
      y: currentYPosition,
    }),

    getPageCount: () => rawDocument.getPageCount(),

    getPageLink: (pageNumber: number) => rawDocument.getPage(pageNumber).ref,

    mergeDocument: async (buffer: Buffer) => {
      const filePdfDoc = await PDFDocument.load(new Uint8Array(buffer))

      const pages = await rawDocument.copyPages(
        filePdfDoc,
        filePdfDoc.getPageIndices(),
      )

      pages.forEach((page) => {
        const { width } = page.getSize()

        if (width > 1000) {
          scalePageIndexes.push(rawDocument.getPageCount())
        }

        rawDocument.addPage(scaleToA4(page))
      })
      return pdfDocument
    },

    setCurrentLine: (lineLink: LineLink) => {
      currentPage = lineLink.pageNumber
      currentYPosition = lineLink.y

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
