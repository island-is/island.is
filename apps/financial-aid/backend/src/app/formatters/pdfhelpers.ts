import { ApplicationEventType } from '@island.is/financial-aid/shared/lib'
import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib'

export const calculatePt = (px: number) => Math.ceil(px * 0.74999943307122)
export const smallFontSize = 9
export const baseFontSize = 11
export const basePlusFontSize = 12
export const mediumFontSize = 14
export const mediumPlusFontSize = 16
export const largeFontSize = 18
export const lightGray = rgb(0.8, 0.8, 0.8)
export const color_black = rgb(0, 0, 0)
export const color_red = rgb(1, 0, 0.3)
export const color_green = rgb(0, 0.702, 0.62)
export const color_lightPurple = rgb(0.88, 0.835, 0.925)

export const stripHTMLTags = (str) => str.replace(/<[^>]*>/g, '')

export const wrapText = (
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
) => {
  if (!text || fontSize <= 0 || maxWidth <= 0) {
    throw new Error('Invalid parameters for text wrapping')
  }
  const lines = []
  const words = text.split(' ')
  let currentLine = ''

  for (const word of words) {
    const textWidth = font.widthOfTextAtSize(currentLine + word + ' ', fontSize)

    if (textWidth < maxWidth) {
      currentLine += word + ' '
    } else {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    }
  }

  // Push the remaining line
  if (currentLine) {
    lines.push(currentLine.trim())
  }

  return lines
}

export const drawTitleAndUnderLine = (
  mainTitle: string,
  YPosition: number,
  page: PDFPage,
  margin: number,
  width: number,
  boldFont: PDFFont,
) => {
  const mainTitleYPosition = YPosition - mediumFontSize - 20

  page.drawText(mainTitle, {
    x: margin,
    y: mainTitleYPosition,
    size: mediumFontSize,
    font: boldFont,
    color: color_black,
  })

  // Draw a line under the main title
  const lineYPosition = mainTitleYPosition - 10
  page.drawLine({
    start: { x: margin, y: lineYPosition },
    end: { x: width - margin, y: lineYPosition },
    thickness: 1,
    color: lightGray, // Light gray
  })

  return lineYPosition
}

export const drawTextArea = (
  page: PDFPage,
  applicationText: string,
  font: PDFFont,
  boldFont: PDFFont,
  baseFontSize: number,
  lineYPosition: number,
  margin: number,
  pdfDoc: PDFDocument,
  title?: string,
) => {
  if (title) {
    // Draw the "Ástæða synjunar" header
    page.drawText(title, {
      x: margin,
      y: lineYPosition,
      size: baseFontSize,
      font: boldFont,
      color: color_black,
    })
  }

  // Clean the rejection text
  const cleanText = stripHTMLTags(applicationText)

  const sanitizedText = cleanText.replace(/\n/g, ' ')

  // Wrap the rejection text
  const wrappedLines = wrapText(sanitizedText, font, baseFontSize, 400)

  // Draw wrapped rejection text below the header
  let y = title ? lineYPosition - baseFontSize - 10 : lineYPosition

  for (const line of wrappedLines) {
    if (y < margin + baseFontSize) {
      // Add a new page
      page = pdfDoc.addPage() // Adjust page size if necessary
      const { height } = page.getSize()
      y = height - margin // Reset y to the top of the new page
    }

    page.drawText(line, {
      x: margin,
      y,
      size: baseFontSize,
      font,
      color: color_black,
    })
    y -= baseFontSize + 4 // Adjust for the next line
  }

  return { updatedPage: page, updatedYPosition: y }
}

export interface Section {
  title: string
  content: string
}

export const drawSectionInfo = (
  data: Section[],
  doc: PDFDocument, // Pass the PDFDocument instance
  page: PDFPage,
  margin: number,
  currentYPosition: number,
  boldFont: PDFFont,
  font: PDFFont,
) => {
  let x = margin
  let itemCount = 0 // Counter to track number of columns per row
  const rowHeight = 20 // Adjust based on font size and spacing
  const columnWidth = 150 // Adjust based on your available space
  let y = currentYPosition - baseFontSize - rowHeight

  let currentIndex = 0

  // Loop through the data and draw each item
  for (const item of data) {
    // Check if there's enough space for another row, if not, add a new page
    if (y < margin + rowHeight * 2) {
      // Add a new page
      page = doc.addPage() // Adjust page size if necessary
      const { height } = page.getSize()
      x = margin // Reset x to the margin for the new page
      y = height - margin // Reset y to the top of the new page
    }

    // Draw label (bold font)
    page.drawText(item.title, {
      x: x,
      y: y,
      size: baseFontSize,
      font: boldFont,
      color: color_black,
    })

    // Draw value (regular font)
    page.drawText(item.content, {
      x: x,
      y: y - rowHeight, // Slightly lower than label
      size: baseFontSize,
      font: font,
      color: color_black,
    })

    // Move x position for the next column
    x += columnWidth
    itemCount++
    currentIndex++

    // If we've drawn 3 columns, move to the next row
    if (itemCount === 3) {
      x = margin // Reset x to start position
      if (currentIndex < data.length) {
        y -= rowHeight * 2 + 10
      }

      itemCount = 0 // Reset itemCount for the new row
    }
  }
  return { updatedPage: page, updatedYPosition: y - rowHeight * 2 }
}

export const colorOfHeaderInTimeline = (eventType: ApplicationEventType) => {
  if (eventType === ApplicationEventType.REJECTED) {
    return color_red
  }
  if (eventType === ApplicationEventType.APPROVED) {
    return color_green
  }
  return color_black
}

export const drawHeaders = (
  page: PDFPage,
  currentYPosition: number,
  margin: number,
  boldFont: PDFFont,
) => {
  const cellColor = rgb(0.9, 0.9, 1)
  const pageWidth = page.getWidth() - margin * 2
  const headers = [
    'Fyrirtæki',
    'Heildarlaun',
    'Persónuafsláttur',
    'Staðgreiðsla',
  ]
  const columnWidth = pageWidth / 4
  let x = margin

  page.drawRectangle({
    x,
    y: currentYPosition - 15,
    width: pageWidth,
    height: 30,
    color: cellColor,
  })

  headers.forEach((header, i) => {
    page.drawText(header, {
      x: x,
      y: currentYPosition - 5,
      size: baseFontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    x += columnWidth
  })
}

export const drawTable = () => {}
