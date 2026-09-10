import { Application } from '@island.is/application/types'
import { getCodes } from './formUtils'

// getCodes drives the charge — the codes here map to real fees, so assert the
// exact set per type and delivery method.
const appWith = (applicationFor?: string, deliveryMethod?: string): Application =>
  ({
    answers: {
      ...(applicationFor ? { applicationFor } : {}),
      ...(deliveryMethod ? { delivery: { deliveryMethod } } : {}),
    },
    externalData: {},
  } as unknown as Application)

describe('getCodes', () => {
  it('charges the B-temp code with no delivery fee for district pickup', () => {
    expect(getCodes(appWith('B-temp', 'district'))).toEqual([{ code: 'AY114' }])
  })

  it('charges the B-full code plus the delivery fee for postal delivery', () => {
    expect(getCodes(appWith('B-full', 'post'))).toEqual([
      { code: 'AY110' },
      { code: 'AY145' },
    ])
  })

  it('charges the renewal-65 code', () => {
    expect(getCodes(appWith('B-full-renewal-65', 'district'))).toEqual([
      { code: 'AY113' },
    ])
  })

  it('falls back to the B-full code when applicationFor is unset', () => {
    expect(getCodes(appWith(undefined, 'district'))).toEqual([{ code: 'AY110' }])
  })
})
