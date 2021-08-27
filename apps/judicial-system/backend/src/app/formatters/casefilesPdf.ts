import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { CaseFile } from '../modules/file'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'

function constructCasefilesPdf(
  existingCase: Case,
  files: CaseFile[],
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
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .lineGap(40)
    .list(files, { listType: 'numbered' })

  setPageNumbers(doc)

  doc.end()

  return stream
}

export async function getCasefilesPdfAsString(
  existingCase: Case,
  caseFiles: CaseFile[],
): Promise<string> {
  const stream = constructCasefilesPdf(existingCase, caseFiles)

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
  caseFiles: CaseFile[],
): Promise<Buffer> {
  const stream = constructCasefilesPdf(existingCase, caseFiles)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  return pdf
}
