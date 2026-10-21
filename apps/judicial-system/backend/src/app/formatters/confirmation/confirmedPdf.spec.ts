import { PDFDocument, PDFFont } from 'pdf-lib'

import { CaseFileCategory } from '@island.is/judicial-system/types'

import {
  calculatePt,
  confirmationFontSize,
  confirmationLayout,
} from '../pdfHelpers'
import { createConfirmedPdf } from './confirmedPdf'

describe('createConfirmedPdf', () => {
  const pageWidth = 595
  const pageHeight = 842
  const confirmation = {
    actor: 'Dóra Dómari',
    title: 'Héraðsdómari',
    institution: 'Héraðsdómur Reykjavíkur',
    date: new Date('2026-10-09T10:00:00Z'),
  }

  const {
    pageMargin,
    shadowHeight,
    coatOfArmsWidth,
    coatOfArmsHeight,
    offset,
    titleHeight,
    padding,
    boxLineHeight,
  } = confirmationLayout
  const totalWidth = pageWidth - pageMargin * 2
  const contentX = pageMargin + offset + coatOfArmsWidth
  const contentWidth = totalWidth - coatOfArmsWidth
  const contentTop = pageMargin - offset
  const boxTop = contentTop + titleHeight
  const boxHeight = shadowHeight - titleHeight
  const fontSize = calculatePt(confirmationFontSize)

  let pdf: Buffer
  let drawRectangle: jest.SpyInstance
  let drawText: jest.SpyInstance

  beforeEach(async () => {
    const source = await PDFDocument.create()
    source.addPage([pageWidth, pageHeight])
    pdf = Buffer.from(await source.save())

    const pdfDoc = await PDFDocument.load(new Uint8Array(pdf))
    const page = pdfDoc.getPage(0)
    drawRectangle = jest.spyOn(page, 'drawRectangle')
    drawText = jest.spyOn(page, 'drawText')
    jest.spyOn(PDFDocument, 'load').mockResolvedValueOnce(pdfDoc)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const rectangles = () =>
    drawRectangle.mock.calls.map(([options]) => ({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
    }))

  const texts = () => drawText.mock.calls.map(([text]) => text)

  const positions = () =>
    drawText.mock.calls.map(([, options]) => ({ x: options.x, y: options.y }))

  // The fonts the stamp was drawn with: the title is bold, the rest regular
  const fonts = () => ({
    bold: drawText.mock.calls[0][1].font as PDFFont,
    regular: drawText.mock.calls[1][1].font as PDFFont,
  })

  // Every line is placed by the middle of its cap height, measured from the
  // top of the page like pdfkit does and flipped for pdf-lib
  const lineY = (centerY: number, regular: PDFFont) =>
    pageHeight -
    (centerY + regular.heightAtSize(fontSize, { descender: false }) / 2)

  const boxLines = (regular: PDFFont) => {
    const titleCenterY = boxTop + (boxHeight - boxLineHeight) / 2

    return {
      title: lineY(titleCenterY, regular),
      content: lineY(titleCenterY + boxLineHeight, regular),
    }
  }

  it('draws the shared stamp layout', async () => {
    await createConfirmedPdf(confirmation, pdf, CaseFileCategory.RULING)

    const [shadow, coatOfArmsBox, titleBox] = rectangles()

    expect(shadow).toEqual({
      x: pageMargin,
      y: pageHeight - pageMargin - shadowHeight,
      width: totalWidth,
      height: shadowHeight,
    })
    expect(coatOfArmsBox).toEqual({
      x: pageMargin + offset,
      y: pageHeight - contentTop - coatOfArmsHeight,
      width: coatOfArmsWidth,
      height: coatOfArmsHeight,
    })
    expect(titleBox).toEqual({
      x: contentX,
      y: pageHeight - contentTop - titleHeight,
      width: contentWidth,
      height: titleHeight,
    })
    expect(texts().slice(0, 3)).toEqual([
      'Réttarvörslugátt',
      'Rafræn staðfesting',
      '09.10.2026',
    ])

    const { bold, regular } = fonts()
    const titleX = contentX + padding
    const titleY = lineY(contentTop + titleHeight / 2, regular)

    expect(positions().slice(0, 3)).toEqual([
      { x: titleX, y: titleY },
      {
        x: titleX + bold.widthOfTextAtSize('Réttarvörslugátt  ', fontSize),
        y: titleY,
      },
      {
        x:
          contentX +
          contentWidth -
          padding -
          regular.widthOfTextAtSize('09.10.2026', fontSize),
        y: titleY,
      },
    ])
    for (const [, options] of drawText.mock.calls) {
      expect(options.size).toBe(fontSize)
    }
  })

  it.each([
    CaseFileCategory.RULING,
    CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
  ])('draws the court and the approver on a %s', async (fileType) => {
    await createConfirmedPdf(confirmation, pdf, fileType)

    const boxes = rectangles().slice(3)

    expect(boxes).toEqual([
      {
        x: contentX,
        y: pageHeight - contentTop - titleHeight - boxHeight,
        width: contentWidth / 2,
        height: boxHeight,
      },
      {
        x: contentX + contentWidth / 2,
        y: pageHeight - contentTop - titleHeight - boxHeight,
        width: contentWidth / 2,
        height: boxHeight,
      },
    ])
    expect(texts().slice(3)).toEqual([
      'Dómstóll',
      'Héraðsdómur Reykjavíkur',
      'Samþykktaraðili',
      'Dóra Dómari héraðsdómari',
    ])

    const lines = boxLines(fonts().regular)
    const courtX = contentX + padding
    const approverX = contentX + contentWidth / 2 + padding

    expect(positions().slice(3)).toEqual([
      { x: courtX, y: lines.title },
      { x: courtX, y: lines.content },
      { x: approverX, y: lines.title },
      { x: approverX, y: lines.content },
    ])
  })

  it('draws only the court on a court record', async () => {
    await createConfirmedPdf(confirmation, pdf, CaseFileCategory.COURT_RECORD)

    const boxes = rectangles().slice(3)

    expect(boxes).toEqual([
      {
        x: contentX,
        y: pageHeight - contentTop - titleHeight - boxHeight,
        width: contentWidth,
        height: boxHeight,
      },
    ])
    expect(texts().slice(3)).toEqual(['Dómstóll', 'Héraðsdómur Reykjavíkur'])

    const lines = boxLines(fonts().regular)
    const courtX = contentX + padding

    expect(positions().slice(3)).toEqual([
      { x: courtX, y: lines.title },
      { x: courtX, y: lines.content },
    ])
  })

  it('shortens an approver that does not fit the box but never the court', async () => {
    const longConfirmation = {
      ...confirmation,
      actor: 'Guðríður Þorbjörnsdóttir Hallvarðsdóttir Sigurbjörnsdóttir',
      title: 'Settur héraðsdómari við Héraðsdóm Reykjavíkur',
      institution:
        'Héraðsdómur Reykjavíkur, Reykjaness, Vesturlands og Vestfjarða',
    }

    await createConfirmedPdf(longConfirmation, pdf, CaseFileCategory.RULING)

    const [, , , , institution, , approver] = texts()

    expect(institution).toBe(longConfirmation.institution)
    expect(approver.endsWith('...')).toBe(true)
    expect(approver.length).toBeLessThan(
      `${longConfirmation.actor} ${longConfirmation.title}`.length,
    )
  })

  it('returns the stamped pdf', async () => {
    const result = await createConfirmedPdf(
      confirmation,
      pdf,
      CaseFileCategory.COURT_RECORD,
    )

    expect(result.subarray(0, 4).toString()).toBe('%PDF')
    expect(drawText).toHaveBeenCalled()
  })
})
