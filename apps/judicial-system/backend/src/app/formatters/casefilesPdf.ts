import { FormatMessage } from '@island.is/cms-translations'
import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { environment } from '../../environments'
import { Case } from '../modules/case'
import {
  addHugeHeading,
  addLargeHeading,
  addNumberedList,
  setLineGap,
  addFooter,
  setTitle,
} from './pdfHelpers'
import { writeFile } from './writeFile'
import { casefilesPdf as m } from '../messages/pdfCasefiles'

function constructCasefilesPdf(
  theCase: Case,
  formatMessage: FormatMessage,
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

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  setTitle(
    doc,
    formatMessage(m.title, { courtCaseNumber: theCase.courtCaseNumber }),
  )
  setLineGap(doc, 8)
  addHugeHeading(doc, formatMessage(m.heading), 'Helvetica-Bold')
  setLineGap(doc, 40)
  addLargeHeading(
    doc,
    formatMessage(m.courtCaseNumber, {
      courtCaseNumber: theCase.courtCaseNumber,
    }),
    'Helvetica',
  )
  setLineGap(doc, 8)
  addNumberedList(doc, theCase.caseFiles?.map((file) => file.name) ?? [])
  addFooter(doc)

  doc.end()

  return stream
}

export async function getCasefilesPdfAsString(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructCasefilesPdf(theCase, formatMessage)

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

export async function getCasefilesPdfAsBuffer(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> {
  const stream = constructCasefilesPdf(theCase, formatMessage)

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
