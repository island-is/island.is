import { PdfConstants } from './constants'
import PDFDocument from 'pdfkit'

export const formatSsn = (ssn: string) => {
  return ssn.replace(/(\d{6})(\d+)/, '$1-$2')
}

const addToDoc = (
  font: string,
  fontSize: number,
  lineGap: number,
  text: string,
  doc: PDFKit.PDFDocument,
) => {
  doc.font(font).fontSize(fontSize).lineGap(lineGap).text(text)
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
