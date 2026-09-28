import { createIntl } from 'react-intl'

import type {
  AppealCase,
  Verdict,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealEventType,
  ServiceRequirement,
  UserRole,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  getDefenderVerdictTimelineItems,
  hasVerdictServiceDecision,
} from './DefenderVerdictTimelineCard.logic'

describe('hasVerdictServiceDecision', () => {
  it('should be false until the service requirement has been decided', () => {
    expect(hasVerdictServiceDecision(undefined)).toBe(false)
    expect(hasVerdictServiceDecision(null)).toBe(false)
    expect(hasVerdictServiceDecision({})).toBe(false)
    expect(hasVerdictServiceDecision({ serviceRequirement: null })).toBe(false)
  })

  it('should be true for every decided requirement', () => {
    for (const serviceRequirement of Object.values(ServiceRequirement)) {
      expect(hasVerdictServiceDecision({ serviceRequirement })).toBe(true)
    }
  })
})

describe('getDefenderVerdictTimelineItems', () => {
  const { formatMessage } = createIntl({ locale: 'is', messages: {} })

  const items = (
    verdict: Partial<Verdict>,
    verdictAppealCase?: Pick<AppealCase, 'appealEventLogs'> | null,
  ) =>
    getDefenderVerdictTimelineItems({
      defendantId: 'defendant_id',
      verdict: verdict as Verdict,
      verdictAppealCase,
      formatMessage,
    })

  describe('service', () => {
    it('should report the service date of a verdict that has been served', () => {
      expect(
        items({
          serviceRequirement: ServiceRequirement.REQUIRED,
          serviceDate: '2026-06-01T13:31:00.000Z',
        }),
      ).toEqual([{ text: 'Dómur birtur 01.06.2026' }])
    })

    it('should report the requirement while service is pending', () => {
      expect(
        items({ serviceRequirement: ServiceRequirement.REQUIRED }),
      ).toEqual([{ text: 'Birta skal dómfellda dóminn' }])
    })

    it('should report that the defendant was present when no service applies', () => {
      expect(
        items({ serviceRequirement: ServiceRequirement.NOT_APPLICABLE }),
      ).toEqual([{ text: 'Dómfelldi var viðstaddur dómsuppkvaðningu' }])
    })

    it('should report that no service was needed', () => {
      expect(
        items({ serviceRequirement: ServiceRequirement.NOT_REQUIRED }),
      ).toEqual([{ text: 'Birting dóms ekki þörf' }])
    })

    // The public prosecution office's card always shows the requirement; the
    // mocks for the defence card show only the date once it has been served.
    it('should not report the requirement alongside the service date', () => {
      expect(
        items({
          serviceRequirement: ServiceRequirement.REQUIRED,
          serviceDate: '2026-06-01T13:31:00.000Z',
        }),
      ).toHaveLength(1)
    })

    it('should say nothing when the requirement is unknown', () => {
      expect(items({})).toEqual([])
    })
  })

  describe('appeal', () => {
    const served = {
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceDate: '2026-06-01T13:31:00.000Z',
    }

    it('should report the stance the defendant took', () => {
      expect(
        items({ ...served, appealDecision: VerdictAppealDecision.POSTPONE }),
      ).toEqual([
        { text: 'Dómur birtur 01.06.2026' },
        { text: 'Dómfelldi tekur áfrýjunarfrest' },
      ])
    })

    it('should report an accepted verdict', () => {
      expect(
        items({ ...served, appealDecision: VerdictAppealDecision.ACCEPT }),
      ).toEqual([
        { text: 'Dómur birtur 01.06.2026' },
        { text: 'Dómfelldi unir' },
      ])
    })

    // The stance only matters while it is still open which way they will go.
    it('should replace the stance with the appeal once appealed', () => {
      expect(
        items({
          ...served,
          appealDecision: VerdictAppealDecision.POSTPONE,
          appealDate: '2026-06-04T13:34:00.000Z',
        }),
      ).toEqual([
        { text: 'Dómur birtur 01.06.2026' },
        { text: 'Dómfelldi áfrýjaði 04.06.2026', tone: 'critical' },
      ])
    })

    it('should say nothing about an appeal when no stance was recorded', () => {
      expect(items(served)).toEqual([{ text: 'Dómur birtur 01.06.2026' }])
    })
  })

  // The defence is told about the prosecution's appeal too - it is the one
  // thing on the card the defendant has no part in.
  describe('the prosecution appeal', () => {
    const served: Partial<Verdict> = {
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceDate: '2026-06-01T13:31:00.000Z',
    }

    const prosecutionAppealed = {
      appealEventLogs: [
        {
          id: 'event_id',
          created: '2026-06-10T09:00:00.000Z',
          eventType: AppealEventType.APPEALED,
          defendantId: 'defendant_id',
          userRole: UserRole.PROSECUTOR,
        },
      ],
    }

    it('should add the appeal alongside the stance the defendant took', () => {
      expect(
        items(
          { ...served, appealDecision: VerdictAppealDecision.ACCEPT },
          prosecutionAppealed,
        ),
      ).toEqual([
        { text: 'Dómur birtur 01.06.2026' },
        { text: 'Dómfelldi unir' },
        { text: 'Ákæruvaldið áfrýjaði 10.06.2026' },
      ])
    })

    it('should say nothing when the prosecution has not appealed', () => {
      expect(items(served, { appealEventLogs: [] })).toEqual([
        { text: 'Dómur birtur 01.06.2026' },
      ])
    })
  })
})
