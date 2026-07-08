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

describe('mapRawStatusToBankTransferPendingStatus', () => {
  const scaUrl = 'https://stage.blikk.tech/sca/p-1'

  it.each<[string, string | undefined, BankTransferPendingStatus]>([
    ['SCA_REQUIRED', scaUrl, BankTransferPendingStatus.SCA_REQUIRED],
    ['SCA_REQUIRED', undefined, BankTransferPendingStatus.SCA_REQUIRED],
    // DRAFT only advances once the payer initiates — with an SCA URL present the payer
    // must act, so it renders the SCA UI (prevents a dots→QR flicker right after create).
    ['DRAFT', scaUrl, BankTransferPendingStatus.SCA_REQUIRED],
    ['DRAFT', undefined, BankTransferPendingStatus.PROCESSING],
    // …but an onboarding URL is handled via redirect, not the SCA UI.
    ['DRAFT', 'https://light.blikk.tech/onboarding/p-1', BankTransferPendingStatus.PROCESSING],
    ['PENDING', scaUrl, BankTransferPendingStatus.PROCESSING],
    ['SCA_COMPLETE', scaUrl, BankTransferPendingStatus.PROCESSING],
    // Unknown statuses fall back to processing (keep polling, no SCA UI).
    ['WAT', scaUrl, BankTransferPendingStatus.PROCESSING],
  ])('maps %s (url: %s) to %s', (rawStatus, url, expected) => {
    expect(mapRawStatusToBankTransferPendingStatus(rawStatus, url)).toBe(expected)
  })
})

describe('isOnboardingRequired', () => {
  it('is true for a DRAFT payment whose SCA URL points at the onboarding app', () => {
    expect(
      isOnboardingRequired('DRAFT', 'https://light.blikk.tech/onboarding/p-1'),
    ).toBe(true)
  })

  it('is false for a DRAFT payment with a regular SCA URL', () => {
    expect(
      isOnboardingRequired('DRAFT', 'https://stage.blikk.tech/sca/p-1'),
    ).toBe(false)
  })

  it('is false for a DRAFT payment without an SCA URL (back-channel)', () => {
    expect(isOnboardingRequired('DRAFT', undefined)).toBe(false)
  })

  it('is false for non-DRAFT statuses regardless of the URL', () => {
    expect(
      isOnboardingRequired(
        'SCA_REQUIRED',
        'https://light.blikk.tech/onboarding/p-1',
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
