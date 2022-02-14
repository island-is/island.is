import { PdfConstants } from './constants'

export const addToDoc = (
  doc: PDFKit.PDFDocument,
  font: string,
  fontSize: number,
  lineGap: number,
  text: string,
  continued = false,
  indent = 0,
) => {
  doc
    .font(font)
    .fontSize(fontSize)
    .lineGap(lineGap)
    .text(text, { continued, indent })
}

export const addHeader = (doc: PDFKit.PDFDocument, text: string) => {
  addToDoc(
    doc,
    PdfConstants.BOLD_FONT,
    PdfConstants.HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    text,
  )
}
export const addSubHeader = (doc: PDFKit.PDFDocument, text: string) => {
  addToDoc(
    doc,
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    text,
  )
}

export const addFormField = (
  doc: PDFKit.PDFDocument,
  fieldName: string,
  fieldValue: string,
  lineGap: number = PdfConstants.NO_LINE_GAP,
) => {
  addToDoc(
    doc,
    PdfConstants.BOLD_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    0,
    `${fieldName} `,
    true,
    10,
  )
  addToDoc(
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    lineGap,
    fieldValue,
  )
}

export const addText = (
  doc: PDFKit.PDFDocument,
  text: string,
  lineGap: number = PdfConstants.NO_LINE_GAP,
) => {
  addToDoc(
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    lineGap,
    text,
  )
}
