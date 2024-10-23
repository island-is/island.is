import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { PDFFont, PDFPage, rgb } from 'pdf-lib'
import { ApplicationModel } from '../modules/application'

export const calculatePt = (px: number) => Math.ceil(px * 0.74999943307122)
export const smallFontSize = 9
export const baseFontSize = 11
export const basePlusFontSize = 12
export const mediumFontSize = 14
export const mediumPlusFontSize = 16
export const largeFontSize = 18
export const lightGray = rgb(0.8, 0.8, 0.8)

export const stripHTMLTags = (str) => str.replace(/<[^>]*>/g, '')

export const wrapText = (text, font, fontSize, maxWidth) => {
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
    color: rgb(0, 0, 0),
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
  title: string,
  applicationText: string,
  font: PDFFont,
  boldFont: PDFFont,
  baseFontSize: number,
  lineYPosition: number,
  margin: number,
) => {
  // Draw the "Ástæða synjunar" header
  page.drawText(title, {
    x: margin,
    y: lineYPosition,
    size: baseFontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  // Clean the rejection text
  const cleanText = stripHTMLTags(applicationText)

  // Wrap the rejection text
  const wrappedLines = wrapText(cleanText, font, baseFontSize, 400)

  // Draw wrapped rejection text below the header
  let y = lineYPosition - baseFontSize - 10

  for (const line of wrappedLines) {
    page.drawText(line, {
      x: 50,
      y,
      size: baseFontSize,
      font,
      color: rgb(0, 0, 0),
    })
    y -= baseFontSize + 4 // Adjust for the next line
  }

  return y // Return the updated Y position
}

interface Section {
  title: string
  content: string
}

export const drawSectionInfo = (
  data: Section[],
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
  // Loop through the data and draw each item
  for (const item of data) {
    // Draw label (bold font)
    page.drawText(item.title, {
      x: x,
      y: y,
      size: baseFontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    })

    // Draw value (regular font)
    page.drawText(item.content, {
      x: x,
      y: y - rowHeight, // Slightly lower than label
      size: baseFontSize,
      font: font,
      color: rgb(0, 0, 0), // Blue for value
    })

    // Move x position for the next column
    x += columnWidth
    itemCount++

    // If we've drawn 4 columns, move to the next row
    if (itemCount === 3) {
      x = margin // Reset x to start position
      y -= rowHeight * 2 + 10 // Move y down for the next row, +10 for padding
      itemCount = 0 // Reset itemCount for the new row
    }
  }

  return y
}

// export const needsToAddPage = (currentYPosition: number) => {
//   if (y < minYPosition) {
//     // Create a new page and reset the x, y positions
//     const newPage = pdfDoc.addPage() // Correct way to add a new page
//     page = newPage // Reassign the new page to `page`

//   }
// }
