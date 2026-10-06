import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

import {
  formatAppealSummonsClosingPlaceAndDate,
  formatAppealSummonsDefendantNames,
  formatAppealSummonsIntro,
} from './appealSummonsPdf.text'

describe('formatAppealSummonsDefendantNames', () => {
  it('returns a single name unchanged', () => {
    expect(formatAppealSummonsDefendantNames(['Jón Sigurður Jónsson'])).toBe(
      'Jón Sigurður Jónsson',
    )
  })

  it('joins several defendants with a comma and og', () => {
    expect(
      formatAppealSummonsDefendantNames([
        'Jón Jónsson',
        'Guðrún Jónsdóttir',
        'Páll Pálsson',
      ]),
    ).toBe('Jón Jónsson, Guðrún Jónsdóttir og Páll Pálsson')
  })
})

describe('formatAppealSummonsIntro', () => {
  const rulingDate = new Date('2026-05-04T12:00:00.000Z')
  const appealDate = new Date('2026-05-20T12:00:00.000Z')
  const shared = {
    courtName: 'Héraðsdómur Reykjavíkur',
    rulingDate,
    courtCaseNumber: 'S-123/2026',
    defendantNames: ['Jón Sigurður Jónsson'],
  }

  it('renders the defence variant with the appealing defendant', () => {
    expect(
      formatAppealSummonsIntro({
        ...shared,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        defendantName: 'Jón Sigurður Jónsson',
        defendantNationalId: '0101303019',
        defendantAddress: 'Laugavegur 1, Reykjavík',
        appealDate,
      }),
    ).toContain('Ákærði, Jón Sigurður Jónsson, kennitala 010130-3019')
  })

  it('uses the court name in the genitive', () => {
    expect(
      formatAppealSummonsIntro({
        ...shared,
        appellantSide: AppealSummonsAppellantSide.DEFENCE,
        defendantName: 'Jón Sigurður Jónsson',
        defendantNationalId: '0101303019',
        defendantAddress: 'Laugavegur 1',
        appealDate,
      }),
    ).toContain('dómi Héraðsdóms Reykjavíkur')
  })

  it('renders the prosecution variant without naming an appealing defendant', () => {
    const intro = formatAppealSummonsIntro({
      ...shared,
      appellantSide: AppealSummonsAppellantSide.PROSECUTION,
    })

    expect(intro).toContain(
      'Að hann hefur ákveðið að áfrýja til Landsréttar dómi Héraðsdóms Reykjavíkur',
    )
    expect(intro).not.toContain('Ákærði,')
  })

  it('lists several defendants in the case caption', () => {
    expect(
      formatAppealSummonsIntro({
        ...shared,
        appellantSide: AppealSummonsAppellantSide.PROSECUTION,
        defendantNames: ['Jón Jónsson', 'Guðrún Jónsdóttir'],
      }),
    ).toContain('Ákæruvaldið gegn Jón Jónsson og Guðrún Jónsdóttir')
  })
})

describe('formatAppealSummonsClosingPlaceAndDate', () => {
  it('places the office in Reykjavík', () => {
    expect(
      formatAppealSummonsClosingPlaceAndDate(new Date('2026-06-05T12:00:00.000Z')),
    ).toContain('Skrifstofu ríkissaksóknara, Reykjavík')
  })
})
