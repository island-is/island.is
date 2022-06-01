import { PdfConstants } from './constants'
import PDFDocument from 'pdfkit'

const addToDoc = (
  font: string,
  fontSize: number,
  lineGap: number,
  text: string,
  doc: PDFKit.PDFDocument,
  align: 'left' | 'right' | 'center' | 'justify' = 'left',
  textWidth: number | undefined = undefined,
  indent: number | undefined = undefined,
) => {
  doc.font(font).fontSize(fontSize).lineGap(lineGap).text(text, {
    align,
    width: textWidth,
    indent,
  })
}

export const formatSsn = (ssn: string) => {
  return ssn.replace(/(\d{6})(\d+)/, '$1-$2')
}

export const addHeader = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.BOLD_FONT,
  lineGap = PdfConstants.NORMAL_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.HEADER_FONT_SIZE, lineGap, text, doc)
}

export const addSubheader = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.BOLD_FONT,
  lineGap = PdfConstants.NORMAL_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.SUB_HEADER_FONT_SIZE, lineGap, text, doc)
}

export const addValue = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.NORMAL_FONT,
  lineGap = PdfConstants.NO_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.VALUE_FONT_SIZE, lineGap, text, doc)
}

export const addformFieldAndValue = (
  field: string,
  value: string,
  doc: PDFKit.PDFDocument,
  lineGap = PdfConstants.NO_LINE_GAP,
) => {
  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    lineGap,
    field,
    doc,
    'left',
    150,
  )
  doc.moveUp()
  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    lineGap,
    value,
    doc,
    'left',
    undefined,
    200,
  )
}

export const lineDivider = (doc: PDFKit.PDFDocument) => {
  doc
    .strokeColor('#808080')
    .lineWidth(1)
    .moveTo(PdfConstants.HORIZONTAL_MARGIN, doc.y)
    .lineTo(PdfConstants.HORIZONTAL_MARGIN + 500, doc.y)
    .stroke()
}

export const addSubtitle = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.NORMAL_FONT,
  lineGap = PdfConstants.SMALL_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.SMALL_FONT_SIZE, lineGap, text, doc)
}

export const newDocument = () => {
  return new PDFDocument({
    size: PdfConstants.PAGE_SIZE,
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })
}

export const addList = (
  list: string[] | PDFKit.PDFDocument[],
  doc: PDFKit.PDFDocument,
) => {
  doc
    .fillColor('#000')
    .font(PdfConstants.NORMAL_FONT)
    .fontSize(PdfConstants.VALUE_FONT_SIZE)
    .list(list)
}

export const addLogo = (doc: PDFKit.PDFDocument, logo: string) => {
  doc
    .image(
      logo,
      doc.page.width -
        PdfConstants.HORIZONTAL_MARGIN -
        PdfConstants.IMAGE_WIDTH,
      PdfConstants.VERTICAL_MARGIN,
      {
        fit: [PdfConstants.IMAGE_WIDTH, PdfConstants.IMAGE_HEIGHT],
        align: 'right',
      },
    )
    .moveDown()
}

export const setPageHeader = (
  doc: PDFKit.PDFDocument,
  text: string,
  weight = PdfConstants.NORMAL_FONT,
  lineGap = PdfConstants.SMALL_LINE_GAP,
) => {
  doc
    .font(weight)
    .fontSize(PdfConstants.SMALL_FONT_SIZE)
    .lineGap(lineGap)
    .text(text, PdfConstants.HORIZONTAL_MARGIN, PdfConstants.VERTICAL_MARGIN, {
      align: 'left',
    })
    .moveDown()
}
