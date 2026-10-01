import type { AppealEventLog } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealEventType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getProsecutionVerdictAppealDate,
  getProsecutionVerdictAppealItem,
} from './prosecutionVerdictAppeal.logic'

describe('getProsecutionVerdictAppealDate', () => {
  const event = (
    eventLog: Partial<AppealEventLog> & { created: string },
  ): AppealEventLog => ({
    id: `event_${eventLog.created}`,
    eventType: AppealEventType.APPEALED,
    defendantId: 'defendant_id',
    userRole: UserRole.PROSECUTOR,
    ...eventLog,
  })

  const appealDate = (
    appealEventLogs: AppealEventLog[],
    defendantId = 'defendant_id',
  ) => getProsecutionVerdictAppealDate({ appealEventLogs }, defendantId)

  it('should have no date without an appeal case', () => {
    expect(getProsecutionVerdictAppealDate(undefined, 'defendant_id')).toBe(
      undefined,
    )
    expect(getProsecutionVerdictAppealDate(null, 'defendant_id')).toBe(
      undefined,
    )
    expect(appealDate([])).toBe(undefined)
  })

  it('should report when the prosecution appealed', () => {
    expect(appealDate([event({ created: '2026-06-10T09:00:00.000Z' })])).toBe(
      '2026-06-10T09:00:00.000Z',
    )
  })

  // A verdict appeal is per defendant on both sides, so one defendant's appeal
  // says nothing about another's.
  it('should not read another defendant as appealed', () => {
    expect(
      appealDate(
        [event({ created: '2026-06-10T09:00:00.000Z' })],
        'other_defendant_id',
      ),
    ).toBe(undefined)
  })

  // The defence side of the same appeal case - a defender's own appeal, or one
  // the public prosecution office registered on their letter - is not the
  // prosecution's.
  it.each([UserRole.DEFENDER, UserRole.PUBLIC_PROSECUTOR_STAFF])(
    'should not read a %s appeal as the prosecution appealing',
    (userRole) => {
      expect(
        appealDate([event({ created: '2026-06-10T09:00:00.000Z', userRole })]),
      ).toBe(undefined)
    },
  )

  it('should read a prosecutor representative as the prosecution', () => {
    expect(
      appealDate([
        event({
          created: '2026-06-10T09:00:00.000Z',
          userRole: UserRole.PROSECUTOR_REPRESENTATIVE,
        }),
      ]),
    ).toBe('2026-06-10T09:00:00.000Z')
  })

  it('should have no date once the appeal is withdrawn', () => {
    expect(
      appealDate([
        event({ created: '2026-06-10T09:00:00.000Z' }),
        event({
          created: '2026-06-11T09:00:00.000Z',
          eventType: AppealEventType.APPEAL_WITHDRAWN,
        }),
      ]),
    ).toBe(undefined)
  })

  // The latest event decides, so a reviewer who changes their mind back while
  // the deadline still runs is an appellant again.
  it('should report a fresh appeal made after a withdrawal', () => {
    expect(
      appealDate([
        event({ created: '2026-06-10T09:00:00.000Z' }),
        event({
          created: '2026-06-11T09:00:00.000Z',
          eventType: AppealEventType.APPEAL_WITHDRAWN,
        }),
        event({ created: '2026-06-12T09:00:00.000Z' }),
      ]),
    ).toBe('2026-06-12T09:00:00.000Z')
  })

  // The defence side withdrawing says nothing about the prosecution's appeal,
  // even though both are events of the same appeal case.
  it('should ignore a withdrawal by the other side', () => {
    expect(
      appealDate([
        event({ created: '2026-06-10T09:00:00.000Z' }),
        event({
          created: '2026-06-11T09:00:00.000Z',
          eventType: AppealEventType.APPEAL_WITHDRAWN,
          userRole: UserRole.DEFENDER,
        }),
      ]),
    ).toBe('2026-06-10T09:00:00.000Z')
  })
})

describe('getProsecutionVerdictAppealItem', () => {
  it('should have no bullet until the prosecution appeals', () => {
    expect(
      getProsecutionVerdictAppealItem({ appealEventLogs: [] }, 'defendant_id'),
    ).toBe(undefined)
  })

  it('should word the bullet the same way on every card', () => {
    expect(
      getProsecutionVerdictAppealItem(
        {
          appealEventLogs: [
            {
              id: 'event_id',
              created: '2026-06-10T09:00:00.000Z',
              eventType: AppealEventType.APPEALED,
              defendantId: 'defendant_id',
              userRole: UserRole.PROSECUTOR,
            },
          ],
        },
        'defendant_id',
      ),
    ).toEqual({ text: 'Ákæruvaldið áfrýjaði 10.06.2026' })
  })
})
