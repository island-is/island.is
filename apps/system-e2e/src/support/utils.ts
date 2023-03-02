//import PDFDocument from 'pdfkit'
import fs from 'fs'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function createMockPdf() {
  fs.writeFile('./mockPdf.pdf', "test", (e: any) => { throw e })
  /*
  const doc = new PDFDocument()
  doc.text('test')
  doc.save()
  doc.pipe(fs.createWriteStream('./mockPdf.pdf'))
  doc.end()
  */
}

export function deleteMockPdf() {
  fs.unlink('./mockPdf.pdf', (err) => {
    if (err) throw err
    console.log('Successfully deleted mockPdf file.')
  })
}
