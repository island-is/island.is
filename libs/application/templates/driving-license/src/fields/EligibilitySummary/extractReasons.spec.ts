import { RequirementKey } from '@island.is/api/schema'
import type { ApplicationEligibility } from '@island.is/api/schema'
import { extractReasons } from './extractReasons'
import { requirementsMessages } from '../../lib/messages'
import { ReviewSectionState } from './ReviewSection/types'

// Cast keeps the test resilient to the codegen-refreshed @island.is/api/schema
// (messageIs/messageEn land there via the resolver model); we only care about
// the locale selection the cast can't change.
const eligibilityWith = (
  requirement: Record<string, unknown>,
): ApplicationEligibility =>
  ({
    isEligible: false,
    requirements: [requirement],
  } as unknown as ApplicationEligibility)

// HAS_NO_SIGNATURE is an uncurated denial: it falls through to the generic
// branch, so the RLS description (when present) is what actually renders.
const UNCURATED_DENIAL = {
  key: RequirementKey.hasNoSignature,
  requirementMet: false,
  messageIs: 'Einstaklingur hefur ekki undirskrift á skrá',
  messageEn: 'Person has no signature on file',
}

describe('extractReasons — RLS description locale selection', () => {
  it('renders the Icelandic RLS text for an is locale', () => {
    const [step] = extractReasons(eligibilityWith(UNCURATED_DENIAL), 'is')

    expect(step.description).toBe(UNCURATED_DENIAL.messageIs)
    expect(step.state).toBe(ReviewSectionState.requiresAction)
  })

  it('renders the English RLS text for an en locale', () => {
    const [step] = extractReasons(eligibilityWith(UNCURATED_DENIAL), 'en')

    expect(step.description).toBe(UNCURATED_DENIAL.messageEn)
  })

  it('defaults to Icelandic when no locale is passed', () => {
    const [step] = extractReasons(eligibilityWith(UNCURATED_DENIAL))

    expect(step.description).toBe(UNCURATED_DENIAL.messageIs)
  })

  it('falls back to the generic message (never Icelandic) for an en user with no English RLS text', () => {
    const [step] = extractReasons(
      eligibilityWith({
        key: RequirementKey.hasNoSignature,
        requirementMet: false,
        messageIs: 'Einstaklingur hefur ekki undirskrift á skrá',
        // messageEn intentionally absent
      }),
      'en',
    )

    expect(step.description).toBe(
      requirementsMessages.rlsDefaultDeniedDescription,
    )
    expect(step.description).not.toBe(
      'Einstaklingur hefur ekki undirskrift á skrá',
    )
  })

  it('falls back to the generic message when RLS has no description at all', () => {
    const [step] = extractReasons(
      eligibilityWith({
        key: RequirementKey.hasNoSignature,
        requirementMet: false,
      }),
      'is',
    )

    expect(step.description).toBe(
      requirementsMessages.rlsDefaultDeniedDescription,
    )
  })

  it('keeps curated copy ahead of the RLS text where we map the code ourselves', () => {
    // HAS_POINTS is curated: our own message must win over the RLS description.
    const [step] = extractReasons(
      eligibilityWith({
        key: RequirementKey.hasPoints,
        requirementMet: false,
        messageIs: 'RLS texti sem á ekki að birtast',
        messageEn: 'RLS text that should not show',
      }),
      'is',
    )

    expect(step.description).toBe(requirementsMessages.hasPointsOrDeprivation)
  })
})
