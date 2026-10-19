import { Application } from '@island.is/application/types'
import {
  getApplicantReminderScheduledNotifications,
  getDraftReminderScheduledNotifications,
} from './notifications'

jest.mock('@island.is/shared/utils', () => ({
  ...jest.requireActual('@island.is/shared/utils'),
  isRunningOnEnvironment: () => false,
}))

const NOW = new Date('2026-10-16T10:00:00.000Z')
const FIVE_DAYS_LATER = new Date('2026-10-21T10:00:00.000Z')

const createHousingBenefitsApplication = (
  overrides: Partial<Application> = {},
): Application =>
  ({
    id: 'app-id',
    applicant: '0101302989',
    assignees: [],
    answers: { draftEnteredAt: NOW.toISOString() },
    externalData: {},
    ...overrides,
  } as unknown as Application)

const getArg = (
  config: { args?: Array<{ key: string } & Record<string, unknown>> },
  key: string,
) => config.args?.find((arg) => arg.key === key)

describe('housing benefits scheduled notifications', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(NOW)
    delete process.env.HOUSING_BENEFITS_SCHEDULED_NOTIFICATION_TEST_DELAY_MS
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('getApplicantReminderScheduledNotifications', () => {
    it('should send a single reminder 5 days after starting the draft, 40 days before pruning', () => {
      const configs = getApplicantReminderScheduledNotifications(
        createHousingBenefitsApplication(),
      )

      expect(configs).toHaveLength(1)
      expect(configs[0]).toMatchObject({
        template: 'HNIPP.AS.HMS.HB.PRUNE.REMINDER',
        date: FIVE_DAYS_LATER,
        includeApplicationLink: true,
      })
      expect(getArg(configs[0], 'daysRemaining')).toEqual({
        key: 'daysRemaining',
        value: '40',
      })
      expect(getArg(configs[0], 'expiryDate')).toEqual({
        key: 'expiryDate',
        value: '2026-11-30T10:00:00.000Z',
      })
    })

    it('should count days remaining from the original draft start when entered later', () => {
      const configs = getApplicantReminderScheduledNotifications(
        createHousingBenefitsApplication({
          answers: { draftEnteredAt: '2026-10-01T10:00:00.000Z' },
        }),
      )

      expect(configs[0]).toMatchObject({ date: FIVE_DAYS_LATER })
      expect(getArg(configs[0], 'daysRemaining')).toEqual({
        key: 'daysRemaining',
        value: '25',
      })
    })

    it('should not schedule a reminder that would be sent after pruning', () => {
      const configs = getApplicantReminderScheduledNotifications(
        createHousingBenefitsApplication({
          answers: { draftEnteredAt: '2026-09-04T10:00:00.000Z' },
        }),
      )

      expect(configs).toEqual([])
    })

    it('should use the test delay override when set', () => {
      process.env.HOUSING_BENEFITS_SCHEDULED_NOTIFICATION_TEST_DELAY_MS =
        '60000'

      const configs = getApplicantReminderScheduledNotifications(
        createHousingBenefitsApplication(),
      )

      expect(configs[0]).toMatchObject({
        date: new Date('2026-10-16T10:01:00.000Z'),
      })
    })
  })

  describe('getDraftReminderScheduledNotifications', () => {
    it('should remind 5 days after starting the draft and 5 days before pruning', () => {
      const configs = getDraftReminderScheduledNotifications(
        createHousingBenefitsApplication(),
      )

      expect(configs).toHaveLength(2)
      expect(configs[0]).toMatchObject({
        template: 'HNIPP.AS.HMS.HB.PRUNE.REMINDER',
        date: FIVE_DAYS_LATER,
        includeApplicationLink: true,
      })
      expect(getArg(configs[0], 'daysRemaining')).toEqual({
        key: 'daysRemaining',
        value: '40',
      })
      expect(configs[1]).toMatchObject({
        template: 'HNIPP.AS.HMS.HB.PRUNE.REMINDER',
        date: new Date('2026-11-25T10:00:00.000Z'),
        includeApplicationLink: true,
      })
      expect(getArg(configs[1], 'daysRemaining')).toEqual({
        key: 'daysRemaining',
        value: '5',
      })
    })

    it('should not schedule the pre-prune reminder in the past', () => {
      const configs = getDraftReminderScheduledNotifications(
        createHousingBenefitsApplication({
          answers: { draftEnteredAt: '2026-09-05T10:00:00.000Z' },
        }),
      )

      expect(configs).toEqual([])
    })

    it('should only send one reminder when the pre-prune date is not after the state entry reminder', () => {
      const configs = getDraftReminderScheduledNotifications(
        createHousingBenefitsApplication({
          answers: { draftEnteredAt: '2026-09-08T10:00:00.000Z' },
        }),
      )

      expect(configs).toHaveLength(1)
      expect(configs[0]).toMatchObject({ date: FIVE_DAYS_LATER })
    })
  })
})
