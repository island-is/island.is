import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealEventType,
  UserRole,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getReviewerVerdictTimelineItems } from './ReviewerVerdictTimelineCard.logic'

describe('getReviewerVerdictTimelineItems', () => {
  const indictmentAppealDeadline = '2026-06-14T23:59:59.999Z'

  const defendant = (verdict?: Partial<Defendant['verdict']>): Defendant =>
    ({
      id: 'defendant_id',
      name: 'Jón Sigurður Jónsson',
      verdict,
    } as Defendant)

  const prosecutionAppealed = {
    appealEventLogs: [
      {
        id: 'event_id',
        created: '2026-05-25T10:00:00.000Z',
        eventType: AppealEventType.APPEALED,
        defendantId: 'defendant_id',
        userRole: UserRole.PROSECUTOR,
      },
    ],
  }

  it('should show the prosecution deadline before anything has happened', () => {
    expect(
      getReviewerVerdictTimelineItems({
        defendant: defendant(),
        indictmentAppealDeadline,
      }),
    ).toEqual([{ text: 'Áfrýjunarfrestur ákæruvalds: 14.06.2026' }])
  })

  // The reviewer needs to know where the defendant stands before deciding.
  it('should show the stance the defendant took above the deadline', () => {
    expect(
      getReviewerVerdictTimelineItems({
        defendant: defendant({
          appealDecision: VerdictAppealDecision.ACCEPT,
        }),
        indictmentAppealDeadline,
      }),
    ).toEqual([
      { text: 'Afstaða dómfellda: Unir dómi' },
      { text: 'Áfrýjunarfrestur ákæruvalds: 14.06.2026' },
    ])
  })

  it('should report a postponing defendant', () => {
    expect(
      getReviewerVerdictTimelineItems({
        defendant: defendant({
          appealDecision: VerdictAppealDecision.POSTPONE,
        }),
        indictmentAppealDeadline,
      })[0],
    ).toEqual({ text: 'Afstaða dómfellda: Tekur áfrýjunarfrest' })
  })

  // No stance is not a stance of "not recorded"; the bullet is simply absent.
  it('should say nothing about a stance that was not recorded', () => {
    expect(
      getReviewerVerdictTimelineItems({
        defendant: defendant({ serviceDate: '2026-05-20T10:00:00.000Z' }),
        indictmentAppealDeadline,
      }),
    ).toEqual([{ text: 'Áfrýjunarfrestur ákæruvalds: 14.06.2026' }])
  })

  // The deadline has done its job once the appeal is made.
  it('should replace the deadline with the prosecution appeal', () => {
    expect(
      getReviewerVerdictTimelineItems({
        defendant: defendant({
          appealDecision: VerdictAppealDecision.ACCEPT,
        }),
        verdictAppealCase: prosecutionAppealed,
        indictmentAppealDeadline,
      }),
    ).toEqual([
      { text: 'Afstaða dómfellda: Unir dómi' },
      { text: 'Ákæruvaldið áfrýjaði 25.05.2026' },
    ])
  })

  // The defendant's own appeal is their stance, so it takes the stance's place
  // - the same substitution the other two cards make.
  it('should replace the stance with the defendant appeal', () => {
    expect(
      getReviewerVerdictTimelineItems({
        defendant: {
          ...defendant({
            appealDecision: VerdictAppealDecision.POSTPONE,
            appealDate: '2026-05-22T10:00:00.000Z',
          }),
          appealDefenderName: 'Gunnar Gunnarsson',
        },
        indictmentAppealDeadline,
      }),
    ).toEqual([
      { text: 'Dómfelldi áfrýjaði 22.05.2026 (Gunnar Gunnarsson verjandi)' },
      { text: 'Áfrýjunarfrestur ákæruvalds: 14.06.2026' },
    ])
  })

  // Both sides may appeal, and both are shown.
  it('should show both appeals when both sides appealed', () => {
    expect(
      getReviewerVerdictTimelineItems({
        defendant: defendant({ appealDate: '2026-05-22T10:00:00.000Z' }),
        verdictAppealCase: prosecutionAppealed,
        indictmentAppealDeadline,
      }),
    ).toEqual([
      { text: 'Dómfelldi áfrýjaði 22.05.2026' },
      { text: 'Ákæruvaldið áfrýjaði 25.05.2026' },
    ])
  })

  // Without a ruling date there is no deadline, and an empty card is not shown.
  it('should have no items at all before a deadline is known', () => {
    expect(getReviewerVerdictTimelineItems({ defendant: defendant() })).toEqual(
      [],
    )
  })
})
