import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import { addFormField, addHeader, addSubHeader, addText, addToDoc, PdfConstants } from './pdfUtils'
import { ComplaintDto } from '../models'

export async function generateApplicationPdf(
  complaint: ComplaintDto,
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: PdfConstants.PAGE_SIZE,
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  addHeader(doc, 'Kvörtun')
  addSubHeader(doc, 'Tengiliður')
  addFormField(doc, 'Nafn', `${complaint.contactInfo.name}`)
  addFormField(doc, 'Kennitala', ` ${complaint.contactInfo.nationalId}`)
  addFormField(doc, 'Sími', ` ${complaint.contactInfo.phone}`)
  addFormField(doc, 'Tölvupóstur', `${complaint.contactInfo.email}`)
  addFormField(doc, 'Heimilisfang', `${complaint.contactInfo.address}, ${complaint.contactInfo.postalCode} ${complaint.contactInfo.city}`)
  addFormField(doc, 'Umboð', `${complaint.onBehalf}`, PdfConstants.NORMAL_LINE_GAP)

  if (complaint.agency) {
    addSubHeader(doc, 'Umboðsaðilar')

    complaint.agency.persons.map((person) => {
      addFormField(doc, 'Nafn', `${person.name}`)
      addFormField(doc, 'Kennitala', `${person.nationalId}`, PdfConstants.NORMAL_LINE_GAP)
    })
  }

  addSubHeader(doc, 'Aðilar sem er kvartað yfir')

  complaint.targetsOfComplaint.map((target, i) => {
    addFormField(doc, 'Nafn', `${target.name}`)
    addFormField(doc, 'Kennitala', `${target.nationalId}`)
    addFormField(doc, 'Heimilisfang', `${target.address}`)
    addFormField(doc, 'Starfrækt innann evrópu', `${target.operatesWithinEurope}`)
    addFormField(doc, 'Starfsemi í landi', `${target.countryOfOperation}`, PdfConstants.NORMAL_LINE_GAP)
  })

  addSubHeader(doc, 'Flokkun á atburði')
  complaint.complaintCategories.map((category, i) => {
    (complaint.complaintCategories.length > i + 1) ?
      addText(doc, category) :
      addText(doc, category, PdfConstants.NORMAL_LINE_GAP)
  })

  addSubHeader(doc, 'Lýsing á atburði')
  addText(doc, complaint.description)

  doc.end()

  const pdfBuffer = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })
  return pdfBuffer
}
