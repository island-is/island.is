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

  // Service does not retire the requirement the way it does on the cards the
  // parties read: the court is reconstructing what happened, and that the
  // verdict had to be served is a fact about the case whether or not it since
  // was. The manner matters because the appeal window is counted from it.
  it('adds the date and manner to it once served', () => {
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
    ).toEqual([
      'Birta skal dómfellda dóminn',
      'Dómur birtur 01.06.2026 – Birt rafrænt',
    ])
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
    ).toEqual(['Birta skal dómfellda dóminn', 'Dómur birtur 01.06.2026'])
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

  // Taking the appeal window and then using it are two steps, and the court
  // reads the sequence rather than only where it ended.
  it('keeps the stance beside the appeal that followed it', () => {
    expect(
      texts(
        defendantWith({
          verdict: {
            appealDecision: VerdictAppealDecision.POSTPONE,
            appealDate: '2026-06-04T00:00:00.000Z',
          },
        } as Partial<Defendant>),
      ),
    ).toEqual([
      'Afstaða dómfellda: Tekur áfrýjunarfrest',
      'Dómfelldi áfrýjaði 04.06.2026',
    ])
  })

  // The order the court reads them in: what was required, how it was served,
  // how long they had, where they stood, what they did. Nothing drops out.
  it('reads in that order when everything is known', () => {
    expect(
      texts(
        defendantWith({
          verdictAppealDeadline: '2026-06-29T00:00:00.000Z',
          verdict: {
            serviceRequirement: ServiceRequirement.REQUIRED,
            serviceDate: '2026-06-01T00:00:00.000Z',
            serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
            appealDecision: VerdictAppealDecision.POSTPONE,
            appealDate: '2026-06-04T00:00:00.000Z',
          },
        } as Partial<Defendant>),
      ),
    ).toEqual([
      'Birta skal dómfellda dóminn',
      'Dómur birtur 01.06.2026 – Birt rafrænt',
      'Áfrýjunarfrestur ákærða er til 29.06.2026',
      'Afstaða dómfellda: Tekur áfrýjunarfrest',
      'Dómfelldi áfrýjaði 04.06.2026',
    ])
  })
})
