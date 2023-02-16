import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import { formatDate, lowercase } from '@island.is/judicial-system/formatters'

import { Case } from '../modules/case'
import { nowFactory } from '../factories'
import { indictment } from '../messages'
import {
  addEmptyLines,
  addGiganticHeading,
  addNormalText,
  setTitle,
} from './pdfHelpers'
import { setLineCap } from 'pdf-lib'

export const createIndictment = async (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 70,
      bottom: 70,
      left: 70,
      right: 70,
    },
    bufferPages: true,
  })

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  const title = formatMessage(indictment.title)

  setTitle(doc, title)

  addGiganticHeading(doc, title, 'Times-Roman')
  addNormalText(doc, ' ')
  setLineCap(4)
  addNormalText(doc, theCase.indictmentIntroduction || '')
  addEmptyLines(doc, 2)
  addNormalText(doc, theCase.demands || '')
  addEmptyLines(doc, 2)
  addNormalText(
    doc,
    formatMessage(
      indictment.signature,
      {
        prosecutorsOfficeName:
          lowercase(theCase.creatingProsecutor?.institution?.name)
            .replace('lögreglustjórinn', 'lögreglustjórans')
            .replace('saksóknari', 'saksóknara') ?? '',
        date: formatDate(nowFactory(), 'PPP'),
      } ?? '',
    ),
  )

  doc.end()

  return new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })
}
