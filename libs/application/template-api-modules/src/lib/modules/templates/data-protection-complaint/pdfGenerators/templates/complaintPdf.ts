import { addFormField, addHeader, addSubHeader, addText } from '../pdfUtils'
import { ComplaintDto } from '../../models'
import { generatePdf, PdfConstants } from '..'

export async function generateComplaintPdf(
  complaint: ComplaintDto,
): Promise<Buffer> {
  return await generatePdf<ComplaintDto>(complaint, dpcApplicationPdf)
}

function dpcApplicationPdf(
  complaint: ComplaintDto,
  doc: PDFKit.PDFDocument,
): void {
  addHeader(doc, 'Kvörtun')
  addSubHeader(doc, 'Tengiliður')
  addFormField(doc, 'Nafn', `${complaint.contactInfo.name}`)
  addFormField(doc, 'Kennitala', ` ${complaint.contactInfo.nationalId}`)
  addFormField(doc, 'Sími', ` ${complaint.contactInfo.phone}`)
  addFormField(doc, 'Tölvupóstur', `${complaint.contactInfo.email}`)
  addFormField(
    doc,
    'Heimilisfang',
    `${complaint.contactInfo.address}, ${complaint.contactInfo.postalCode} ${complaint.contactInfo.city}`,
  )
  addFormField(
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
  }

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
  })

  addSubHeader(doc, 'Flokkun á atburði')
  complaint.complaintCategories.map((category, i) => {
    complaint.complaintCategories.length > i + 1
      ? addText(doc, category)
      : addText(doc, category, PdfConstants.NORMAL_LINE_GAP)
  })

  addSubHeader(doc, 'Lýsing á atburði')
  addText(doc, complaint.description)

  doc.end()
}
