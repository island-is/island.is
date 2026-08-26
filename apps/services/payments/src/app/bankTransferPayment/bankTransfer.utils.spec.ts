import {
  BankTransferFailureReason,
  BankTransferStatus,
  BankTransferPendingStatus,
} from './bankTransfer.types'
import {
  deriveBankTransferFailureReason,
  isOnboardingRequired,
  mapRawStatusToBankTransferPendingStatus,
} from './bankTransfer.utils'

const onboardingOrigin = 'https://light.blikk.tech'

describe('mapRawStatusToBankTransferPendingStatus', () => {
  it.each<[string, BankTransferPendingStatus]>([
    // SCA_REQUIRED is the only status that asks the payer to act — with or without a URL, since
    // Blikk omits one for back-channel banks that push to the banking app instead.
    ['SCA_REQUIRED', BankTransferPendingStatus.SCA_REQUIRED],
    // Everything before it is "waiting": Blikk has not yet decided whether there is an SCA URL,
    // so a create-time URL must not put the payer into the SCA UI.
    ['DRAFT', BankTransferPendingStatus.PROCESSING],
    ['PENDING', BankTransferPendingStatus.PROCESSING],
    ['SCA_COMPLETE', BankTransferPendingStatus.PROCESSING],
    // Unknown statuses fall back to processing (keep polling, no SCA UI).
    ['WAT', BankTransferPendingStatus.PROCESSING],
  ])('maps %s to %s', (rawStatus, expected) => {
    expect(mapRawStatusToBankTransferPendingStatus(rawStatus)).toBe(expected)
  })
})

describe('isOnboardingRequired', () => {
  it('is true for a DRAFT payment whose SCA URL points at the onboarding origin', () => {
    expect(
      isOnboardingRequired(
        'DRAFT',
        'https://light.blikk.tech/onboarding/p-1',
        onboardingOrigin,
      ),
    ).toBe(true)
  })

  it('is false for a DRAFT payment with a regular SCA URL', () => {
    expect(
      isOnboardingRequired(
        'DRAFT',
        'https://stage.blikk.tech/sca/p-1',
        onboardingOrigin,
      ),
    ).toBe(false)
  })

  it('compares origins, not substrings — the onboarding host elsewhere in the URL must not match', () => {
    expect(
      isOnboardingRequired(
        'DRAFT',
        'https://stage.blikk.tech/sca/p-1?return=light.blikk.tech',
        onboardingOrigin,
      ),
    ).toBe(false)
  })

  it('follows the configured origin, not a hardcoded host', () => {
    expect(
      isOnboardingRequired(
        'DRAFT',
        'https://onboarding.example.is/p-1',
        'https://onboarding.example.is',
      ),
    ).toBe(true)
  })

  it('is false for an unparsable SCA URL', () => {
    expect(isOnboardingRequired('DRAFT', 'not a url', onboardingOrigin)).toBe(
      false,
    )
  })

  it('is false for a DRAFT payment without an SCA URL (back-channel)', () => {
    expect(isOnboardingRequired('DRAFT', undefined, onboardingOrigin)).toBe(
      false,
    )
  })

  it('is false for non-DRAFT statuses regardless of the URL', () => {
    expect(
      isOnboardingRequired(
        'SCA_REQUIRED',
        'https://light.blikk.tech/onboarding/p-1',
        onboardingOrigin,
      ),
    ).toBe(false)
  })
})

describe('deriveBankTransferFailureReason', () => {
  const fresh = { expiresAt: new Date(Date.now() + 5 * 60 * 1000) }
  const expired = { expiresAt: new Date(Date.now() - 60 * 1000) }

  it.each<
    [BankTransferStatus, { expiresAt: Date }, BankTransferFailureReason | null]
  >([
    // Blikk reports a lapsed TTL as a plain ERROR — expiry is derived from the row.
    [BankTransferStatus.ERROR, expired, BankTransferFailureReason.EXPIRED],
    [BankTransferStatus.ERROR, fresh, BankTransferFailureReason.ERROR],
    // REJECTED/CANCELLED are explicit acts and keep their reasons even past the TTL.
    [BankTransferStatus.REJECTED, expired, BankTransferFailureReason.REJECTED],
    [BankTransferStatus.REJECTED, fresh, BankTransferFailureReason.REJECTED],
    [
      BankTransferStatus.CANCELLED,
      expired,
      BankTransferFailureReason.CANCELLED,
    ],
    [BankTransferStatus.CANCELLED, fresh, BankTransferFailureReason.CANCELLED],
    // Non-failures have no reason.
    [BankTransferStatus.SUCCESS, expired, null],
    [BankTransferStatus.PENDING, expired, null],
  ])('derives %s on %o as %s', (status, row, expectedReason) => {
    expect(deriveBankTransferFailureReason(status, row)).toBe(expectedReason)
  })
})
