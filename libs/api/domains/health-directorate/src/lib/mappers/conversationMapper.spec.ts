import {
  ConversationReplyBlockedReason,
  MessagingDayType,
  RecipientCreateBlockedReason,
} from '@island.is/clients/health-directorate'
import {
  HealthConversationRecipientAvailabilityEnum as RecipientAvailability,
  HealthConversationReplyAvailabilityEnum as ReplyAvailability,
} from '../models/enums'
import {
  getClosesAt,
  getTodaysWindow,
  mapOpeningWindow,
  toRecipientAvailability,
  toReplyAvailability,
} from './conversationMapper'

// The client package index pulls in libs/logging, which does not type-check
// under this lib's jest config. The mapper only needs the generated enums.
jest.mock('@island.is/clients/health-directorate', () =>
  jest.requireActual(
    '../../../../../../clients/health-directorate/src/lib/clients/health/gen/fetch/types.gen',
  ),
)

describe('toReplyAvailability', () => {
  it('is CAN_REPLY when the patient can reply, whatever the reason says', () => {
    expect(
      toReplyAvailability({
        patientCanReply: true,
        replyBlockedReason: ConversationReplyBlockedReason.REPLIES_DISABLED,
      }),
    ).toBe(ReplyAvailability.CAN_REPLY)
  })

  it('is WAITING while awaiting acknowledgement', () => {
    expect(
      toReplyAvailability({
        patientCanReply: false,
        replyBlockedReason:
          ConversationReplyBlockedReason.AWAITING_ACKNOWLEDGEMENT,
      }),
    ).toBe(ReplyAvailability.WAITING)
  })

  it('is EXPIRED when the reply window has passed', () => {
    expect(
      toReplyAvailability({
        patientCanReply: false,
        replyBlockedReason: ConversationReplyBlockedReason.REPLY_WINDOW_EXPIRED,
      }),
    ).toBe(ReplyAvailability.EXPIRED)
  })

  it.each([
    ConversationReplyBlockedReason.MISSING_RECIPIENT,
    ConversationReplyBlockedReason.REPLIES_DISABLED,
    ConversationReplyBlockedReason.NO_REPLY_GROUP,
    ConversationReplyBlockedReason.MESSAGING_NOT_ALLOWED,
    ConversationReplyBlockedReason.PATIENT_REPLY_NOT_ALLOWED,
    undefined,
  ])('is NEVER when blocked by %s', (replyBlockedReason) => {
    expect(
      toReplyAvailability({ patientCanReply: false, replyBlockedReason }),
    ).toBe(ReplyAvailability.NEVER)
  })
})

describe('toRecipientAvailability', () => {
  it('is OPEN when a conversation can be created', () => {
    expect(toRecipientAvailability({ canCreateConversation: true })).toBe(
      RecipientAvailability.OPEN,
    )
  })

  it('is CLOSED outside the messaging window', () => {
    expect(
      toRecipientAvailability({
        canCreateConversation: false,
        conversationBlockedReason:
          RecipientCreateBlockedReason.OUTSIDE_MESSAGING_WINDOW,
      }),
    ).toBe(RecipientAvailability.CLOSED)
  })

  it.each([
    RecipientCreateBlockedReason.MESSAGING_NOT_ALLOWED,
    RecipientCreateBlockedReason.PATIENT_INITIATED_NOT_ALLOWED,
    RecipientCreateBlockedReason.NO_ALLOWED_TYPES,
    undefined,
  ])('is NEVER when blocked by %s', (conversationBlockedReason) => {
    expect(
      toRecipientAvailability({
        canCreateConversation: false,
        conversationBlockedReason,
      }),
    ).toBe(RecipientAvailability.NEVER)
  })
})

describe('mapOpeningWindow', () => {
  it('is undefined without a window', () => {
    expect(mapOpeningWindow(undefined)).toBeUndefined()
  })

  it('flags 00:00:00-23:59:59 as all day', () => {
    expect(
      mapOpeningWindow({ windowOpen: '00:00:00', windowClose: '23:59:59' }),
    ).toEqual({
      windowOpen: '00:00:00',
      windowClose: '23:59:59',
      isAllDay: true,
    })
  })

  it('does not flag regular hours as all day', () => {
    expect(
      mapOpeningWindow({ windowOpen: '08:00:00', windowClose: '16:00:00' })
        ?.isAllDay,
    ).toBe(false)
  })
})

describe('getTodaysWindow', () => {
  const openingHours = {
    weekday: { windowOpen: '08:00:00', windowClose: '16:00:00' },
    weekend: { windowOpen: '10:00:00', windowClose: '14:00:00' },
  }

  it('picks the window for the day type', () => {
    expect(
      getTodaysWindow({ dayType: MessagingDayType.WEEKDAY, openingHours }),
    ).toBe(openingHours.weekday)
    expect(
      getTodaysWindow({ dayType: MessagingDayType.WEEKEND, openingHours }),
    ).toBe(openingHours.weekend)
  })

  it('is undefined when closed on that kind of day', () => {
    expect(
      getTodaysWindow({ dayType: MessagingDayType.HOLIDAY, openingHours }),
    ).toBeUndefined()
  })
})

describe('getClosesAt', () => {
  const dayWindow = { windowOpen: '08:00:00', windowClose: '16:00:00' }
  const nightWindow = { windowOpen: '22:00:00', windowClose: '02:00:00' }

  it('is todays close time while open', () => {
    expect(
      getClosesAt(
        RecipientAvailability.OPEN,
        dayWindow,
        new Date('2026-07-13T15:45:00Z'),
      ),
    ).toEqual(new Date('2026-07-13T16:00:00Z'))
  })

  it.each([RecipientAvailability.CLOSED, RecipientAvailability.NEVER])(
    'is undefined when availability is %s',
    (availability) => {
      expect(
        getClosesAt(availability, dayWindow, new Date('2026-07-13T12:00:00Z')),
      ).toBeUndefined()
    },
  )

  it('is undefined without a window today', () => {
    expect(
      getClosesAt(
        RecipientAvailability.OPEN,
        undefined,
        new Date('2026-07-13T12:00:00Z'),
      ),
    ).toBeUndefined()
  })

  it('is undefined for an all day window', () => {
    expect(
      getClosesAt(
        RecipientAvailability.OPEN,
        { windowOpen: '00:00:00', windowClose: '23:59:59' },
        new Date('2026-07-13T12:00:00Z'),
      ),
    ).toBeUndefined()
  })

  it('is undefined when the close time can not be parsed', () => {
    expect(
      getClosesAt(
        RecipientAvailability.OPEN,
        { windowOpen: '08:00:00', windowClose: 'late' },
        new Date('2026-07-13T12:00:00Z'),
      ),
    ).toBeUndefined()
  })

  it('does not roll a daytime window over when our clock is past the close', () => {
    expect(
      getClosesAt(
        RecipientAvailability.OPEN,
        dayWindow,
        new Date('2026-07-13T16:00:01Z'),
      ),
    ).toEqual(new Date('2026-07-13T16:00:00Z'))
  })

  it('closes tomorrow before midnight in a window that runs past it', () => {
    expect(
      getClosesAt(
        RecipientAvailability.OPEN,
        nightWindow,
        new Date('2026-07-13T23:00:00Z'),
      ),
    ).toEqual(new Date('2026-07-14T02:00:00Z'))
  })

  it('closes today after midnight in a window that runs past it', () => {
    expect(
      getClosesAt(
        RecipientAvailability.OPEN,
        nightWindow,
        new Date('2026-07-14T01:00:00Z'),
      ),
    ).toEqual(new Date('2026-07-14T02:00:00Z'))
  })
})
