import {
  AppealCaseState,
  AppealEventType,
} from '@island.is/judicial-system/types'

import { AppealAppointmentKind } from '../../../formatters/generatedPdfs/appealAppointmentLetterPdf'
import {
  AppealCase,
  AppealEventLog,
  Case,
  CivilClaimant,
  Defendant,
} from '../../repository'
import { buildAppealAppointmentLetter } from '../appealAppointmentLetter'

const confirmation = (fields: Partial<AppealEventLog> = {}): AppealEventLog =>
  ({
    eventType: AppealEventType.ADVOCATE_CONFIRMED,
    userName: 'Áslaug Björk Ingólfsdóttir',
    userTitle: 'aðstoðarmaður dómara',
    created: new Date('2026-08-13'),
    ...fields,
  } as AppealEventLog)

const defendant = (fields: Partial<Defendant> = {}): Defendant =>
  ({
    id: 'defendant-id',
    name: 'Gervimaður Jónsson',
    isAppealDefenderConfirmed: true,
    appealDefenderName: 'Þórður Már Jónsson',
    ...fields,
  } as Defendant)

const civilClaimant = (fields: Partial<CivilClaimant> = {}): CivilClaimant =>
  ({
    id: 'civil-claimant-id',
    name: 'Jónína Jónsdóttir',
    isAppealSpokespersonConfirmed: true,
    appealSpokespersonName: 'Brynjar Sveinsson',
    ...fields,
  } as CivilClaimant)

const appealCase = (fields: Partial<AppealCase> = {}): AppealCase =>
  ({
    id: 'appeal-case-id',
    appealCaseNumber: '593/2026',
    appealEventLogs: [confirmation({ defendantId: 'defendant-id' })],
    ...fields,
  } as AppealCase)

const theCase = (fields: Partial<Case> = {}): Case =>
  ({
    id: 'case-id',
    courtCaseNumber: 'S-4275/2025',
    court: { name: 'Héraðsdómur Reykjavíkur' },
    indictmentReviewer: {
      name: 'Hrafnhildur M. Gunnarsdóttir',
      title: 'saksóknari',
    },
    defendants: [defendant()],
    civilClaimants: [],
    verdictAppealCase: appealCase(),
    ...fields,
  } as Case)

