import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'
import {
  DateType,
  DistrictCourtLocation,
  DistrictCourts,
  SubpoenaType,
} from '@island.is/judicial-system/types'

import { subpoena as strings } from '../messages'
import { Case } from '../modules/case'
import { Defendant } from '../modules/defendant'
import {
  addEmptyLines,
  addFooter,
  addHugeHeading,
  addMediumText,
  addNormalRightAlignedText,
  addNormalText,
  setTitle,
} from './pdfHelpers'

export const createSubpoenaPDF = (
  theCase: Case,
  formatMessage: FormatMessage,
  defendant?: Defendant,
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

  if (!defendant) {
    return Promise.reject('Defendant is missing')
  }

  const sinc: Buffer[] = []
  const arraignmentDate = theCase.dateLogs?.find(
    (d) => d.dateType === DateType.ARRAIGNMENT_DATE,
  )

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, formatMessage(strings.title))
  addNormalText(doc, `${theCase.court?.name}`, 'Times-Bold', true)

  if (arraignmentDate) {
    addNormalRightAlignedText(
      doc,
      `${formatDate(new Date(arraignmentDate.created), 'PPP')}`,
      'Times-Roman',
    )
  }

  if (theCase.court?.name) {
    addNormalText(
      doc,
      DistrictCourtLocation[theCase.court.name as DistrictCourts],
      'Times-Roman',
    )
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    defendant.name
      ? `${defendant.name}, ${formatDOB(
          defendant.nationalId,
          defendant.noNationalId,
        )}`
      : 'Nafn ekki skráð',
  )
  addNormalText(doc, defendant.address || 'Heimili ekki skráð')
  addEmptyLines(doc)
  addHugeHeading(doc, formatMessage(strings.title).toUpperCase(), 'Times-Bold')
  addEmptyLines(doc)
  addMediumText(doc, `Mál nr. ${theCase.courtCaseNumber}`, 'Times-Bold')
  addEmptyLines(doc)
  addNormalText(doc, 'Ákærandi: ', 'Times-Bold', true)
  addNormalText(
    doc,
    theCase.prosecutor?.institution
      ? theCase.prosecutor.institution.name
      : 'Ekki skráður',
    'Times-Roman',
  )
  addNormalText(
    doc,
    theCase.prosecutor
      ? `                     (${theCase.prosecutor.name} ${theCase.prosecutor.title})`
      : 'Ekki skráður',
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(doc, 'Ákærði: ', 'Times-Bold', true)
  addNormalText(doc, defendant.name || 'Nafn ekki skráð', 'Times-Roman')
  addEmptyLines(doc, 2)

  if (arraignmentDate?.date) {
    addNormalText(
      doc,
      formatMessage(strings.arraignmentDate, {
        arraignmentDate: formatDate(new Date(arraignmentDate.date), 'PPP'),
      }),
      'Times-Bold',
    )
  }

  if (arraignmentDate?.location) {
    addNormalText(
      doc,
      formatMessage(strings.courtRoom, {
        courtRoom: arraignmentDate.location,
      }),
      'Times-Roman',
    )
  }

  addNormalText(doc, formatMessage(strings.type), 'Times-Roman')
  addEmptyLines(doc)
  addNormalText(doc, formatMessage(strings.intro), 'Times-Bold')
  addNormalText(
    doc,
    formatMessage(
      defendant.subpoenaType === SubpoenaType.ABSENCE
        ? strings.absenceIntro
        : strings.arrestIntro,
    ),
    'Times-Bold',
  )

  addEmptyLines(doc)
  addNormalText(doc, formatMessage(strings.deadline), 'Times-Roman')

  addFooter(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
