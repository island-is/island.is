import { HealthDirectorateHealthConversationRecipientAvailability as Availability } from '@island.is/api/schema'
import {
  getNewConversationPageMode,
  pickClosedRecipient,
} from './recipientAvailability'

const recipient = (availability: Availability, treatmentId?: string) => ({
  availability,
  treatmentId,
})

describe('getNewConversationPageMode', () => {
  it('is contactOnly for an empty list', () => {
    expect(getNewConversationPageMode([])).toBe('contactOnly')
  })

  it('is contactOnly when no recipient ever takes messages', () => {
    expect(
      getNewConversationPageMode([
        recipient(Availability.NEVER),
        recipient(Availability.NEVER),
      ]),
    ).toBe('contactOnly')
  })

  it('is form when at least one recipient is open', () => {
    expect(
      getNewConversationPageMode([
        recipient(Availability.NEVER),
        recipient(Availability.CLOSED),
        recipient(Availability.OPEN),
      ]),
    ).toBe('form')
  })

  it('is allClosed when none are open but one is only closed for now', () => {
    expect(
      getNewConversationPageMode([
        recipient(Availability.NEVER),
        recipient(Availability.CLOSED),
      ]),
    ).toBe('allClosed')
  })
})

describe('pickClosedRecipient', () => {
  it('prefers a clinic, which has no treatmentId, over a care team', () => {
    const team = recipient(Availability.CLOSED, 'treatment-1')
    const clinic = recipient(Availability.CLOSED)
    expect(pickClosedRecipient([team, clinic])).toBe(clinic)
  })

  it('falls back to the first closed recipient', () => {
    const first = recipient(Availability.CLOSED, 'treatment-1')
    const second = recipient(Availability.CLOSED, 'treatment-2')
    expect(pickClosedRecipient([second, first])).toBe(second)
  })

  it('ignores recipients that are open or never available', () => {
    expect(
      pickClosedRecipient([
        recipient(Availability.OPEN),
        recipient(Availability.NEVER),
      ]),
    ).toBeUndefined()
  })
})
