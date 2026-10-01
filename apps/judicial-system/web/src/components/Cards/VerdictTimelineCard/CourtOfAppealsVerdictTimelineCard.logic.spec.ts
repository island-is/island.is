import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ServiceRequirement,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getCourtOfAppealsVerdictTimelineItems } from './CourtOfAppealsVerdictTimelineCard.logic'

describe('getCourtOfAppealsVerdictTimelineItems', () => {
  const defendantWith = (overrides: Partial<Defendant>): Defendant =>
    ({ id: 'defendant-id', name: 'Dómfelldi', ...overrides } as Defendant)

  const texts = (defendant: Defendant) =>
    getCourtOfAppealsVerdictTimelineItems(defendant).map((i) => i.text)

  it('says nothing at all before there is anything to say', () => {
    expect(texts(defendantWith({}))).toEqual([])
  })

  // Until the verdict is served, what the court needs is the requirement.
  it('names the service requirement while the verdict is unserved', () => {
    expect(
      texts(
        defendantWith({
          verdict: { serviceRequirement: ServiceRequirement.REQUIRED },
        } as Partial<Defendant>),
      ),
    ).toEqual(['Birta skal dómfellda dóminn'])
  })

  // Once served, the date and the manner replace it - the manner matters
  // because it is what the appeal window is counted from.
  it('replaces it with the date and manner once served', () => {
    expect(
      texts(
        defendantWith({
          verdict: {
            serviceRequirement: ServiceRequirement.REQUIRED,
            serviceDate: '2026-06-01T00:00:00.000Z',
            serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
          },
        } as Partial<Defendant>),
      ),
    ).toEqual(['Dómur birtur 01.06.2026 – Birt rafrænt'])
  })

  it('leaves the manner out when none was recorded', () => {
    expect(
      texts(
        defendantWith({
          verdict: {
            serviceRequirement: ServiceRequirement.REQUIRED,
            serviceDate: '2026-06-01T00:00:00.000Z',
          },
        } as Partial<Defendant>),
      ),
    ).toEqual(['Dómur birtur 01.06.2026'])
  })

  // The defendant's own deadline, which runs from service. The reviewer card
  // shows the prosecution's instead, and neither court nor defence card
  // showed this one before.
  it('shows the defendant deadline', () => {
    expect(
      texts(
        defendantWith({
          verdictAppealDeadline: '2026-06-29T00:00:00.000Z',
        } as Partial<Defendant>),
      ),
    ).toEqual(['Áfrýjunarfrestur ákærða er til 29.06.2026'])
  })

  it('shows where the defendant stands while it is still open', () => {
    expect(
      texts(
        defendantWith({
          verdict: {
            appealDecision: VerdictAppealDecision.POSTPONE,
          },
        } as Partial<Defendant>),
      ),
    ).toEqual(['Afstaða dómfellda: Tekur áfrýjunarfrest'])
  })

  // An appeal is the stance, so it takes the place of one rather than being
  // listed beside it.
  it('replaces the stance once the defendant has appealed', () => {
    expect(
      texts(
        defendantWith({
          verdict: {
            appealDecision: VerdictAppealDecision.POSTPONE,
            appealDate: '2026-06-04T00:00:00.000Z',
          },
        } as Partial<Defendant>),
      ),
    ).toEqual(['Dómfelldi áfrýjaði 04.06.2026'])
  })

  // The order the court reads them in: how it was served, how long they had,
  // what they did.
  it('reads in that order when everything is known', () => {
    expect(
      texts(
        defendantWith({
          verdictAppealDeadline: '2026-06-29T00:00:00.000Z',
          verdict: {
            serviceRequirement: ServiceRequirement.REQUIRED,
            serviceDate: '2026-06-01T00:00:00.000Z',
            serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
            appealDate: '2026-06-04T00:00:00.000Z',
          },
        } as Partial<Defendant>),
      ),
    ).toEqual([
      'Dómur birtur 01.06.2026 – Birt rafrænt',
      'Áfrýjunarfrestur ákærða er til 29.06.2026',
      'Dómfelldi áfrýjaði 04.06.2026',
    ])
  })
})
