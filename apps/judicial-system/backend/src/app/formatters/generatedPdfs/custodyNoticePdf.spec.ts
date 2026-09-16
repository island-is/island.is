import { SessionArrangements } from '@island.is/judicial-system/types'

import { Case } from '../../modules/repository'
import { formatCustodyNoticeDefender } from './custodyNoticePdf'

describe('formatCustodyNoticeDefender', () => {
  it('should format the first defendant defender with phone and email', () => {
    expect(
      formatCustodyNoticeDefender({
        defendants: [
          {
            defenderName: 'Jón Jónsson',
            defenderPhoneNumber: '8610000',
            defenderEmail: 'jon@verjandi.is',
          },
        ],
      } as Case),
    ).toBe('Jón Jónsson, s. 8610000, jon@verjandi.is')
  })

  it('should use the first defendant when several are present', () => {
    expect(
      formatCustodyNoticeDefender({
        defendants: [
          { defenderName: 'Fyrsti' },
          { defenderName: 'Annar' },
        ],
      } as Case),
    ).toBe('Fyrsti')
  })

  it('should return Ekki skráður when the first defendant has no defender', () => {
    expect(
      formatCustodyNoticeDefender({
        defendants: [{ defenderName: null }],
      } as unknown as Case),
    ).toBe('Ekki skráður')
  })

  it('should return Ekki skráður for spokesperson session arrangements', () => {
    expect(
      formatCustodyNoticeDefender({
        sessionArrangements: SessionArrangements.ALL_PRESENT_SPOKESPERSON,
        defendants: [{ defenderName: 'Jón Jónsson' }],
      } as Case),
    ).toBe('Ekki skráður')
  })

  it('should omit missing phone or email', () => {
    expect(
      formatCustodyNoticeDefender({
        defendants: [{ defenderName: 'Jón Jónsson' }],
      } as Case),
    ).toBe('Jón Jónsson')
  })
})
