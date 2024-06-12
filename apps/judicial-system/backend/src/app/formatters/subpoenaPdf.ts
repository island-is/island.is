import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import {
  DistrictCourtLocation,
  DistrictCourts,
} from '@island.is/judicial-system/types'

import { subpoena as strings } from '../messages'
import { Case } from '../modules/case'
import {
  addEmptyLines,
  addFooter,
  addHugeHeading,
  addLargeHeading,
  addMediumText,
  addNormalRightAlignedText,
  addNormalText,
  setTitle,
} from './pdfHelpers'

export const createSubpoenaPDF = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> => {
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

  const sinc: Buffer[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, formatMessage(strings.title))
  addNormalText(doc, `${theCase.court?.name}`, 'Helvetica-Bold', true)
  // TODO: Display correct date
  addNormalRightAlignedText(
    doc,
    `${formatDate(new Date(), 'PPP')}`,
    'Helvetica',
  )

  if (theCase.court?.name) {
    addNormalText(
      doc,
      DistrictCourtLocation[theCase.court.name as DistrictCourts],
      'Helvetica',
    )
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    theCase.defendants &&
      theCase.defendants.length > 0 &&
      theCase.defendants[0].name
      ? `${
          theCase.defendants &&
          theCase.defendants.length > 0 &&
          theCase.defendants[0].name
            ? theCase.defendants[0].name
            : 'Nafn ekki skráð'
        }, ${formatDOB(
          theCase.defendants[0].nationalId,
          theCase.defendants[0].noNationalId,
        )}`
      : 'Nafn ekki skráð',
  )
  addNormalText(
    doc,
    theCase.defendants &&
      theCase.defendants.length > 0 &&
      theCase.defendants[0].address
      ? theCase.defendants[0].address
      : 'Heimili ekki skráð',
  )
  addEmptyLines(doc)
  addHugeHeading(
    doc,
    formatMessage(strings.title).toUpperCase(),
    'Helvetica-Bold',
  )
  addEmptyLines(doc)
  addMediumText(doc, 'Mál nr. S-2322/2021', 'Helvetica-Bold')
  addEmptyLines(doc)
  addNormalText(doc, 'Ákærandi: ', 'Helvetica-Bold', true)
  addNormalText(
    doc,
    theCase.prosecutor && theCase.prosecutor.institution
      ? theCase.prosecutor.institution.name
      : 'Ekki skráður',
    'Helvetica',
  )
  addNormalText(
    doc,
    theCase.prosecutor
      ? `                     (${theCase.prosecutor.name} ${theCase.prosecutor.title})`
      : 'Ekki skráður',
    'Helvetica',
  )
  addEmptyLines(doc)
  addNormalText(doc, 'Ákærði: ', 'Helvetica-Bold', true)
  addNormalText(
    doc,
    theCase.defendants &&
      theCase.defendants.length > 0 &&
      theCase.defendants[0].name
      ? theCase.defendants[0].name
      : 'Nafn ekki skráð',
    'Helvetica',
  )
  addEmptyLines(doc, 2)
  addNormalText(
    doc,
    formatMessage(strings.arraignmentDate, {
      // TODO: Display correct date
      arraignmentDate: formatDate(new Date(), 'PPP'),
    }),
    'Helvetica-Bold',
  )
  addNormalText(
    doc,
    formatMessage(strings.courtRoom, {
      // TODO: Display correct courtroom
      courtRoom: `191`,
    }),
    'Helvetica',
  )
  addNormalText(doc, formatMessage(strings.type), 'Helvetica')
  addEmptyLines(doc)
  addNormalText(doc, formatMessage(strings.intro), 'Helvetica-Bold')
  addNormalText(
    doc,
    'intro',
    // theCase.subpoenaType === SubpoenaType.ABSENCE
    //   ? strings.absenceIntro
    //   : strings.arrestIntro,
    'Helvetica-Bold',
  )
  addEmptyLines(doc)
  addNormalText(doc, formatMessage(strings.deadline), 'Helvetica')

  addFooter(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
