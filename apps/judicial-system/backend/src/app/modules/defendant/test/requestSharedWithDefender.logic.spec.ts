import { RequestSharedWithDefender } from '@island.is/judicial-system/types'

import {
  getMostPermissiveRequestSharedWithDefender,
  getMostPermissiveRequestSharedWithDefenderForNationalId,
  getMostPermissiveRequestSharedWithDefenderForRecipient,
} from '../requestSharedWithDefender.logic'

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

describe('getMostPermissiveRequestSharedWithDefenderForNationalId', () => {
  const nationalId = '0101010101'

  test('returns null when there are no defendants', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForNationalId([], nationalId),
    ).toBeNull()
  })

  test('aggregates only defendants that match the national id', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForNationalId(
        [
          {
            defenderNationalId: nationalId,
            requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
          },
          {
            defenderNationalId: nationalId,
            requestSharedWithDefender:
              RequestSharedWithDefender.READY_FOR_COURT,
          },
          {
            defenderNationalId: '9999999999',
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
        ],
        nationalId,
      ),
    ).toBe(RequestSharedWithDefender.READY_FOR_COURT)
  })

  test('falls back to all defendants when the national id matches nobody', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForNationalId(
        [
          {
            defenderNationalId: '1111111111',
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
          {
            defenderNationalId: '2222222222',
            requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
          },
        ],
        nationalId,
      ),
    ).toBe(RequestSharedWithDefender.COURT_DATE)
  })
})

describe('getMostPermissiveRequestSharedWithDefenderForRecipient', () => {
  const email = 'defender@example.com'
  const nationalId = '0101010101'

  test('returns null when there are no defendants', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForRecipient([], {
        email,
        nationalId,
      }),
    ).toBeNull()
  })

  test('returns null when the recipient email is missing', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForRecipient(
        [
          {
            defenderEmail: email,
            defenderNationalId: nationalId,
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
        ],
        { nationalId },
      ),
    ).toBeNull()
  })

  test('aggregates by normalized email when national id is absent', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForRecipient(
        [
          {
            defenderEmail: '  Defender@Example.com ',
            requestSharedWithDefender: RequestSharedWithDefender.NOT_SHARED,
          },
          {
            defenderEmail: email,
            requestSharedWithDefender:
              RequestSharedWithDefender.READY_FOR_COURT,
          },
          {
            defenderEmail: 'other@example.com',
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
        ],
        { email },
      ),
    ).toBe(RequestSharedWithDefender.READY_FOR_COURT)
  })

  test('does not fall back to all defendants when email matches nobody', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForRecipient(
        [
          {
            defenderEmail: 'other@example.com',
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
        ],
        { email },
      ),
    ).toBeNull()
  })

  test('when national id is present, requires both email and national id', () => {
    expect(
      getMostPermissiveRequestSharedWithDefenderForRecipient(
        [
          {
            defenderEmail: email,
            defenderNationalId: nationalId,
            requestSharedWithDefender: RequestSharedWithDefender.COURT_DATE,
          },
          {
            defenderEmail: email,
            defenderNationalId: '9999999999',
            requestSharedWithDefender:
              RequestSharedWithDefender.READY_FOR_COURT,
          },
        ],
        { email, nationalId },
      ),
    ).toBe(RequestSharedWithDefender.COURT_DATE)
  })
})
