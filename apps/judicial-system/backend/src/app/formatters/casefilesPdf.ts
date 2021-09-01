import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'

function constructCasefilesPdf(
  existingCase: Case,
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
    doc.info['Title'] = `Rannsóknargögn ${existingCase.courtCaseNumber}`
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text('Rannsóknargögn', { align: 'center' })
    .font('Helvetica')
    .fontSize(18)
    .lineGap(40)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .lineGap(8)
    .fontSize(12)
    .list(existingCase.caseFiles?.map((file) => file.name) ?? [], {
      listType: 'numbered',
    })

  setPageNumbers(doc)

  doc.end()

  return stream
}

export async function getCasefilesPdfAsString(
  existingCase: Case,
): Promise<string> {
  const stream = constructCasefilesPdf(existingCase)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-case-files.pdf`, pdf)
  }

  return pdf
}

export async function getCasefilesPdfAsBuffer(
  existingCase: Case,
): Promise<Buffer> {
  const stream = constructCasefilesPdf(existingCase)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  return pdf
}
