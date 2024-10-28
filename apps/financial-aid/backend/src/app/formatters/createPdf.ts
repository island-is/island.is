import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import format from 'date-fns/format'
import {
  ApplicationEvent,
  ApplicationEventType,
  ApplicationState,
  calcAge,
  formatNationalId,
  formatPhoneNumber,
  getEventData,
  getMonth,
  showSpouseData,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from '../modules/application'
import {
  getApplicant,
  getApplicantMoreInfo,
  getApplicantSpouse,
  getApplicationInfo,
  getChildrenInfo,
  getHeader,
  getNationalRegistryInfo,
} from './applicationPdfHelper'
import {
  baseFontSize,
  drawTextArea,
  largeFontSize,
  smallFontSize,
  drawTitleAndUnderLine,
  drawSectionInfo,
  lightGray,
} from './pdfhelpers'

export const createPdf = async (application: ApplicationModel) => {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.setTitle(`Umsokn-${application.id}`)

  let page = pdfDoc.addPage()

  const { width, height } = page.getSize()

  const margin = 50
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { name, state, created } = application

  const { applicationState, ageOfApplication } = getHeader(created, state)

  const stateWidth = font.widthOfTextAtSize(applicationState, baseFontSize)

  // Define padding between title and the new text
  const lineSpacing = 10

  //   ---- ----- HEADER ---- ----
  page.drawText(name, {
    x: margin,
    y: height - margin - largeFontSize,
    size: largeFontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  page.drawText(applicationState, {
    x: width - stateWidth - margin,
    y: height - margin - baseFontSize,
    size: baseFontSize,
    font: font,
    color:
      state === ApplicationState.REJECTED
        ? rgb(1, 0, 0.3)
        : rgb(0, 0.702, 0.62),
  })

  let currentYPosition =
    height - margin - largeFontSize - smallFontSize - lineSpacing

  const checkYPositionAndAddPage = () => {
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
    color: rgb(0, 0, 0),
  })
  //   ---- ----- HEADER ---- ----

  //   ---- ----- APPLICATION INFO ---- ----
  currentYPosition = drawTitleAndUnderLine(
    'Umsókn',
    currentYPosition,
    page,
    margin,
    width,
    boldFont,
  )
  checkYPositionAndAddPage()

  const sections = getApplicationInfo(application)

  currentYPosition = drawSectionInfo(
    sections,
    pdfDoc,
    page,
    margin,
    currentYPosition,
    boldFont,
    font,
  )
  checkYPositionAndAddPage()

  if (application.state === ApplicationState.REJECTED) {
    // Optionally draw rejection text and get the updated Y position
    currentYPosition = drawTextArea(
      page,
      application.rejection,
      font,
      boldFont,
      baseFontSize,
      currentYPosition,
      margin,
      'Ástæða synjunar',
    )
    checkYPositionAndAddPage()
  }

  //   ---- ----- APPLICATION INFO ---- ----

  //  ---- ----- APPLICANT INFO ---- ----

  currentYPosition = drawTitleAndUnderLine(
    'Umsækjandi',
    currentYPosition,
    page,
    margin,
    width,
    boldFont,
  )
  checkYPositionAndAddPage()

  const applicant = getApplicant(application)
  currentYPosition = drawSectionInfo(
    applicant,
    pdfDoc,
    page,
    margin,
    currentYPosition,
    boldFont,
    font,
  )
  checkYPositionAndAddPage()

  if (application.formComment) {
    // Optionally draw rejection text and get the updated Y position
    currentYPosition = drawTextArea(
      page,
      application.formComment,
      font,
      boldFont,
      baseFontSize,
      currentYPosition,
      margin,
      'Athugasemd',
    )
    checkYPositionAndAddPage()
  }

  //   ---- ----- APPLICANT INFO ---- ----

  // ----- ----- NationlRegistry INFO ---- ----
  currentYPosition = drawTitleAndUnderLine(
    'Þjóðskrá',
    currentYPosition,
    page,
    margin,
    width,
    boldFont,
  )
  checkYPositionAndAddPage()

  const nationalRegistryInfo = getNationalRegistryInfo(application)
  currentYPosition = drawSectionInfo(
    nationalRegistryInfo,
    pdfDoc,
    page,
    margin,
    currentYPosition,
    boldFont,
    font,
  )
  checkYPositionAndAddPage()

  // ----- ----- NationlRegistry INFO ---- ----

  // ----- ----- Spouse info ---- ----
  if (showSpouseData[application.familyStatus]) {
    currentYPosition = drawTitleAndUnderLine(
      'Maki',
      currentYPosition,
      page,
      margin,
      width,
      boldFont,
    )
    checkYPositionAndAddPage()

    const applicantSpouse = getApplicantSpouse(application)
    currentYPosition = drawSectionInfo(
      applicantSpouse,
      pdfDoc,
      page,
      margin,
      currentYPosition,
      boldFont,
      font,
    )
    checkYPositionAndAddPage()

    if (application.spouseFormComment) {
      // Optionally draw rejection text and get the updated Y position
      currentYPosition = drawTextArea(
        page,
        application.spouseFormComment,
        font,
        boldFont,
        baseFontSize,
        currentYPosition,
        margin,
        'Athugasemd',
      )
      checkYPositionAndAddPage()
    }
    // ----- ----- Spouse info ---- ----
  }

  if (application.children?.length > 0) {
    checkYPositionAndAddPage()

    currentYPosition = drawTitleAndUnderLine(
      'Börn',
      currentYPosition,
      page,
      margin,
      width,
      boldFont,
    )
    checkYPositionAndAddPage()

    const childrenInfo = getChildrenInfo(application)
    currentYPosition = drawSectionInfo(
      childrenInfo,
      pdfDoc,
      page,
      margin,
      currentYPosition,
      boldFont,
      font,
    )
    checkYPositionAndAddPage()

    if (application.childrenComment) {
      // Optionally draw rejection text and get the updated Y position
      currentYPosition = drawTextArea(
        page,
        application.childrenComment,
        font,
        boldFont,
        baseFontSize,
        currentYPosition,
        margin,
        'Athugasemd',
      )
      checkYPositionAndAddPage()
    }
  }

  currentYPosition = drawTitleAndUnderLine(
    'Umsóknarferli',
    currentYPosition,
    page,
    margin,
    width,
    boldFont,
  )
  checkYPositionAndAddPage()

  const applicantMoreInfo = getApplicantMoreInfo(application)
  currentYPosition = drawSectionInfo(
    applicantMoreInfo,
    pdfDoc,
    page,
    margin,
    currentYPosition,
    boldFont,
    font,
  )

  checkYPositionAndAddPage()

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
    }

    const eventData = getEventData(
      applicationEvent,
      application.name,
      application.spouseName,
    )
    const eventCreated = format(new Date(event.created), 'dd/MM/yyyy HH:mm')

    const colorOfHeader = () => {
      if (applicationEvent.eventType === ApplicationEventType.REJECTED) {
        return rgb(1, 0, 0.3)
      }
      if (applicationEvent.eventType === ApplicationEventType.APPROVED) {
        return rgb(0, 0.702, 0.62)
      }
      return rgb(0, 0, 0)
    }

    page.drawText(eventData.header, {
      x: margin,
      y: currentYPosition,
      size: baseFontSize,
      font: boldFont,
      color: colorOfHeader(),
    })
    currentYPosition -= baseFontSize + lineSpacing
    checkYPositionAndAddPage()
    page.drawText(eventData.prefix + ': ' + eventData.text, {
      x: margin,
      y: currentYPosition,
      size: baseFontSize,
      font: font,
      color: rgb(0, 0, 0),
    })
    checkYPositionAndAddPage()
    currentYPosition -= baseFontSize + lineSpacing

    if (item.comment) {
      currentYPosition = drawTextArea(
        page,
        item.comment,
        font,
        boldFont,
        baseFontSize,
        currentYPosition,
        margin,
      )
      checkYPositionAndAddPage()
      currentYPosition -= baseFontSize + lineSpacing
    }

    checkYPositionAndAddPage()
    page.drawText(eventCreated, {
      x: margin,
      y: currentYPosition,
      size: smallFontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    })

    // Draw a line under the main title
    const lineYPosition = currentYPosition - 10
    page.drawLine({
      start: { x: margin, y: lineYPosition },
      end: { x: width - margin, y: lineYPosition },
      thickness: 1,
      color: rgb(0.88, 0.835, 0.925),
    })

    currentYPosition -= baseFontSize + lineSpacing + 10
    checkYPositionAndAddPage()
  })

  //   ---- ----- APPLICATION EVENTS ---- ----

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })

  return pdfDataUri
}
