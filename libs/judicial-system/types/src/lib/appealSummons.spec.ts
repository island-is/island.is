import {
  AppealSummonsAction,
  canIssueAppealSummons,
  canPerformAppealSummonsAction,
  getAppealSummonsStatus,
} from './appealSummons'
import { InstitutionType } from './institution'
import type { InstitutionUser } from './user'
import { UserRole } from './user'

const staff = {
  role: UserRole.PUBLIC_PROSECUTOR_STAFF,
  institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
} as InstitutionUser

const publicProsecutor = {
  role: UserRole.PROSECUTOR,
  institution: { type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE },
} as InstitutionUser

const defender = {
  role: UserRole.DEFENDER,
} as InstitutionUser

const draft = {}
const confirmed = { confirmedDate: '2026-06-05T09:15:00.000Z' }
const inService = {
  confirmedDate: '2026-06-05T09:15:00.000Z',
  services: [{ id: 'service' }],
}
const sent = {
  confirmedDate: '2026-06-05T09:15:00.000Z',
  sentToCourtOfAppealsDate: '2026-06-05T10:00:00.000Z',
}

describe('getAppealSummonsStatus', () => {
  it('is draft when nothing has happened', () => {
    expect(getAppealSummonsStatus(draft)).toBe('draft')
  })

  it('is confirmed once confirmed and not sent anywhere', () => {
    expect(getAppealSummonsStatus(confirmed)).toBe('confirmed')
  })

  it('is inService when a service row exists', () => {
    expect(getAppealSummonsStatus(inService)).toBe('inService')
  })

  it('is sent once sent to the court of appeals, even with service rows', () => {
    expect(
      getAppealSummonsStatus({
        ...sent,
        services: [{ id: 'service' }],
      }),
    ).toBe('sent')
  })
})

describe('canIssueAppealSummons', () => {
  it('lets office staff issue when the verdict has been appealed', () => {
    expect(canIssueAppealSummons(staff, true)).toBe(true)
  })

  it('does not let staff issue before a verdict appeal exists', () => {
    expect(canIssueAppealSummons(staff, false)).toBe(false)
  })

  it.each([publicProsecutor, defender, undefined])(
    'does not let other users issue',
    (user) => {
      expect(canIssueAppealSummons(user, true)).toBe(false)
    },
  )
})

describe('canPerformAppealSummonsAction', () => {
  it('lets staff edit a draft or a confirmed summons', () => {
    expect(
      canPerformAppealSummonsAction(AppealSummonsAction.EDIT, draft, staff),
    ).toBe(true)
    expect(
      canPerformAppealSummonsAction(AppealSummonsAction.EDIT, confirmed, staff),
    ).toBe(true)
  })

  it('does not let staff edit once the summons has been sent anywhere', () => {
    expect(
      canPerformAppealSummonsAction(AppealSummonsAction.EDIT, inService, staff),
    ).toBe(false)
    expect(
      canPerformAppealSummonsAction(AppealSummonsAction.EDIT, sent, staff),
    ).toBe(false)
  })

  it('lets staff open a summons in any status', () => {
    expect(
      canPerformAppealSummonsAction(AppealSummonsAction.OPEN, draft, staff),
    ).toBe(true)
    expect(
      canPerformAppealSummonsAction(AppealSummonsAction.OPEN, sent, staff),
    ).toBe(true)
  })

  it.each([publicProsecutor, defender, undefined])(
    'does not let other users edit or open in this PR',
    (user) => {
      expect(
        canPerformAppealSummonsAction(AppealSummonsAction.EDIT, draft, user),
      ).toBe(false)
      expect(
        canPerformAppealSummonsAction(AppealSummonsAction.OPEN, draft, user),
      ).toBe(false)
    },
  )
})
