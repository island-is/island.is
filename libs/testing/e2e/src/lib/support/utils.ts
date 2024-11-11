import { debuglog } from 'util'
import fs from 'fs-extra'
import path from 'path'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const createMockPdf = () => {
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

export const deleteMockPdf = () => {
  fs.unlink('./mockPdf.pdf', (err) => {
    if (err) throw err
    debug('Successfully deleted mockPdf file.')
  })
}

// Set NODE_DEBUG=system-e2e in your environment when testing to show debug messages
export const debug = (msg: string, ...args: unknown[]) => {
  debuglog('system-e2e')(msg, ...args)
}
