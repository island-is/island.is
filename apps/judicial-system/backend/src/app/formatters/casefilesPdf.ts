import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import {
  addHugeHeading,
  addLargeHeading,
  baseFontSize,
  setPageNumbers,
} from './pdfHelpers'
import { writeFile } from './writeFile'

function constructCasefilesPdf(
  theCase: Case,
): streamBuffers.WritableStreamBuffer {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 60,
      left: 50,
      right: 50,
    },
    bufferPages: true,
  })

  if (doc.info) {
    doc.info['Title'] = `Rannsóknargögn ${theCase.courtCaseNumber}`
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc.lineGap(8)
  addHugeHeading(doc, 'Helvetica-Bold', 'Rannsóknargögn')
  doc.lineGap(40)
  addLargeHeading(
    doc,
    'Helvetica',
    `Mál nr. ${theCase.courtCaseNumber} - LÖKE nr. ${theCase.policeCaseNumber}`,
  )
  doc
    .lineGap(8)
    .fontSize(baseFontSize)
    .list(theCase.caseFiles?.map((file) => file.name) ?? [], {
      listType: 'numbered',
    })

  setPageNumbers(doc)

  doc.end()

  return stream
}

export async function getCasefilesPdfAsString(theCase: Case): Promise<string> {
  const stream = constructCasefilesPdf(theCase)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-case-files.pdf`, pdf)
  }

  return pdf
}

export async function getCasefilesPdfAsBuffer(theCase: Case): Promise<Buffer> {
  const stream = constructCasefilesPdf(theCase)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-case-files.pdf`, pdf)
  }

  return pdf
}
