import { add } from 'lodash'
import PDFDocument from 'pdfkit'

import {
  applyDativeCaseToCourtName,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { User } from '@island.is/judicial-system/types'

import { nowFactory } from '../factories'
import { Case } from '../modules/repository'
import {
  addCoatOfArms,
  addEmptyLines,
  addLargeHeading,
  addMediumHeading,
  addNormalText,
  setLineGap,
  setTitle,
} from './pdfHelpers'

export const createIndictmentCourtRecordPdf = (
  theCase: Case,
  user?: User,
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

  const sinc: Uint8Array[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, `Þingbók ${theCase.courtCaseNumber}`)
  addCoatOfArms(doc)
  addEmptyLines(doc, 4)
  setLineGap(doc, 2)
  addLargeHeading(doc, theCase.court?.name ?? 'Héraðsdómur', 'Times-Roman')
  addMediumHeading(doc, 'Þingbók')
  addMediumHeading(doc, `Mál nr. ${theCase.courtCaseNumber}`)

  for (const courtSession of theCase.courtSessions ?? []) {
    if (!courtSession.endDate) {
      break
    }

    addEmptyLines(doc, 2)
    addNormalText(
      doc,
      `Þann ${formatDate(
        courtSession.startDate ?? nowFactory(),
        'PPP',
      )} heldur ${
        theCase.judge?.name ?? 'óþekktur'
      } héraðsdómari dómþing í ${applyDativeCaseToCourtName(
        theCase.court?.name ?? 'héraðsdómi',
      )}. Fyrir er tekið mál nr. ${
        theCase.courtCaseNumber ?? 'S-xxxx/yyyy'
      }. Þinghald hefst kl. ${formatDate(
        courtSession.startDate ?? nowFactory(),
        'p',
      )}.`,
    )

    if (courtSession.isClosed) {
      const subparagraphs =
        courtSession.closedLegalProvisions &&
        courtSession.closedLegalProvisions.length > 0
          ? `${courtSession.closedLegalProvisions
              ?.map((p) => p.slice(-1).toLowerCase())
              .sort()
              .join('-, ')
              .replace(/-, (?!.*-, )/, '- og ')}-lið `
          : ''

      addEmptyLines(doc)
      addNormalText(
        doc,
        `Þinghaldið er háð fyrir luktum dyrum sbr. ${subparagraphs}10. gr. laga um meðferð sakamála nr. 88/2008.`,
      )
    }

    addEmptyLines(doc)
    addNormalText(
      doc,
      `Sóknaraðili er ${theCase.prosecutorsOffice?.name ?? 'óþekktur'}.`,
    )
    addNormalText(
      doc,
      `Varnaraðili er ${theCase.defendants?.[0].name ?? 'óþekktur'}.`,
    )
  }

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
