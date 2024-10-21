import { PDFDocument, StandardFonts } from 'pdf-lib'
import format from 'date-fns/format'
import {
  Application,
  ApplicationEvent,
  ApplicationState,
  calcAge,
  Employment,
  formatNationalId,
  formatPhoneNumber,
  getEmploymentStatus,
  getEventData,
  getHomeCircumstances,
  getMonth,
  HomeCircumstances,
  showSpouseData,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from '../modules/application'

export const createApplicantPdf = async (application: ApplicationModel) => {
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
  drawText(`Nafn: ${application.name}`)
  drawText(`Kennitala: ${application.nationalId}`)
  drawText(`Sími: ${formatPhoneNumber(application.phoneNumber ?? '')}`)
  drawText(`Netfang: ${application.email}`)
  drawText(
    `Bankareikningur: ${application.bankNumber}-${application.ledger}-${application.accountNumber}`,
  )
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
  drawText(
    `Búsetuform: ${
      getHomeCircumstances[application.homeCircumstances as HomeCircumstances]
    }`,
  )
  drawText(
    `Atvinna: ${getEmploymentStatus[application.employment as Employment]}`,
  )
  drawText(`Lánshæft nám: ${application.student ? 'Já' : 'Nei'}`)
  drawText(`Hefur haft tekjur: ${application.hasIncome ? 'Já' : 'Nei'}`)

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

  //     drawText(`${eventData.header}`, sectionHeaderFontSize)
  //     drawText(`${eventData.prefix} ${eventData.text}`)
  //     drawText(`${eventCreated}`)
  //   })

  // Save the PDF as a base64 encoded URI
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })

  return pdfDataUri
}
