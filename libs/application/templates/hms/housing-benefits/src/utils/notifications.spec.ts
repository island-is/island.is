import { Application } from '@island.is/application/types'
import { getApplicantReminderScheduledNotifications } from './notifications'

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
    it('should remind 5 days after entering the state and 5 days before pruning', () => {
      const configs = getApplicantReminderScheduledNotifications(
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
      expect(getArg(configs[0], 'expiryDate')).toEqual({
        key: 'expiryDate',
        value: '2026-11-30T10:00:00.000Z',
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

    it('should anchor the pre-prune reminder to the original draft start when the state is entered later', () => {
      const configs = getApplicantReminderScheduledNotifications(
        createHousingBenefitsApplication({
          answers: { draftEnteredAt: '2026-10-01T10:00:00.000Z' },
        }),
      )

      expect(configs.map((config) => 'date' in config && config.date)).toEqual([
        FIVE_DAYS_LATER,
        new Date('2026-11-10T10:00:00.000Z'),
      ])
      expect(getArg(configs[0], 'daysRemaining')).toEqual({
        key: 'daysRemaining',
        value: '25',
      })
    })

    it('should only send the pre-prune reminder when the state entry reminder would not come before it', () => {
      const configs = getApplicantReminderScheduledNotifications(
        createHousingBenefitsApplication({
          answers: { draftEnteredAt: '2026-09-08T10:00:00.000Z' },
        }),
      )

      expect(configs).toHaveLength(1)
      expect(configs[0]).toMatchObject({
        date: new Date('2026-10-18T10:00:00.000Z'),
      })
      expect(getArg(configs[0], 'daysRemaining')).toEqual({
        key: 'daysRemaining',
        value: '5',
      })
    })

    it('should not schedule anything when both reminders would be in the past or after pruning', () => {
      const configs = getApplicantReminderScheduledNotifications(
        createHousingBenefitsApplication({
          answers: { draftEnteredAt: '2026-09-05T10:00:00.000Z' },
        }),
      )

      expect(configs).toEqual([])
    })

    it('should use the test delay override for the state entry reminder when set', () => {
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
})
