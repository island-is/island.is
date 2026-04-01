import {
  DefendantEventType,
} from '@island.is/judicial-system/types'

import { Defendant, DefendantEventLog } from '../../../repository'
import { getDefenceUserCutoffDate } from '../caseFileCategory'

const nationalId = '0101010101'
const otherNationalId = '0202020202'

const dismissedAt = new Date('2024-01-10')
const cancelledAt = new Date('2024-01-20')
const laterDate = new Date('2024-02-01')

const makeEventLog = (
  eventType: DefendantEventType,
  created: Date,
): DefendantEventLog =>
  ({ eventType, created } as unknown as DefendantEventLog)

const makeDefendant = (
  defenderNationalId: string | undefined,
  eventLogs: DefendantEventLog[] = [],
): Defendant =>
  ({
    isDefenderChoiceConfirmed: true,
    defenderNationalId,
    eventLogs,
  } as unknown as Defendant)

describe('getDefenceUserCutoffDate', () => {
  describe('when defendants is undefined', () => {
    it('returns undefined', () => {
      expect(getDefenceUserCutoffDate(nationalId, undefined)).toBeUndefined()
    })
  })

  describe('when defendants is empty', () => {
    it('returns undefined', () => {
      expect(getDefenceUserCutoffDate(nationalId, [])).toBeUndefined()
    })
  })

  describe('when the defender has no confirmed defendants in the case', () => {
    it('returns undefined', () => {
      const defendants = [makeDefendant(otherNationalId)]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toBeUndefined()
    })
  })

  describe('when the defender has one active (not dismissed or cancelled) defendant', () => {
    it('returns undefined', () => {
      const defendants = [makeDefendant(nationalId, [])]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toBeUndefined()
    })
  })

  describe('when the defender has two defendants and only one is dismissed', () => {
    it('returns undefined', () => {
      const defendants = [
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
        ]),
        makeDefendant(nationalId, []),
      ]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toBeUndefined()
    })
  })

  describe('when the single defendant is dismissed', () => {
    it('returns the dismissal date', () => {
      const defendants = [
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
        ]),
      ]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toEqual(
        dismissedAt,
      )
    })
  })

  describe('when the single defendant is cancelled', () => {
    it('returns the cancellation date', () => {
      const defendants = [
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_CANCELLED, cancelledAt),
        ]),
      ]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toEqual(
        cancelledAt,
      )
    })
  })

  describe('when both defendants are dismissed/cancelled on different dates', () => {
    it('returns the latest date', () => {
      const defendants = [
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
        ]),
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_CANCELLED, cancelledAt),
        ]),
      ]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toEqual(
        cancelledAt,
      )
    })
  })

  describe('when a defendant has multiple event logs', () => {
    it('uses the most recent dismissal event', () => {
      const defendants = [
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, laterDate),
        ]),
      ]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toEqual(
        laterDate,
      )
    })
  })

  describe('when the case also has defendants assigned to a different defender', () => {
    it('only considers the defender\'s own defendants', () => {
      const defendants = [
        // The current defender's defendant — dismissed
        makeDefendant(nationalId, [
          makeEventLog(DefendantEventType.INDICTMENT_DISMISSED, dismissedAt),
        ]),
        // Another defender's active defendant — should not affect the result
        makeDefendant(otherNationalId, []),
      ]

      expect(getDefenceUserCutoffDate(nationalId, defendants)).toEqual(
        dismissedAt,
      )
    })
  })
})
