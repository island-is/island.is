import { formatDate } from '@island.is/judicial-system/formatters'

import { Alignment, PdfDocument } from '../pdfHelpers/pdf'

interface DigitalCaseFileMetadata {
  name: string
  policeDigitalFileId: string
  policeExternalVendorId: string
  displayDate?: Date
}

export const createDigitalCaseFileMetadataPdf = async (
  file: DigitalCaseFileMetadata,
): Promise<Buffer> => {
  const pageMargin = 70
  const textFontSize = 12
  const titleFontSize = 14
  const bulletIndent = pageMargin + 16
  const valueIndent = pageMargin + 180

  const pdfDocument = await PdfDocument(file.name)

  pdfDocument.setMargins(pageMargin, pageMargin, pageMargin, pageMargin)

  pdfDocument.addPage().addText(file.name, titleFontSize, {
    bold: true,
    alignment: Alignment.Center,
    marginBottom: 8,
  })

  pdfDocument
    .addText(`• Gagna nr: `, textFontSize, {
      bold: true,
      newLine: false,
      position: { x: bulletIndent },
    })
    .addText(file.policeDigitalFileId, textFontSize, {
      position: { x: valueIndent },
    })

  pdfDocument
    .addText(`• Upptaka nr: `, textFontSize, {
      bold: true,
      newLine: false,
      position: { x: bulletIndent },
    })
    .addText(file.policeExternalVendorId, textFontSize, {
      position: { x: valueIndent },
    })

  pdfDocument
    .addText(`• Dagsetning stofnað: `, textFontSize, {
      bold: true,
      newLine: false,
      position: { x: bulletIndent },
    })
    .addText(formatDate(file.displayDate?.toISOString()) ?? '', textFontSize, {
      position: { x: valueIndent },
    })

  return pdfDocument.getContents()
}
