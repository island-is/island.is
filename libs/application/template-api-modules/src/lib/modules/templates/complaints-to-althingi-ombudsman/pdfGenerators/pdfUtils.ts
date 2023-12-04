import { PdfConstants } from './constants'
import PDFDocument from 'pdfkit'

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

const addToDoc = (
  font: string,
  fontSize: number,
  lineGap: number,
  text: string,
  doc: PDFKit.PDFDocument,
) => {
  doc.font(font).fontSize(fontSize).lineGap(lineGap).text(text)
}
