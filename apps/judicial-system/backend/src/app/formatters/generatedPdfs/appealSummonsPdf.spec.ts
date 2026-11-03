import PDFDocument from 'pdfkit'

import {
  AppealSummonsAppellantSide,
  CaseType,
} from '@island.is/judicial-system/types'

import { Case } from '../../modules/repository'
import { createAppealSummons } from './appealSummonsPdf'

describe('createAppealSummons', () => {
  const theCase = {
    type: CaseType.INDICTMENT,
    courtCaseNumber: 'S-1/2026',
    rulingDate: new Date('2026-05-04T12:00:00.000Z'),
    court: { name: 'Héraðsdómur Reykjavíkur' },
    defendants: [
      {
        id: 'defendant-1',
        name: 'Gervi 1',
        nationalId: '0101303019',
        address: 'Laugavegur 1',
      },
    ],
  } as Case

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders a pdf', async () => {
    const pdf = await createAppealSummons(
      theCase,
      [
        {
          defendantId: 'defendant-1',
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims: 'Kröfur áfrýjanda.',
        },
      ],
      { name: 'Hermína Haralds', title: 'Skrifstofustjóri' },
    )

    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  })

  // Blank lines typed in the claims textarea must reach PDFKit as newlines in
  // one text() call. Splitting and calling text('') for empty lines used to
  // drop the gap so added text sat directly under the previous sentence.
  it('passes claims with blank lines as a single text block', async () => {
    const textCalls: string[] = []
    const originalText = PDFDocument.prototype.text

    jest
      .spyOn(PDFDocument.prototype, 'text')
      .mockImplementation(function (
        this: PDFKit.PDFDocument,
        text: string,
        ...args: unknown[]
      ) {
        if (typeof text === 'string') {
          textCalls.push(text)
        }

        return originalText.apply(this, [text, ...args] as never)
      })

    const claims = 'Ákærði krefst þess að hann verði sýknaður.\n\nNr 2'

    await createAppealSummons(
      theCase,
      [
        {
          defendantId: 'defendant-1',
          appellantSide: AppealSummonsAppellantSide.DEFENCE,
          claims,
        },
      ],
      { name: 'Hermína Haralds', title: 'Skrifstofustjóri' },
    )

    expect(textCalls).toContain(claims)
  })
})
