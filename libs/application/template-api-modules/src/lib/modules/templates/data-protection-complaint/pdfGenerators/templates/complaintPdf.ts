import { ComplaintPDF } from '../../models'

import { Application } from '@island.is/application/core'
import { transformApplicationToComplaintDto } from '../../data-protection-utils'
import { generatePdf } from '../pdfGenerator'
import { addHeader, addSubheader, addValue, formatSsn } from '../pdfUtils'
import { PdfConstants } from '../constants'

export async function generateComplaintPdf(
  complaint: ComplaintPDF,
): Promise<Buffer> {
  return await generatePdf<ComplaintPDF>(complaint, dpcApplicationPdf)
}

export async function generateComplaintPdfApplication(
  application: Application,
): Promise<Buffer> {
  const dto = transformApplicationToComplaintDto(application)
  return await generatePdf<ComplaintPDF>(dto, dpcApplicationPdf)
}

function dpcApplicationPdf(
  complaint: ComplaintPDF,
  doc: PDFKit.PDFDocument,
): void {
  addHeader('Kvörtun til Persónuverndar', doc)
  addSubheader('Tengiliður', doc)

  addValue(
    `${complaint.contactInfo.name}, ${formatSsn(
      complaint.contactInfo.nationalId,
    )}`,
    doc,
  )

  addValue(
    `${complaint.contactInfo.address}, ${complaint.contactInfo.postalCode} ${complaint.contactInfo.city}`,
    doc,
  )

  addValue(
    `${complaint.contactInfo.phone}, ${complaint.contactInfo.email}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.LARGE_LINE_GAP,
  )

  /*addFormField(
    doc,
    'Umboð',
    `${complaint.onBehalf}`,
    PdfConstants.NORMAL_LINE_GAP,
  )

  if (complaint.agency) {
    addSubHeader(doc, 'Umboðsaðilar')

    complaint.agency.persons.map((person) => {
      addFormField(doc, 'Nafn', `${person.name}`)
      addFormField(
        doc,
        'Kennitala',
        `${person.nationalId}`,
        PdfConstants.NORMAL_LINE_GAP,
      )
    })
  }*/
  /*
  addSubHeader(doc, 'Aðilar sem er kvartað yfir')

  complaint.targetsOfComplaint.map((target, i) => {
    addFormField(doc, 'Nafn', `${target.name}`)
    addFormField(doc, 'Kennitala', `${target.nationalId}`)
    addFormField(doc, 'Heimilisfang', `${target.address}`)
    if (target.operatesWithinEurope === 'yes') {
      addFormField(doc, 'Starfrækt innann evrópu', 'já')
      addFormField(
        doc,
        'Starfsemi í landi',
        `${target.countryOfOperation}`,
        PdfConstants.NORMAL_LINE_GAP,
      )
    } else {
      addFormField(
        doc,
        'Starfrækt innann evrópu',
        'nei/veit ekki',
        PdfConstants.NORMAL_LINE_GAP,
      )
    }

    addFormField(
      doc,
      'Starfrækt innann evrópu',
      `${target.operatesWithinEurope === 'yes' ? 'já' : 'nei/veit ekki'}`,
    )
    addFormField(
      doc,
      'Starfsemi í landi',
      `${target.countryOfOperation}`,
      PdfConstants.NORMAL_LINE_GAP,
    )
  })*/
  /*
  addSubHeader(doc, 'Flokkun á atburði')
  complaint.complaintCategories.map((category, i) => {
    complaint.complaintCategories.length > i + 1
      ? addText(doc, category)
      : addText(doc, category, PdfConstants.NORMAL_LINE_GAP)
  })

  addSubHeader(doc, 'Lýsing á atburði')
  addText(doc, complaint.description)
*/
  doc.end()
}
