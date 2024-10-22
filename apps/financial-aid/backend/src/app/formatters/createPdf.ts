import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import format from 'date-fns/format'
import {
  Application,
  ApplicationEvent,
  ApplicationState,
  calcAge,
  calcDifferenceInDate,
  Employment,
  formatNationalId,
  formatPhoneNumber,
  getEmploymentStatus,
  getEventData,
  getHomeCircumstances,
  getMonth,
  getState,
  HomeCircumstances,
  showSpouseData,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from '../modules/application'
import { getApplicant, getApplicantMoreInfo } from './applicationHelper'
import { get } from 'lodash'
import { baseFontSize, largeFontSize, smallFontSize } from './pdfhelpers'

export const createApplicantPdff = async (application: ApplicationModel) => {
  const pdfDoc = await PDFDocument.create()

  // Embed the Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const page = pdfDoc.addPage([600, 800]) // Adjust page size for better layout

  // General Font Size
  const fontSize = 12
  const sectionHeaderFontSize = 16
  const lineHeight = fontSize + 6 // Custom line height for spacing between lines
  const sectionSpacing = sectionHeaderFontSize + 10 // Space after section headers
  const topSectionSpacing = 15 // Extra space above section headers
  let currentY = 750 // Start Y-position at the top

  // Function to draw text and adjust Y-position dynamically
  const drawText = (text, size = fontSize, isSectionHeader = false) => {
    // Adjust Y-position before drawing section headers
    if (isSectionHeader) {
      currentY -= topSectionSpacing // Add space above the section header
    }

    page.drawText(text, { x: 50, y: currentY, size })

    // Adjust the Y-position after the text
    currentY -= isSectionHeader ? sectionSpacing : lineHeight
  }

  // Title of the PDF (Applicant Name)
  page.setFont(timesRomanFont)
  drawText(application.name, sectionHeaderFontSize, true)

  // Application Info
  drawText('Umsókn', sectionHeaderFontSize, true)
  drawText(
    `Dagssetning umsóknar: ${format(
      new Date(application.created),
      'dd.MM.y  · kk:mm',
    )}`,
  )
  drawText(
    `Fyrir tímabil: ${
      getMonth(new Date(application.appliedDate).getMonth()) +
      format(new Date(application.appliedDate), ' y')
    }`,
  )

  if (application.amount?.finalAmount) {
    drawText(
      `Samþykkt upphæð: kr. ${application.amount.finalAmount.toLocaleString(
        'de-DE',
      )} kr.`,
    )
  }

  if (application.state === ApplicationState.REJECTED) {
    drawText(`Aðstoð synjað: ${application.rejection}`)
  }

  // Applicant Info
  drawText('Umsækjandi', sectionHeaderFontSize, true)
  const applicant = getApplicant(application)

  applicant.map((item) => {
    return drawText(`${item.title}: ${item.content}`)
  })

  // Additional Information
  drawText('Þjóðskrá', sectionHeaderFontSize, true)
  drawText(`Lögheimili: ${application.streetName}`)
  drawText(`Póstnúmer: ${application.postalCode}`)
  drawText(`Sveitarfélag: ${application.city}`)

  if (showSpouseData[application.familyStatus]) {
    drawText(`Nafn: ${application.spouseName}`)
    drawText(`Kennitala: ${formatNationalId(application.spouseNationalId)}`)
    drawText(`Sími: ${formatPhoneNumber(application.spousePhoneNumber ?? '')}`)
    drawText(`Netfang: ${application.spouseEmail}`)
    drawText(
      `Athugasemd: ${application.spouseFormComment ? '' : 'Engin athugasemd'}`,
    )
  }

  if (application.children?.length > 0) {
    application.children.forEach((child) => {
      drawText(`Nafn: ${child.name}`)
      drawText(`Kennitala: ${formatNationalId(child.nationalId)}`)
      drawText(`Aldur: ${calcAge(child.nationalId) + ' ára'}`)
      drawText(`Skólastofnun: ${child.school}`)
      drawText(
        `Býr hjá umsækjanda?: ${child.livesWithApplicant ? 'Já' : 'Nei'}`,
      )
      drawText(
        `Býr hjá báðum foreldrum? : ${
          child.livesWithBothParents ? 'Já' : 'Nei'
        }`,
      )
    })
  }

  // Process Information
  drawText('Umsóknarferli', sectionHeaderFontSize, true)

  const applicantMoreInfo = getApplicantMoreInfo(application)
  applicantMoreInfo.map((item) => {
    if (item?.other) {
      return drawText(`${item.title}: ${item.content} - ${item.other}`)
    } else {
      return drawText(`${item.title}: ${item.content}`)
    }
  })

  //history of application
  drawText('Saga umsóknar', sectionHeaderFontSize, true)
  //   application.applicationEvents.map((event) => {
  //     const appEvent = {
  //       ...event,
  //       created: event.created.toISOString(),
  //     }
  //     const eventData = getEventData(
  //       appEvent,
  //       application.name,
  //       application.spouseName,
  //     )
  //     const eventCreated = format(new Date(event.created), 'dd/MM/yyyy HH:mm')
  //     return drawText(`${eventData.header}`, sectionHeaderFontSize)
  //   })

  // Save the PDF as a base64 encoded URI
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })

  return pdfDataUri
}

export const createPdf = async (application: ApplicationModel) => {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(`Umsokn-${application.id}`)

  const page = pdfDoc.addPage()

  const { width, height } = page.getSize()

  const margin = 50
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // HEADER of Application
  const { name, state, created } = application

  const applicationState = getState[application.state]
  const applicationCreated = created.toISOString()

  const ageOfApplication = `Aldur umsóknar: ${calcDifferenceInDate(
    applicationCreated,
  )}`

  const stateWidth = font.widthOfTextAtSize(applicationState, baseFontSize)

  // Define padding between title and the new text
  const lineSpacing = 10

  // Draw the title on the left side within the margin
  page.drawText(name, {
    x: margin,
    y: height - margin - largeFontSize,
    size: largeFontSize,
    font: font,
    color: rgb(0, 0, 0),
  })

  // Draw the state on the right side within the margin
  page.drawText(applicationState, {
    x: width - stateWidth - margin,
    y: height - margin - baseFontSize,
    size: baseFontSize,
    font: font,
    color:
      state === ApplicationState.REJECTED ? rgb(1, 0, 0.3) : rgb(0, 179, 158),
  })

  // Draw the subTitle ("Aldur umsóknar") under the title
  page.drawText(ageOfApplication, {
    x: margin,
    y: height - margin - largeFontSize - smallFontSize - lineSpacing, // Adjust y-position below title
    size: smallFontSize,
    font: font,
    color: rgb(0, 0, 0),
  })

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })

  return pdfDataUri
}
