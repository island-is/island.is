import { PDFDocument } from 'pdf-lib'

export type PdfDocument = PDFDocument

export const PdfDocument = async (): Promise<PdfDocument> => {
  return PDFDocument.create()
}