describe('buildAppealAppointmentLetter', () => {
  it('writes a defender letter from the case and the confirmation', () => {
    const letter = buildAppealAppointmentLetter({
      theCase: theCase(),
      defendant: defendant(),
    })

    expect(letter).toEqual({
      kind: AppealAppointmentKind.DEFENDER,
      advocateName: 'Þórður Már Jónsson',
      defendantName: 'Gervimaður Jónsson',
      courtName: 'Héraðsdóms Reykjavíkur',
      courtCaseNumber: 'S-4275/2025',
      appealCaseNumber: '593/2026',
      appealSummonsDate: undefined,
      appointedBy: {
        name: 'Áslaug Björk Ingólfsdóttir',
        title: 'aðstoðarmaður dómara',
      },
      appointedDate: new Date('2026-08-13'),
      copyTo: ['Hrafnhildur M. Gunnarsdóttir saksóknari'],
    })
  })

  it('signs the letter with the confirmation in force', () => {
    const letter = buildAppealAppointmentLetter({
      theCase: theCase({
        verdictAppealCase: appealCase({
          appealEventLogs: [
            confirmation({
              defendantId: 'defendant-id',
              userName: 'Fyrsti Staðfestandi',
              created: new Date('2026-08-13'),
            }),
            confirmation({
              defendantId: 'defendant-id',
              userName: 'Annar Staðfestandi',
              created: new Date('2026-09-01'),
            }),
          ],
        }),
      }),
      defendant: defendant(),
    })

    expect(letter?.appointedBy.name).toBe('Annar Staðfestandi')
    expect(letter?.appointedDate).toEqual(new Date('2026-09-01'))
  })

  it('reads the confirmation of this party and no other', () => {
    const letter = buildAppealAppointmentLetter({
      theCase: theCase({
        verdictAppealCase: appealCase({
          appealEventLogs: [
            confirmation({
              civilClaimantId: 'civil-claimant-id',
              userName: 'Staðfesti réttargæslumann',
            }),
            confirmation({
              defendantId: 'defendant-id',
              userName: 'Staðfesti verjanda',
            }),
          ],
        }),
      }),
      defendant: defendant(),
    })

    expect(letter?.appointedBy.name).toBe('Staðfesti verjanda')
  })

  it('writes no letter for an advocate the court has not confirmed', () => {
    expect(
      buildAppealAppointmentLetter({
        theCase: theCase(),
        defendant: defendant({ isAppealDefenderConfirmed: false }),
      }),
    ).toBeUndefined()
  })

  // "Ákærði óskar ekki eftir verjanda": the screen confirms the answer while
  // clearing the name, so confirmed alone does not mean somebody was appointed.
  it('writes no letter for a defendant who waived a defender', () => {
    expect(
      buildAppealAppointmentLetter({
        theCase: theCase(),
        defendant: defendant({
          isAppealDefenderWaived: true,
          appealDefenderName: undefined,
        }),
      }),
    ).toBeUndefined()
  })

  // The letter is signed and dated by whoever confirmed the advocate, and the
  // party row keeps neither.
  it('writes no letter when nothing records the confirmation', () => {
    expect(
      buildAppealAppointmentLetter({
        theCase: theCase({
          verdictAppealCase: appealCase({ appealEventLogs: [] }),
        }),
        defendant: defendant(),
      }),
    ).toBeUndefined()
  })

  it('writes no letter once the appeal is withdrawn', () => {
    expect(
      buildAppealAppointmentLetter({
        theCase: theCase({
          verdictAppealCase: appealCase({
            appealState: AppealCaseState.WITHDRAWN,
          }),
        }),
        defendant: defendant(),
      }),
    ).toBeUndefined()
  })

  it('writes no letter when the verdict was not appealed', () => {
    expect(
      buildAppealAppointmentLetter({
        theCase: theCase({ verdictAppealCase: undefined }),
        defendant: defendant(),
      }),
    ).toBeUndefined()
  })

  describe('civil claimants', () => {
    const caseWithClaimant = theCase({
      civilClaimants: [civilClaimant()],
      verdictAppealCase: appealCase({
        appealEventLogs: [
          confirmation({ civilClaimantId: 'civil-claimant-id' }),
        ],
      }),
    })

    it('appoints a spokesperson and copies the appointed defenders', () => {
      const letter = buildAppealAppointmentLetter({
        theCase: caseWithClaimant,
        civilClaimant: civilClaimant(),
      })

      expect(letter?.kind).toBe(AppealAppointmentKind.SPOKESPERSON)
      expect(letter?.advocateName).toBe('Brynjar Sveinsson')
      expect(letter?.copyTo).toEqual([
        'Hrafnhildur M. Gunnarsdóttir saksóknari',
        'Þórður Már Jónsson lögmaður',
      ])
    })

    // The mirror of the defender case above: a confirmation of some other
    // party must not sign this party's letter.
    it('reads the confirmation of this claimant and no other', () => {
      const letter = buildAppealAppointmentLetter({
        theCase: theCase({
          civilClaimants: [civilClaimant()],
          verdictAppealCase: appealCase({
            appealEventLogs: [
              confirmation({
                civilClaimantId: 'civil-claimant-id',
                userName: 'Staðfesti réttargæslumann',
                created: new Date('2026-08-13'),
              }),
              confirmation({
                defendantId: 'defendant-id',
                userName: 'Staðfesti verjanda',
                created: new Date('2026-09-01'),
              }),
            ],
          }),
        }),
        civilClaimant: civilClaimant(),
      })

      expect(letter?.appointedBy.name).toBe('Staðfesti réttargæslumann')
      expect(letter?.appointedDate).toEqual(new Date('2026-08-13'))
    })

    // Un-confirming does not delete the confirmation event, so the event alone
    // cannot stand in for the party row's answer.
    it('writes no letter for a spokesperson the court has not confirmed', () => {
      expect(
        buildAppealAppointmentLetter({
          theCase: caseWithClaimant,
          civilClaimant: civilClaimant({
            isAppealSpokespersonConfirmed: false,
          }),
        }),
      ).toBeUndefined()
    })

    // A réttargæslumaður is appointed by the court; a lögmaður is hired by the
    // claimant, so there is nothing for the court to appoint.
    it('writes no letter for a lawyer the claimant engaged', () => {
      expect(
        buildAppealAppointmentLetter({
          theCase: caseWithClaimant,
          civilClaimant: civilClaimant({ appealSpokespersonIsLawyer: true }),
        }),
      ).toBeUndefined()
    })
  })

  describe('the case title', () => {
    it.each([
      [['Gervimaður Jónsson'], 'Gervimaður Jónsson'],
      [['Jón Jónsson', 'Anna Önnudóttir'], 'Jón Jónsson og Anna Önnudóttir'],
      [['Jón Jónsson', 'Anna Önnudóttir', 'Páll Pálsson'], 'Jón Jónsson o.fl.'],
    ])('names every accused in the case: %s', (names, expected) => {
      const letter = buildAppealAppointmentLetter({
        theCase: theCase({
          defendants: names.map((name, index) =>
            defendant({ id: `defendant-${index}`, name }),
          ),
        }),
        defendant: defendant(),
      })

      expect(letter?.defendantName).toBe(expected)
    })
  })

  describe('the prosecution copy', () => {
    it('writes to the appeal prosecutor once one is assigned', () => {
      const letter = buildAppealAppointmentLetter({
        theCase: theCase({
          appealProsecutor: {
            name: 'Áfrýjunar Saksóknari',
            title: 'saksóknari',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }),
        defendant: defendant(),
      })

      expect(letter?.copyTo).toEqual(['Áfrýjunar Saksóknari saksóknari'])
    })

    it('copies only the defenders the court has appointed', () => {
      const letter = buildAppealAppointmentLetter({
        theCase: theCase({
          civilClaimants: [civilClaimant()],
          defendants: [
            defendant({ id: 'confirmed-id' }),
            defendant({
              id: 'unconfirmed-id',
              isAppealDefenderConfirmed: false,
              appealDefenderName: 'Óstaðfestur Verjandi',
            }),
          ],
          verdictAppealCase: appealCase({
            appealEventLogs: [
              confirmation({ civilClaimantId: 'civil-claimant-id' }),
            ],
          }),
        }),
        civilClaimant: civilClaimant(),
      })

      expect(letter?.copyTo).toEqual([
        'Hrafnhildur M. Gunnarsdóttir saksóknari',
        'Þórður Már Jónsson lögmaður',
      ])
    })

    // One lawyer for several co-accused is routine, and each defendant row
    // carries its own copy of the name. The second case is the one the
    // national id would get wrong: the court picked the lawyer out of the
    // register for one of the accused and typed the same lawyer in for the
    // other, so only one of the two rows has an id to be the same person by.
    it.each([
      ['both picked from the lawyer register', '0101302989', '0101302989'],
      ['one picked from the register, one typed in', '0101302989', undefined],
      ['neither in the register', undefined, undefined],
    ])(
      'names a defender acting for two of the accused once: %s',
      (_name, firstNationalId, secondNationalId) => {
        const letter = buildAppealAppointmentLetter({
          theCase: theCase({
            civilClaimants: [civilClaimant()],
            defendants: [
              defendant({
                id: 'first-id',
                appealDefenderNationalId: firstNationalId,
              }),
              defendant({
                id: 'second-id',
                appealDefenderNationalId: secondNationalId,
              }),
            ],
            verdictAppealCase: appealCase({
              appealEventLogs: [
                confirmation({ civilClaimantId: 'civil-claimant-id' }),
              ],
            }),
          }),
          civilClaimant: civilClaimant(),
        })

        expect(letter?.copyTo).toEqual([
          'Hrafnhildur M. Gunnarsdóttir saksóknari',
          'Þórður Már Jónsson lögmaður',
        ])
      },
    )

    it('omits the copy line when no prosecutor is recorded', () => {
      const letter = buildAppealAppointmentLetter({
        theCase: theCase({ indictmentReviewer: undefined }),
        defendant: defendant(),
      })

      expect(letter?.copyTo).toEqual([])
    })
  })
})
