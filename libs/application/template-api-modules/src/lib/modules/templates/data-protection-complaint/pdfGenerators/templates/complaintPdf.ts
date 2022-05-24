import { ComplaintPDF } from '../../models'

import { Application } from '@island.is/application/core'
import { applicationToComplaintPDF } from '../../data-protection-utils'
import { generatePdf } from '../pdfGenerator'
import { messages } from '@island.is/application/templates/data-protection-complaint'
import {
  addformFieldAndValue,
  addHeader,
  addLogo,
  addSubheader,
  addValue,
  formatSsn,
  setPageHeader,
} from '../pdfUtils'
import { PdfConstants } from '../constants'
import { dataProtectionLogo } from '../assets/logo'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import { OnBehalf } from '@island.is/application/templates/data-protection-complaint'
import { DocumentInfo } from '@island.is/clients/data-protection-complaint'

export async function generateComplaintPdf(
  application: Application,
  attachedFiles: DocumentInfo[],
): Promise<Buffer> {
  const dto = applicationToComplaintPDF(application, attachedFiles)
  return await generatePdf<ComplaintPDF>(dto, dpcApplicationPdf)
}

function dpcApplicationPdf(
  complaint: ComplaintPDF,
  doc: PDFKit.PDFDocument,
): void {
  const timestamp = format(
    parseISO(complaint.submitDate.toISOString()),
    'd. MMMM y',
    {
      locale: is,
    },
  )
  setPageHeader(doc, timestamp)
  addLogo(doc, dataProtectionLogo)

  addHeader('Kvörtun til Persónuverndar', doc)

  renderContactsAndComplainees(complaint, doc)

  addSubheader(
    'Upplýsingar um fyrirtæki, stofnun eða einstakling sem kvartað er yfir',
    doc,
  )
  complaint.targetsOfComplaint.map((c, i) => {
    addformFieldAndValue('Nafn', c.name, doc, PdfConstants.SMALL_LINE_GAP)
    if (c.nationalId) {
      addformFieldAndValue(
        'Kennitala',
        formatSsn(c.nationalId),
        doc,
        PdfConstants.SMALL_LINE_GAP,
      )
    }
    addformFieldAndValue(
      'Heimilisfang',
      c.address,
      doc,
      PdfConstants.SMALL_LINE_GAP,
    )
    const operatesWithinEuropeAnswer =
      c.operatesWithinEurope === 'yes' ? c.countryOfOperation : 'Ekki vitað/nei'
    addformFieldAndValue(
      'Starfsemi innan Evrópu?',
      operatesWithinEuropeAnswer,
      doc,
      PdfConstants.SMALL_LINE_GAP,
    )
    if (c.operatesWithinEurope === 'yes') {
      addValue(
        messages.complaint.labels.complaineeOperatesWithinEuropeMessage
          .defaultMessage,
        doc,
        PdfConstants.NORMAL_FONT,
      )
    }
    doc.moveDown()
  })

  if (complaint.complaintCategories.length !== 0) {
    addSubheader('Efni kvörtunar', doc)
    const subjects = complaint.complaintCategories
      .map((c) => c)
      .filter((x) => x !== '')
      .join(', ')

    complaint.complaintCategories.forEach((c, index) => {
      addValue(
        complaint.complaintCategories.length === index + 1
          ? complaint.somethingElse
            ? `${c}: ${complaint.somethingElse}`
            : c
          : c,
        doc,
        PdfConstants.NORMAL_FONT,
      )
    })

    doc.moveDown()
  }

  addSubheader('Yfir hverju er kvartað í meginatriðum?', doc)
  addValue(
    complaint.description,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.SMALL_LINE_GAP,
  )
  doc.moveDown()
  if (complaint.attachments.length > 0) {
    addSubheader('Fylgiskjöl', doc)

    addValue(
      complaint.attachments.join(),
      doc,
      PdfConstants.NORMAL_FONT,
      PdfConstants.LARGE_LINE_GAP,
    )
  }

  doc.end()
}

function renderContactsAndComplainees(
  complaint: ComplaintPDF,
  doc: PDFKit.PDFDocument,
): void {
  const contactHeading =
    complaint.onBehalf === OnBehalf.MYSELF ||
    complaint.onBehalf === OnBehalf.ORGANIZATION_OR_INSTITUTION
      ? 'Kvartandi'
      : 'Kvartendur'
  addSubheader(contactHeading, doc)

  renderAgencyComplainees(complaint, doc)

  if (
    complaint.onBehalf !== OnBehalf.MYSELF &&
    complaint.onBehalf === OnBehalf.ORGANIZATION_OR_INSTITUTION
  ) {
    addSubheader('Tengiliður', doc)
  }

  addformFieldAndValue(
    'Nafn',
    complaint.contactInfo.name,
    doc,
    PdfConstants.SMALL_LINE_GAP,
  )
  addformFieldAndValue(
    'Kt.',
    complaint.contactInfo.nationalId,
    doc,
    PdfConstants.SMALL_LINE_GAP,
  )

  addformFieldAndValue(
    'Heimilisfang',
    `${complaint.contactInfo.address}, ${complaint.contactInfo.postalCode} ${complaint.contactInfo.city}`,
    doc,
    PdfConstants.SMALL_LINE_GAP,
  )

  addformFieldAndValue(
    'Sími',
    complaint.contactInfo.phone,
    doc,
    PdfConstants.SMALL_LINE_GAP,
  )

  addformFieldAndValue(
    'Netfang',
    complaint.contactInfo.email,
    doc,
    PdfConstants.LARGE_LINE_GAP,
  )
}

function renderAgencyComplainees(
  complaint: ComplaintPDF,
  doc: PDFKit.PDFDocument,
): void {
  if (complaint.onBehalf === OnBehalf.MYSELF_AND_OR_OTHERS) {
    complaint.agency?.persons.push({
      name: complaint.contactInfo.name,
      nationalId: complaint.contactInfo.nationalId,
    })
  }

  if (complaint.agency?.persons?.length) {
    complaint.agency.persons.map((person, i, persons) => {
      const linegap =
        i === persons.length - 1
          ? PdfConstants.LARGE_LINE_GAP
          : PdfConstants.SMALL_LINE_GAP
      addValue(
        `${person.name} kt. ${person.nationalId}`,
        doc,
        PdfConstants.NORMAL_FONT,
        linegap,
      )
    })
  }
}
