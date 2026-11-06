import { SessionArrangements } from '@island.is/judicial-system/types'

import { Defendant } from '../../modules/repository'
import { formatRequestPdfDefenderName } from './requestPdf'

describe('formatRequestPdfDefenderName', () => {
  it('should return the defendant defender name', () => {
    expect(
      formatRequestPdfDefenderName(
        { defenderName: 'Jón Jónsson' } as Defendant,
        undefined,
        'Ekki skráður',
      ),
    ).toBe('Jón Jónsson')
  })

  it('should return the no-defender label when defenderName is missing', () => {
    expect(
      formatRequestPdfDefenderName(
        { defenderName: null } as unknown as Defendant,
        undefined,
        'Ekki skráður',
      ),
    ).toBe('Ekki skráður')
  })

  it('should return the no-defender label for spokesperson session arrangements', () => {
    expect(
      formatRequestPdfDefenderName(
        { defenderName: 'Jón Jónsson' } as Defendant,
        SessionArrangements.ALL_PRESENT_SPOKESPERSON,
        'Ekki skráður',
      ),
    ).toBe('Ekki skráður')
  })
})
