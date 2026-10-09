import { PDFDocument } from 'pdf-lib'

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
  } = confirmationLayout
  const totalWidth = pageWidth - pageMargin * 2
  const contentX = pageMargin + offset + coatOfArmsWidth
  const contentWidth = totalWidth - coatOfArmsWidth
  const contentTop = pageMargin - offset
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
