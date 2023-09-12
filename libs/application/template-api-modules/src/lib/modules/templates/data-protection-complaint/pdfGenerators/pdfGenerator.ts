import PDFDocument from 'pdfkit'
import { PdfConstants } from './constants'

type generatePdfBody<T> = (template: T, doc: PDFKit.PDFDocument) => void

export async function generatePdf<T>(
  template: T,
  generatePdfBody: generatePdfBody<T>,
): Promise<Buffer> {
  const doc = new PDFDocument({
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })

  const buffers: Buffer[] = []

  doc.on('data', (buffer: Buffer) => {
    buffers.push(buffer)
  })

  // Generate content for the PDF.
  generatePdfBody(template, doc)

  await new Promise((resolve) => {
    doc.on('end', resolve)
  })

  return Buffer.concat(buffers)
}
