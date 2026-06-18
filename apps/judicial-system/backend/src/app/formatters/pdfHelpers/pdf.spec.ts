import { PDFDocument, StandardFonts } from 'pdf-lib'

import { PdfDocument } from './pdf'

// A4 in points (must match pdf.ts)
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

const expectA4Size = (
  width: number,
  height: number,
  tolerance = 0.01,
): void => {
  const isPortrait =
    Math.abs(width - A4_WIDTH) <= tolerance &&
    Math.abs(height - A4_HEIGHT) <= tolerance
  const isLandscape =
    Math.abs(width - A4_HEIGHT) <= tolerance &&
    Math.abs(height - A4_WIDTH) <= tolerance
  expect(isPortrait || isLandscape).toBe(true)
}

describe('PdfDocument mergeDocument scaling', () => {
  it('scales merged pages smaller than A4 up to A4 so all pages have consistent size', async () => {
    // Create a PDF with one page smaller than A4 (e.g. small form / letter)
    const smallPdf = await PDFDocument.create()
    const smallWidth = 400
    const smallHeight = 500
    const page = smallPdf.addPage([smallWidth, smallHeight])
    const font = await smallPdf.embedFont(StandardFonts.Helvetica)
    page.drawText('Small page content', {
      x: 20,
      y: smallHeight - 30,
      font,
      size: 12,
    })
    const smallPdfBytes = await smallPdf.save()
    const smallPdfBuffer = Buffer.from(smallPdfBytes)

    const doc = await PdfDocument()
    await doc.mergeDocument(smallPdfBuffer)
    const resultBuffer = await doc.getContents()

    const resultPdf = await PDFDocument.load(new Uint8Array(resultBuffer))
    expect(resultPdf.getPageCount()).toBe(1)
    const [mergedPage] = resultPdf.getPages()
    const { width, height } = mergedPage.getSize()
    expectA4Size(width, height)
    expect(width).not.toBe(smallWidth)
    expect(height).not.toBe(smallHeight)
  })

  it('scales merged pages larger than A4 down to A4', async () => {
    const largePdf = await PDFDocument.create()
    const largeWidth = 800
    const largeHeight = 1000
    const page = largePdf.addPage([largeWidth, largeHeight])
    const font = await largePdf.embedFont(StandardFonts.Helvetica)
    page.drawText('Large page content', {
      x: 20,
      y: largeHeight - 30,
      font,
      size: 12,
    })
    const largePdfBuffer = Buffer.from(await largePdf.save())

    const doc = await PdfDocument()
    await doc.mergeDocument(largePdfBuffer)
    const resultPdf = await PDFDocument.load(
      new Uint8Array(await doc.getContents()),
    )
    const { width, height } = resultPdf.getPage(0).getSize()
    expectA4Size(width, height)
  })

  it('normalizes mixed merge: one small and one large page both become A4', async () => {
    const smallPdf = await PDFDocument.create()
    smallPdf.addPage([350, 450])
    const smallBuffer = Buffer.from(await smallPdf.save())

    const largePdf = await PDFDocument.create()
    largePdf.addPage([700, 900])
    const largeBuffer = Buffer.from(await largePdf.save())

    const doc = await PdfDocument()
    await doc.mergeDocument(smallBuffer)
    await doc.mergeDocument(largeBuffer)
    const resultPdf = await PDFDocument.load(
      new Uint8Array(await doc.getContents()),
    )
    expect(resultPdf.getPageCount()).toBe(2)
    resultPdf.getPages().forEach((p) => {
      const { width, height } = p.getSize()
      expectA4Size(width, height)
    })
  })
})
