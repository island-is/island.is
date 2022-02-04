import { ComplaintPDF } from '../../models'

import { Application } from '@island.is/application/core'
import { transformApplicationToComplaintPDFdata } from '../../data-protection-utils'
import { generatePdf } from '../pdfGenerator'
import {
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

export async function generateComplaintPdf(
  complaint: ComplaintPDF,
): Promise<Buffer> {
  return await generatePdf<ComplaintPDF>(complaint, dpcApplicationPdf)
}

export async function generateComplaintPdfApplication(
  application: Application,
): Promise<Buffer> {
  const dto = transformApplicationToComplaintPDFdata(application)
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
  addSubheader('Tengiliður', doc)

  addValue(
    `${complaint.contactInfo.name}, kt. ${formatSsn(
      complaint.contactInfo.nationalId,
    )}`,
    doc,
  )

  addValue(
    `${complaint.contactInfo.address}, ${complaint.contactInfo.postalCode} ${complaint.contactInfo.city}`,
    doc,
  )

  addValue(
    `s. ${complaint.contactInfo.phone}, ${complaint.contactInfo.email}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.LARGE_LINE_GAP,
  )

  if (complaint.agency?.persons?.length) {
    addSubheader('Umboðsaðilar', doc)
    complaint.agency.persons.map((person) => {
      addValue(
        `${person.name} kt. ${person.nationalId}`,
        doc,
        PdfConstants.NORMAL_FONT,
        PdfConstants.LARGE_LINE_GAP,
      )
    })
  }
  addSubheader(
    'Upplýsingar um fyrirtæki, stofnun eða einstakling sem kvartað er yfir',
    doc,
  )
  complaint.targetsOfComplaint.map((c, i) => {
    const linegap =
      i === complaint.targetsOfComplaint.length - 1
        ? PdfConstants.LARGE_LINE_GAP
        : PdfConstants.SMALL_LINE_GAP
    addValue(
      `${c.name}, kt. ${formatSsn(c.nationalId)}, ${c.address}`,
      doc,
      PdfConstants.NORMAL_FONT,
      PdfConstants.NO_LINE_GAP,
    )
    if (c.operatesWithinEurope === 'yes') {
      addValue(
        `Starfsemi í landi ${c.countryOfOperation}`,
        doc,
        PdfConstants.NORMAL_FONT,
        linegap,
      )
    } else {
      addValue(
        'Ekki vitað eða starfar ekki innan Evrópu',
        doc,
        PdfConstants.NORMAL_FONT,
        linegap,
      )
    }
  })

  addSubheader('Efni kvörtunar', doc)
  const subjects = complaint.complaintCategories.map((c) => c).join(', ')

  addValue(subjects, doc, PdfConstants.NORMAL_FONT, PdfConstants.LARGE_LINE_GAP)

  addSubheader('Yfir hverju er kvartað í meginatriðum?', doc)
  addValue(
    complaint.description,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.LARGE_LINE_GAP,
  )
  doc.end()
}
