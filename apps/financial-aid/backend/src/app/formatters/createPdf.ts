import { PDFDocument, StandardFonts } from 'pdf-lib'
import format from 'date-fns/format'
import {
  ApplicationEvent,
  ApplicationState,
  DirectTaxPayment,
  getEventData,
  showSpouseData,
  UserType,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from '../modules/application'
import {
  getApplicant,
  getApplicantMoreInfo,
  getApplicantSpouse,
  getApplicationInfo,
  getChildrenInfo,
  getDirectTaxPayments,
  getHeader,
  getNationalRegistryInfo,
  groupDirectPayments,
} from './applicationPdfHelper'
import {
  baseFontSize,
  drawTextArea,
  largeFontSize,
  smallFontSize,
  drawTitleAndUnderLine,
  drawSectionInfo,
  color_black,
  color_red,
  color_green,
  colorOfHeaderInTimeline,
  color_lightPurple,
  Section,
  drawHeadersForTable,
  drawTable,
} from './pdfhelpers'

export const createPdf = async (
  application: ApplicationModel,
): Promise<string> => {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(`Umsokn-${application.id}`)

  let page = pdfDoc.addPage()

  const { width, height } = page.getSize()

  const margin = 50
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { name, state, created, directTaxPayments = [] } = application

  const { applicationState, ageOfApplication } = getHeader(created, state)

  const stateWidth = font.widthOfTextAtSize(applicationState, largeFontSize)

  // Define padding between title and the new text
  const lineSpacing = 10

  //   ---- ----- HEADER ---- ----
  const headerYPosition = height - margin - largeFontSize
  page.drawText(name, {
    x: margin,
    y: headerYPosition,
    size: largeFontSize,
    font: boldFont,
    color: color_black,
  })

  page.drawText(applicationState, {
    x: width - stateWidth - margin,
    y: headerYPosition,
    size: largeFontSize,
    font: boldFont,
    color: state === ApplicationState.REJECTED ? color_red : color_green,
  })

  let currentYPosition = headerYPosition - smallFontSize - lineSpacing

  const checkYPositionAndAddPage = (): void => {
    if (currentYPosition < 100) {
      page = pdfDoc.addPage()
      currentYPosition = height - margin
    }
  }

  page.drawText(ageOfApplication, {
    x: margin,
    y: currentYPosition,
    size: smallFontSize,
    font: font,
    color: color_black,
  })
  //   ---- ----- HEADER ---- ----

  // Draw Sections
  const drawSection = (title: string, data: Section[]) => {
    currentYPosition = drawTitleAndUnderLine(
      title,
      currentYPosition,
      page,
      margin,
      width,
      boldFont,
    )
    checkYPositionAndAddPage()

    const { updatedYPosition, updatedPage } = drawSectionInfo(
      data,
      pdfDoc,
      page,
      margin,
      currentYPosition,
      boldFont,
      font,
    )
    page = updatedPage
    currentYPosition = updatedYPosition
    checkYPositionAndAddPage()
  }

  // process direct payments
  const processDirectPayments = (
    directPayments: DirectTaxPayment[],
    sectionTitle: string,
  ) => {
    if (directPayments.length > 0) {
      drawSection(sectionTitle, getDirectTaxPayments(directPayments))

      currentYPosition = drawHeadersForTable(
        page,
        currentYPosition,
        margin,
        boldFont,
      )
      checkYPositionAndAddPage()

      const { updatedPage, updatedYPosition } = drawTable(
        page,
        pdfDoc,
        groupDirectPayments(directPayments),
        margin,
        currentYPosition,
        boldFont,
        font,
      )
      page = updatedPage
      currentYPosition = updatedYPosition
      checkYPositionAndAddPage()
    }
  }

  //   ---- ----- APPLICATION INFO ---- ----

  drawSection('Umsókn', getApplicationInfo(application))

  if (application.state === ApplicationState.REJECTED) {
    // Optionally draw rejection text and get the updated Y position
    const { updatedYPosition, updatedPage } = drawTextArea(
      page,
      application.rejection,
      font,
      boldFont,
      baseFontSize,
      currentYPosition,
      margin,
      pdfDoc,
      'Ástæða synjunar',
    )
    page = updatedPage // Update to the new page if created
    currentYPosition = updatedYPosition

    checkYPositionAndAddPage()
  }

  //   ---- ----- APPLICATION INFO ---- ----

  //  ---- ----- APPLICANT INFO ---- ----
  drawSection('Umsækjandi', getApplicant(application))

  if (application.formComment) {
    const { updatedYPosition, updatedPage } = drawTextArea(
      page,
      application.formComment,
      font,
      boldFont,
      baseFontSize,
      currentYPosition,
      margin,
      pdfDoc,
      'Athugasemd',
    )
    page = updatedPage
    currentYPosition = updatedYPosition
    checkYPositionAndAddPage()
  }

  //   ---- ----- APPLICANT INFO ---- ----

  drawSection('Þjóðskrá', getNationalRegistryInfo(application))

  if (showSpouseData[application.familyStatus]) {
    drawSection('Maki', getApplicantSpouse(application))

    if (application.spouseFormComment) {
      // Optionally draw rejection text and get the updated Y position
      const { updatedYPosition, updatedPage } = drawTextArea(
        page,
        application.spouseFormComment,
        font,
        boldFont,
        baseFontSize,
        currentYPosition,
        margin,
        pdfDoc,
        'Athugasemd',
      )

      page = updatedPage // Update to the new page if created
      currentYPosition = updatedYPosition
      checkYPositionAndAddPage()
    }

    const spouseDirectPayments =
      directTaxPayments.filter((d) => d.userType === UserType.SPOUSE) ?? []

    processDirectPayments(
      spouseDirectPayments,
      'Upplýsingar um staðgreiðslu maka',
    )
  }

  if (application.children?.length > 0) {
    drawSection('Börn', getChildrenInfo(application))

    if (application.childrenComment) {
      // Optionally draw rejection text and get the updated Y position
      const { updatedYPosition, updatedPage } = drawTextArea(
        page,
        application.childrenComment,
        font,
        boldFont,
        baseFontSize,
        currentYPosition,
        margin,
        pdfDoc,
        'Athugasemd',
      )
      page = updatedPage
      currentYPosition = updatedYPosition
      checkYPositionAndAddPage()
    }
  }

  const applicantDirectPayments =
    directTaxPayments.filter((d) => d.userType === UserType.APPLICANT) ?? []

  processDirectPayments(applicantDirectPayments, 'Upplýsingar um staðgreiðslu')

  drawSection('Umsóknarferli', getApplicantMoreInfo(application))

  //   ---- ----- APPLICATION EVENTS ---- ----
  currentYPosition = drawTitleAndUnderLine(
    'Saga umsóknar',
    currentYPosition,
    page,
    margin,
    width,
    boldFont,
  )
  checkYPositionAndAddPage()
  currentYPosition -= baseFontSize + lineSpacing

  application.applicationEvents.forEach((item) => {
    const event = item.dataValues
    const applicationEvent: ApplicationEvent = {
      ...event,
      created: event.created.toISOString(), // Convert Date to string
      staffName: 'Starfsmaður',
    }

    const eventData = getEventData(
      applicationEvent,
      application.name,
      application.spouseName,
    )
    const eventCreated = format(new Date(event.created), 'dd/MM/yyyy HH:mm')

    page.drawText(eventData.header, {
      x: margin,
      y: currentYPosition,
      size: baseFontSize,
      font: boldFont,
      color: colorOfHeaderInTimeline(applicationEvent.eventType),
    })
    currentYPosition -= baseFontSize + lineSpacing
    checkYPositionAndAddPage()
    page.drawText(eventData.prefix + ': ' + eventData.text, {
      x: margin,
      y: currentYPosition,
      size: baseFontSize,
      font: font,
      color: color_black,
    })
    checkYPositionAndAddPage()
    currentYPosition -= baseFontSize + lineSpacing

    if (item.comment) {
      const { updatedYPosition, updatedPage } = drawTextArea(
        page,
        item.comment,
        font,
        boldFont,
        baseFontSize,
        currentYPosition,
        margin,
        pdfDoc,
      )
      page = updatedPage // Update to the new page if created
      currentYPosition = updatedYPosition

      checkYPositionAndAddPage()
    }

    checkYPositionAndAddPage()
    page.drawText(eventCreated, {
      x: margin,
      y: currentYPosition,
      size: smallFontSize,
      font: boldFont,
      color: color_black,
    })

    // Draw a line under the main title
    const lineYPosition = currentYPosition - 10
    page.drawLine({
      start: { x: margin, y: lineYPosition },
      end: { x: width - margin, y: lineYPosition },
      thickness: 1,
      color: color_lightPurple,
    })

    currentYPosition -= baseFontSize + lineSpacing + 10
    checkYPositionAndAddPage()
  })

  //   ---- ----- APPLICATION EVENTS ---- ----

  return await pdfDoc.saveAsBase64({ dataUri: true })
}
