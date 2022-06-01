import { ComplaintPDF, ExternalDataMessages, Information } from '../../models'

import { Application } from '@island.is/application/core'
import { applicationToComplaintPDF } from '../../data-protection-utils'
import { generatePdf } from '../pdfGenerator'
import { messages } from '@island.is/application/templates/data-protection-complaint'
import {
  addformFieldAndValue,
  addHeader,
  addList,
  addLogo,
  addSubheader,
  addSubtitle,
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
  complaint.targetsOfComplaint.map((c) => {
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
    doc.moveDown()
    if (c.operatesWithinEurope === 'yes') {
      addValue(
        messages.complaint.labels.complaineeOperatesWithinEuropeMessage
          .defaultMessage,
        doc,
        PdfConstants.NORMAL_FONT,
      )
      doc.moveDown(2)
    }
  })

  if (complaint.complaintCategories.length !== 0) {
    addSubheader('Efni kvörtunar', doc)

    const categories = complaint.complaintCategories.map((c, index) => {
      return complaint.complaintCategories.length === index + 1
        ? complaint.somethingElse
          ? `${c}: ${complaint.somethingElse}`
          : c
        : c
    })

    addList(categories, doc)
    doc.moveDown()
  }

  addSubheader('Yfir hverju er kvartað í meginatriðum?', doc)
  addValue(complaint.description, doc, PdfConstants.NORMAL_FONT)
  doc.moveDown(2)
  if (complaint.attachments.length > 0) {
    addSubheader('Fylgiskjöl', doc)

    addValue(complaint.attachments.join(), doc, PdfConstants.NORMAL_FONT)
    doc.moveDown()
  }

  doc.addPage()
  renderExternalDataMessages(complaint.messages.externalData, doc)

  doc.addPage()
  renderInformationMessages(complaint.messages.information, doc)

  doc.end()
}

function renderExternalDataMessages(
  externalData: ExternalDataMessages,
  doc: PDFKit.PDFDocument,
): void {
  addHeader(externalData.title, doc)
  addSubtitle(externalData.subtitle, doc)
  addValue(externalData.description, doc)
  doc.moveDown()
  addValue(externalData.nationalRegistryTitle, doc, PdfConstants.BOLD_FONT)
  addValue(
    externalData.nationalRegistryDescription,
    doc,
    PdfConstants.NORMAL_FONT,
  )
  doc.moveDown()
  addValue(externalData.userProfileTitle, doc, PdfConstants.BOLD_FONT)
  addValue(externalData.userProfileDescription, doc, PdfConstants.NORMAL_FONT)
  doc.moveDown()
  addValue(externalData.checkboxText, doc, PdfConstants.BOLD_FONT)
  addValue('Já', doc, PdfConstants.NORMAL_FONT)
  doc.moveDown()
}

function renderInformationMessages(
  information: Information,
  doc: PDFKit.PDFDocument,
): void {
  addHeader(information.title, doc)

  const bulletsWithLinks = information.bullets.map(
    ({ bullet, link, linkText }) => {
      const splitBullet = bullet.split('{link}')
      if (splitBullet.length === 2) {
        return doc
          .text(splitBullet[0], { continued: true })
          .fillColor('blue')
          .text(linkText, {
            continued: true,
            link: link,
          })
          .fillColor('black')
          .text(splitBullet[1])
      } else {
        return doc.text(bullet)
      }
    },
  )
  addList(bulletsWithLinks, doc)

  /* addSubtitle(externalData.subtitle, doc)
  addValue(externalData.description, doc)
  doc.moveDown()
  addValue(externalData.nationalRegistryTitle, doc, PdfConstants.BOLD_FONT)
  addValue(
    externalData.nationalRegistryDescription,
    doc,
    PdfConstants.NORMAL_FONT,
  )
  doc.moveDown()
  addValue(externalData.userProfileTitle, doc, PdfConstants.BOLD_FONT)
  addValue(externalData.userProfileDescription, doc, PdfConstants.NORMAL_FONT)
  doc.moveDown()
  addValue(externalData.checkboxText, doc, PdfConstants.BOLD_FONT)
  addValue('Já', doc, PdfConstants.NORMAL_FONT)
  doc.moveDown() */
}

function renderContactsAndComplainees(
  complaint: ComplaintPDF,
  doc: PDFKit.PDFDocument,
): void {
  /*
  Kvartandi: 
   MYSELF
   ORGANIZATION_OR_INSTITUTION --- Ef að við bætum við um þig!!!
   OTHERS --- Ef að það eru ekki fleiri en eitt umboð!!
  */
  const contactHeading =
    complaint.onBehalf === OnBehalf.MYSELF ||
    complaint.onBehalf === OnBehalf.ORGANIZATION_OR_INSTITUTION ||
    (complaint.onBehalf === OnBehalf.OTHERS &&
      complaint.agency?.persons &&
      complaint.agency.persons.length === 1)
      ? 'Kvartandi'
      : 'Kvartendur'

  if (
    complaint.onBehalf !== OnBehalf.ORGANIZATION_OR_INSTITUTION &&
    complaint.onBehalf !== OnBehalf.OTHERS
  ) {
    addSubheader(contactHeading, doc)
  }

  if (complaint.onBehalf === OnBehalf.OTHERS) {
    addSubheader('Tengiliður', doc)
  }

  addformFieldAndValue(
    'Nafn',
    complaint.contactInfo.name,
    doc,
    PdfConstants.SMALL_LINE_GAP,
  )
  addformFieldAndValue(
    'Kennitala',
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

  complaint.contactInfo.phone &&
    addformFieldAndValue(
      'Sími',
      complaint.contactInfo.phone,
      doc,
      PdfConstants.SMALL_LINE_GAP,
    )

  complaint.contactInfo.email &&
    addformFieldAndValue(
      'Netfang',
      complaint.contactInfo.email,
      doc,
      PdfConstants.SMALL_LINE_GAP,
    )

  doc.moveDown()

  if (
    complaint.onBehalf === OnBehalf.ORGANIZATION_OR_INSTITUTION ||
    complaint.onBehalf === OnBehalf.OTHERS
  ) {
    addSubheader(contactHeading, doc)
  }

  renderAgencyComplainees(complaint, doc)
}

function renderAgencyComplainees(
  complaint: ComplaintPDF,
  doc: PDFKit.PDFDocument,
): void {
  if (
    complaint.agency?.persons?.length &&
    complaint.onBehalf !== OnBehalf.ORGANIZATION_OR_INSTITUTION &&
    complaint.onBehalf !== OnBehalf.MYSELF
  ) {
    complaint.agency.persons.map((person) => {
      addformFieldAndValue(
        'Nafn',
        person.name,
        doc,
        PdfConstants.SMALL_LINE_GAP,
      )
      addformFieldAndValue(
        'Kennitala',
        person.nationalId,
        doc,
        PdfConstants.SMALL_LINE_GAP,
      )

      doc.moveDown()
    })
  }
}
