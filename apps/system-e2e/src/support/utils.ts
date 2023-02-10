import PDFDocument from 'pdfkit'
import fs from 'fs'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function createMockPdf() {
  const doc = new PDFDocument()
  doc.text('test')
  doc.save()
  doc.pipe(fs.createWriteStream('./mockPdf.pdf'))
  doc.end()
}

export function deleteMockPdf() {
  fs.unlink('./mockPdf.pdf', () =>
    console.log('Failed to delete mockPdf file.'),
  )
}
