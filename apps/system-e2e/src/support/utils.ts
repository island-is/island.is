//import PDFDocument from 'pdfkit'
import { debuglog } from 'util'
import fs from 'fs'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function createMockPdf() {
  fs.writeFile('./mockPdf.pdf', 'test', (e) => {
    throw e
  })
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
    debug('Successfully deleted mockPdf file.')
  })
}

// Set NODE_DEBUG=system-e2e in your environment when testing to show debug messages
export function debug(msg: string, ...args: unknown[]) {
  debuglog('system-e2e')(msg, ...args)
}
