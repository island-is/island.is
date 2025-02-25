import {
  ComplaineeTypes,
  ComplainedForTypes,
  ComplaintsToAlthingiOmbudsmanAnswers,
  OmbudsmanComplaintTypeEnum,
} from '@island.is/application/templates/complaints-to-althingi-ombudsman'
import { Application } from '@island.is/application/types'
import { addHeader, addSubheader, addValue, newDocument } from '../pdfUtils'
import { format as formatNationalId } from 'kennitala'
import { PdfConstants } from '../constants'
import { YES } from '@island.is/application/core'

export const generateComplaintPdf = async (application: Application) => {
  const answers = application.answers as ComplaintsToAlthingiOmbudsmanAnswers
  const complainedFor =
    answers.complainedFor.decision === ComplainedForTypes.MYSELF
      ? 'Mig'
      : 'Annan'
  const doc = newDocument()
  const buffers: Buffer[] = []

  doc.on('data', (buffer: Buffer) => {
    buffers.push(buffer)
  })

  addHeader('Kvörtun til umboðsmanns Alþingis', doc)

  addValue(
    `${answers.applicant.name}, ${formatNationalId(
      answers.applicant.nationalId,
    )}`,
    doc,
  )
  addValue(
    `${answers.applicant.address}, ${answers.applicant.city} ${answers.applicant.postalCode}`,
    doc,
  )
  addValue(answers.applicant.email, doc)
  addValue(
    answers.applicant.phoneNumber,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  addSubheader('Kvartað fyrir', doc)
  addValue(
    `${complainedFor}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  if (answers.complainedFor.decision === ComplainedForTypes.SOMEONEELSE) {
    addSubheader('Tengsl við þann aðila', doc)
    addValue(
      answers.complainedForInformation.connection,
      doc,
      PdfConstants.NORMAL_FONT,
      PdfConstants.NORMAL_LINE_GAP,
    )

    addSubheader('Kvartað fyrir', doc)
    addValue(
      `${answers.complainedForInformation.name}, ${formatNationalId(
        answers.complainedForInformation.nationalId,
      )}`,
      doc,
    )
    addValue(
      `${answers.complainedForInformation.address}, ${answers.complainedForInformation.city} ${answers.complainedForInformation.postalCode}`,
      doc,
    )
    addValue(`${answers.complainedForInformation.phoneNumber ?? ''}`, doc)
    addValue(
      `${answers.complainedForInformation.email ?? ''}`,
      doc,
      PdfConstants.NORMAL_FONT,
      PdfConstants.NORMAL_LINE_GAP,
    )
    doc.moveDown()
  }
  addSubheader('Kvörtunin varðar', doc)
  addValue(
    `${
      answers.complaintType === OmbudsmanComplaintTypeEnum.DECISION
        ? 'Kvörtunin varðar ákvörðun eða úrskurð stjórnvalds'
        : 'Kvörtunin varðar málsmeðferð eða aðra athöfn stjórnvalds'
    }`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  addSubheader('Kvörtunin beinist að', doc)
  addValue(
    `${
      answers.complainee.type === ComplaineeTypes.GOVERNMENT
        ? 'Kvörtunin beinist að stjórnvaldi'
        : 'Kvörtunin beinist að öðrum aðila eða starfsmanni stjórnsýslunnar'
    }`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  addSubheader(
    `Nafn ${
      answers.complainee.type === ComplaineeTypes.GOVERNMENT
        ? 'stjórnvalds'
        : 'aðila'
    }`,
    doc,
  )
  addValue(
    answers.complaintDescription.complaineeName,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  addSubheader('Lýsing', doc)
  addValue(
    answers.complaintDescription.complaintDescription ?? '',
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  if (answers.complaintDescription.decisionDate) {
    addSubheader('Dagsetning', doc)
    addValue(
      answers.complaintDescription.decisionDate ?? '',
      doc,
      PdfConstants.NORMAL_FONT,
      PdfConstants.NORMAL_LINE_GAP,
    )
  }

  addSubheader('Hafa kæruleiðir verið nýttar', doc)
  addValue(
    `${answers.preexistingComplaint === YES ? 'Já' : 'Nei'}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  addSubheader('Hefur málið verið lagt fyrir dómstóla', doc)
  addValue(
    `${answers.courtActionAnswer === YES ? 'Já' : 'Nei'}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  addSubheader('Leitað áður til Umboðsmanns Alþingis', doc)
  addValue(
    `${answers.previousOmbudsmanComplaint.Answer === YES ? 'Já' : 'Nei'}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  if (answers.previousOmbudsmanComplaint.Answer === YES) {
    addSubheader('Lýsing', doc)
    addValue(
      `${answers.previousOmbudsmanComplaint.moreInfo}`,
      doc,
      PdfConstants.NORMAL_FONT,
      PdfConstants.NORMAL_LINE_GAP,
    )
  }

  addSubheader('Rökstuðningur kvörtunar og önnur fylgiskjöl', doc)
  if (
    answers.attachments?.documents &&
    answers.attachments?.documents?.length > 0
  ) {
    answers.attachments?.documents?.map((document) => {
      addValue(`${document.name}`, doc)
    })
  } else {
    addValue('Engum fylgiskjölum var skilað', doc)
  }

  doc.end()
  await new Promise((resolve) => {
    doc.on('end', resolve)
  })
  return Buffer.concat(buffers)
}
