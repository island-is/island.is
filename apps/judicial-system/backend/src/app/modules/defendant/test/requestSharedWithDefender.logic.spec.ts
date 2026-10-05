import { RequestSharedWithDefender } from '@island.is/judicial-system/types'

import { getMostPermissiveRequestSharedWithDefender } from '../requestSharedWithDefender.logic'

describe('getMostPermissiveRequestSharedWithDefender', () => {
  test('returns null when every value is null or undefined', () => {
    expect(
      getMostPermissiveRequestSharedWithDefender([null, undefined, null]),
    ).toBeNull()
  })

  test('returns the only set value', () => {
    expect(
      getMostPermissiveRequestSharedWithDefender([
        null,
        RequestSharedWithDefender.COURT_DATE,
        undefined,
      ]),
    ).toBe(RequestSharedWithDefender.COURT_DATE)
  })

  test('prefers READY_FOR_COURT over COURT_DATE and NOT_SHARED', () => {
    expect(
      getMostPermissiveRequestSharedWithDefender([
        RequestSharedWithDefender.NOT_SHARED,
        RequestSharedWithDefender.READY_FOR_COURT,
        RequestSharedWithDefender.COURT_DATE,
      ]),
    ).toBe(RequestSharedWithDefender.READY_FOR_COURT)
  })

  test('prefers COURT_DATE over NOT_SHARED', () => {
    expect(
      getMostPermissiveRequestSharedWithDefender([
        RequestSharedWithDefender.NOT_SHARED,
        RequestSharedWithDefender.COURT_DATE,
      ]),
    ).toBe(RequestSharedWithDefender.COURT_DATE)
  })
})
