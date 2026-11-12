import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCourtSessionType,
  AppealEventType,
  CaseIndictmentRulingDecision,
  CaseState,
  DefendantEventType,
  IndictmentCaseReviewDecision,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../repository'
import { caseTableCellGenerators } from './caseTable.cellGenerators'
import type { CaseTableRowCase } from './caseTable.types'

describe('indictment ruling decision cell generators', () => {
  const user = { role: UserRole.PROSECUTOR } as User

  const dismissedAppealedCase = {
    state: CaseState.COMPLETED,
    indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
    appeal: { appealState: AppealCaseState.APPEALED },
  } as CaseTableRowCase

  it('appends the appeal state tag to dismissals', () => {
    const cell = caseTableCellGenerators.indictmentRulingDecision.generate(
      dismissedAppealedCase,
      user,
    )

    expect(cell.value).toEqual({
      firstTag: { color: 'blue', text: 'Frávísun' },
      secondTag: { color: 'red', text: 'Kært' },
    })
  })

  it('omits the appeal state tag from dismissals when the table has a separate appeal state column', () => {
    const cell =
      caseTableCellGenerators.indictmentRulingDecisionWithoutAppealState.generate(
        dismissedAppealedCase,
        user,
      )

    expect(cell.value).toEqual({ color: 'blue', text: 'Frávísun' })
  })

  it('leaves the cell empty for cases that are not completed', () => {
    const cell =
      caseTableCellGenerators.indictmentRulingDecisionWithoutAppealState.generate(
        { state: CaseState.RECEIVED } as CaseTableRowCase,
        user,
      )

    expect(cell.value).toBeUndefined()
  })
})

describe('verdict appeal cell generators', () => {
  const user = { role: UserRole.COURT_OF_APPEALS_JUDGE } as User

  const appealEvent = (
    eventType: AppealEventType,
    userRole: UserRole,
    created = new Date('2026-06-10T09:00:00.000Z'),
  ) => ({ eventType, userRole, defendantId: 'defendant_id', created })

  // As the row reaches a cell generator: presentVerdictAppealAsCaseAppeal has
  // already put the verdict appeal where every column looks for the appeal a
  // row is about.
  const caseWithVerdictAppeal = (verdictAppealCase: unknown): Case =>
    ({ appeal: verdictAppealCase } as CaseTableRowCase)

  describe('who appealed', () => {
    it('names the prosecution when it appealed', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.PROSECUTOR),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: 'Ákæruvald' })
    })

    it('names the defendant when the defence appealed', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.DEFENDER),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: 'Dómfelldi' })
    })

    // One row per case, so when both sides appealed the prosecution is the one
    // named (owner, 2026-09-17).
    it('gives the prosecution priority when both appealed', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.DEFENDER),
            appealEvent(AppealEventType.APPEALED, UserRole.PROSECUTOR),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: 'Ákæruvald' })
    })

    it('names nobody once the only appeal has been withdrawn', () => {
      const cell = caseTableCellGenerators.verdictAppealAppellant.generate(
        caseWithVerdictAppeal({
          appealEventLogs: [
            appealEvent(AppealEventType.APPEALED, UserRole.PROSECUTOR),
            appealEvent(
              AppealEventType.APPEAL_WITHDRAWN,
              UserRole.PROSECUTOR,
              new Date('2026-06-11T09:00:00.000Z'),
            ),
          ],
        }),
        user,
      )

      expect(cell.value).toBeUndefined()
    })
  })

  describe('state', () => {
    // A verdict appeal reaches the court of appeals before the court has
    // received it, which a ruling appeal never does.
    it('shows a filed appeal as new', () => {
      const cell = caseTableCellGenerators.verdictAppealState.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.APPEALED }),
        user,
      )

      expect(cell.value).toEqual({ color: 'purple', text: 'Nýtt' })
    })

    it('shows a received appeal as received', () => {
      const cell = caseTableCellGenerators.verdictAppealState.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.RECEIVED }),
        user,
      )

      expect(cell.value).toEqual({ color: 'darkerBlue', text: 'Móttekið' })
    })
  })

  describe('result', () => {
    it('shows the ruling of a completed appeal', () => {
      const cell = caseTableCellGenerators.verdictAppealResult.generate(
        caseWithVerdictAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
        }),
        user,
      )

      expect(cell.value).toEqual({ color: 'mint', text: 'Staðfest' })
    })

    // A withdrawal ends the appeal without a ruling, and the design puts it in
    // the completed list under the result column.
    it('shows a withdrawal as the result', () => {
      const cell = caseTableCellGenerators.verdictAppealResult.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.WITHDRAWN }),
        user,
      )

      expect(cell.value).toEqual({ color: 'red', text: 'Afturkallað' })
    })

    it('leaves the result empty while the appeal is still open', () => {
      const cell = caseTableCellGenerators.verdictAppealResult.generate(
        caseWithVerdictAppeal({ appealState: AppealCaseState.APPEALED }),
        user,
      )

      expect(cell.value).toBeUndefined()
    })
  })

  describe('when the case ended', () => {
    it('uses the ruling date of a completed appeal', () => {
      const cell = caseTableCellGenerators.verdictAppealCompletedDate.generate(
        caseWithVerdictAppeal({
          appealState: AppealCaseState.COMPLETED,
          appealRulingDate: new Date('2026-11-10T10:00:00.000Z'),
        }),
        user,
      )

      expect(cell.value).toEqual({ str: '10.11.2026' })
    })

    // A withdrawn appeal has no ruling, so the withdrawal is when it ended.
    it('uses the withdrawal for a withdrawn appeal', () => {
      const cell = caseTableCellGenerators.verdictAppealCompletedDate.generate(
        caseWithVerdictAppeal({
          appealState: AppealCaseState.WITHDRAWN,
          appealEventLogs: [
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.PROSECUTOR,
              new Date('2026-10-01T09:00:00.000Z'),
            ),
            appealEvent(
              AppealEventType.APPEAL_WITHDRAWN,
              UserRole.PROSECUTOR,
              new Date('2026-10-14T09:00:00.000Z'),
            ),
          ],
        }),
        user,
      )

      expect(cell.value).toEqual({ str: '14.10.2026' })
    })
  })
})

describe('the case number on a verdict appeal list', () => {
  const user = { role: UserRole.COURT_OF_APPEALS_JUDGE } as User

  const rulingAppealRow = {
    policeCaseNumbers: ['007-2022-45678'],
    courtCaseNumber: 'S-301/2022',
    appeal: { appealCaseNumber: '1111/2022' },
  } as CaseTableRowCase

  // Which appeal a row is about is settled before a column sees it - see
  // caseTable.verdictAppealRows.spec.ts. What is left to check here is that
  // the column reads the appeal it is handed.
  const verdictAppealRow = {
    policeCaseNumbers: ['007-2022-45678'],
    courtCaseNumber: 'S-301/2022',
    appeal: { appealCaseNumber: '2041/2022' },
  } as CaseTableRowCase

  it('labels the row with the appeal it is about', () => {
    const cell = caseTableCellGenerators.verdictAppealCaseNumber.generate(
      verdictAppealRow,
      user,
    )

    expect((cell.value as { strList: string[] }).strList[0]).toBe('2041/2022')
  })

  it('still labels a ruling appeal row with the ruling appeal', () => {
    const cell = caseTableCellGenerators.caseNumber.generate(
      rulingAppealRow,
      user,
    )

    expect((cell.value as { strList: string[] }).strList[0]).toBe('1111/2022')
  })

  // Landsréttur has not numbered the appeal yet - that is what "Nýtt" is.
  it('leaves the appeal number out until one is given', () => {
    const cell = caseTableCellGenerators.verdictAppealCaseNumber.generate(
      { ...verdictAppealRow, appeal: {} } as CaseTableRowCase,
      user,
    )

    expect((cell.value as { strList: string[] }).strList).toEqual([
      '',
      'S-301/2022',
      '007-2022-45678',
    ])
  })
})

describe('public prosecution appealed verdict cell generators', () => {
  const user = { role: UserRole.PROSECUTOR } as User

  const appealEvent = (
    eventType: AppealEventType,
    userRole: UserRole,
    created: string,
    defendantId = 'defendant_id',
  ) => ({ eventType, userRole, defendantId, created: new Date(created) })

  const row = (fields: Record<string, unknown>): CaseTableRowCase =>
    ({ appealSource: 'verdictAppealCase', ...fields } as CaseTableRowCase)

  describe('who appealed and when', () => {
    it('names the prosecution and dates the appeal by its event', () => {
      const c = row({
        defendants: [{ id: 'defendant_id' }],
        appeal: {
          appealEventLogs: [
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.PROSECUTOR,
              '2026-11-18T10:00:00.000Z',
            ),
          ],
        },
      })

      expect(
        caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
          .value,
      ).toEqual({ color: 'blue', text: 'Ákæruvald' })
      expect(
        caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
      ).toEqual({ str: '18.11.2026' })
    })

    // The defendant's appeal may be registered long after the declaration
    // arrived, so the date typed in on the verdict is the filing date - not
    // the day somebody got round to recording it.
    it('names the defendant and dates the appeal by the verdict', () => {
      const c = row({
        defendants: [
          {
            id: 'defendant_id',
            verdicts: [{ appealDate: new Date('2026-08-11T00:00:00.000Z') }],
          },
        ],
        appeal: {
          appealEventLogs: [
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.DEFENDER,
              '2026-08-20T10:00:00.000Z',
            ),
          ],
        },
      })

      expect(
        caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
          .value,
      ).toEqual({ color: 'rose', text: 'Ákærði' })
      expect(
        caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
      ).toEqual({ str: '11.8.2026' })
    })

    // One row per case: the prosecution is named when both appealed, and the
    // verdict was appealed when the first of them did.
    it('names the prosecution and the earliest date when both appealed', () => {
      const c = row({
        defendants: [
          {
            id: 'defendant_id',
            verdicts: [{ appealDate: new Date('2026-07-05T00:00:00.000Z') }],
          },
        ],
        appeal: {
          appealEventLogs: [
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.PROSECUTOR,
              '2026-07-09T10:00:00.000Z',
            ),
          ],
        },
      })

      expect(
        caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
          .value,
      ).toEqual({ color: 'blue', text: 'Ákæruvald' })
      expect(
        caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
      ).toEqual({ str: '5.7.2026' })
    })

    it('does not count a prosecution appeal that was withdrawn', () => {
      const c = row({
        defendants: [
          {
            id: 'defendant_id',
            verdicts: [{ appealDate: new Date('2026-07-05T00:00:00.000Z') }],
          },
        ],
        appeal: {
          appealEventLogs: [
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.PROSECUTOR,
              '2026-07-01T10:00:00.000Z',
            ),
            appealEvent(
              AppealEventType.APPEAL_WITHDRAWN,
              UserRole.PROSECUTOR,
              '2026-07-02T10:00:00.000Z',
            ),
          ],
        },
      })

      expect(
        caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
          .value,
      ).toEqual({ color: 'rose', text: 'Ákærði' })
      expect(
        caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
      ).toEqual({ str: '5.7.2026' })
    })

    // A verdict appealed before appeal cases were kept is on the list with no
    // appeal case at all, so the row has to answer from what put it there.
    // The review decision stands in for a prosecution appeal that left no
    // event. Here it left two, and the later one withdrew it: the decision
    // still saying "appeal" must not put the prosecution back on the row.
    it('does not restore a withdrawn prosecution appeal from the review decision', () => {
      const c = row({
        defendants: [
          {
            id: 'defendant_id',
            indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
            verdicts: [{ appealDate: new Date('2026-08-11T00:00:00.000Z') }],
          },
        ],
        appeal: {
          appealEventLogs: [
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.DEFENDER,
              '2026-08-20T10:00:00.000Z',
            ),
            appealEvent(
              AppealEventType.APPEALED,
              UserRole.PROSECUTOR,
              '2026-08-05T10:00:00.000Z',
            ),
            appealEvent(
              AppealEventType.APPEAL_WITHDRAWN,
              UserRole.PROSECUTOR,
              '2026-08-25T10:00:00.000Z',
            ),
          ],
        },
      })

      expect(
        caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
          .value,
      ).toEqual({ color: 'rose', text: 'Ákærði' })
      expect(
        caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
      ).toEqual({ str: '11.8.2026' })
    })

    describe('without an appeal case', () => {
      it('reads a prosecution appeal off the review decision', () => {
        const c = row({
          appeal: null,
          defendants: [
            {
              id: 'defendant_id',
              indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
              eventLogs: [
                {
                  eventType: DefendantEventType.INDICTMENT_REVIEWED,
                  created: new Date('2026-03-30T10:00:00.000Z'),
                },
              ],
            },
          ],
        })

        expect(
          caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
            .value,
        ).toEqual({ color: 'blue', text: 'Ákæruvald' })
        expect(
          caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
        ).toEqual({ str: '30.3.2026' })
      })

      it('reads a defence appeal off the latest verdict', () => {
        const c = row({
          appeal: null,
          defendants: [
            {
              id: 'accepting_defendant_id',
              indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
            },
            {
              id: 'appealing_defendant_id',
              indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
              verdicts: [{ appealDate: new Date('2026-07-05T00:00:00.000Z') }],
            },
          ],
        })

        expect(
          caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
            .value,
        ).toEqual({ color: 'rose', text: 'Ákærði' })
        expect(
          caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
        ).toEqual({ str: '5.7.2026' })
      })

      it('leaves both cells empty when nothing says who appealed', () => {
        const c = row({ appeal: null, defendants: [{ id: 'defendant_id' }] })

        expect(
          caseTableCellGenerators.verdictAppealAppellantTag.generate(c, user)
            .value,
        ).toBeUndefined()
        expect(
          caseTableCellGenerators.verdictAppealDate.generate(c, user).value,
        ).toBeUndefined()
      })
    })
  })

  describe('appeal prosecutor', () => {
    it('names the prosecutor assigned to the appeal', () => {
      const cell = caseTableCellGenerators.appealProsecutor.generate(
        row({
          appealProsecutor: { name: 'Sóldís Arnþórsdóttir' },
          prosecutor: { name: 'Hallvarður Eyjólfsson' },
        }),
        user,
      )

      expect(cell.value).toEqual({ str: 'Sóldís Arnþórsdóttir' })
    })

    it('is empty until the appeal has been assigned', () => {
      const cell = caseTableCellGenerators.appealProsecutor.generate(
        row({ prosecutor: { name: 'Hallvarður Eyjólfsson' } }),
        user,
      )

      expect(cell.value).toBeUndefined()
    })
  })

  // Built from the clock - see the helper's own spec for the stages. What is
  // left to show here is how each one reaches the cell.
  describe('progress and next session', () => {
    const daysFromNow = (days: number) =>
      new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    it.each([
      [{ sentAppealSummonses: [{ id: 'summons' }] }, 'purple', 'Sent'],
      [{ appealCaseNumber: '526/2026' }, 'blueberry', 'Móttekið'],
      [
        {
          appealCaseNumber: '526/2026',
          statementDeadlines: [{ deadline: daysFromNow(5) }],
        },
        'blue',
        'Frestir',
      ],
      [
        {
          appealCaseNumber: '526/2026',
          courtSessions: [
            {
              sessionType: AppealCourtSessionType.MAIN_HEARING,
              sessionDate: daysFromNow(5),
            },
          ],
        },
        'mint',
        'Á dagskrá',
      ],
    ])('tags the appeal by how far it has come: %#', (appeal, color, text) => {
      const cell = caseTableCellGenerators.verdictAppealProgress.generate(
        row({ appeal: { appealState: AppealCaseState.APPEALED, ...appeal } }),
        user,
      )

      expect(cell.value).toEqual({ color, text })
    })

    it('sorts the stages in the order an appeal passes through them', () => {
      const sortValue = (appeal: Record<string, unknown>) =>
        caseTableCellGenerators.verdictAppealProgress.generate(
          row({ appeal }),
          user,
        ).sortValue as string

      const sent = sortValue({ sentAppealSummonses: [{ id: 'summons' }] })
      const received = sortValue({ appealCaseNumber: '526/2026' })
      const deadlines = sortValue({
        statementDeadlines: [{ deadline: daysFromNow(5) }],
      })
      const scheduled = sortValue({
        courtSessions: [
          {
            sessionType: AppealCourtSessionType.MAIN_HEARING,
            sessionDate: daysFromNow(5),
          },
        ],
      })

      expect([scheduled, deadlines, received, sent].sort()).toEqual([
        sent,
        received,
        deadlines,
        scheduled,
      ])
    })

    it.each([
      ['an appeal that has not been sent', { appeal: {} }],
      ['a verdict with no appeal case', { appeal: null }],
    ])('shows no progress and no session for %s', (_, fields) => {
      expect(
        caseTableCellGenerators.verdictAppealProgress.generate(
          row(fields),
          user,
        ).value,
      ).toBeUndefined()
      expect(
        caseTableCellGenerators.verdictAppealCourtSession.generate(
          row(fields),
          user,
        ).value,
      ).toBeUndefined()
    })

    it('shows the next session with its type, day and time', () => {
      const cell = caseTableCellGenerators.verdictAppealCourtSession.generate(
        row({
          appeal: {
            courtSessions: [
              {
                sessionType: AppealCourtSessionType.VERDICT,
                sessionDate: daysFromNow(30),
              },
              {
                sessionType: AppealCourtSessionType.PREPARATORY_HEARING,
                sessionDate: daysFromNow(3),
              },
            ],
          },
        }),
        user,
      )
      const { strList } = cell.value as { strList: string[] }

      expect(strList).toHaveLength(2)
      expect(strList[0]).toBe('Undirbúningsþinghald')
      expect(strList[1]).toMatch(/^\S+ \d{1,2}\. \S+ \d{4} kl\. \d{2}:\d{2}$/)
    })

    // A session still on the calendar of an appeal that is over is not one
    // anybody will attend.
    it.each([AppealCaseState.COMPLETED, AppealCaseState.WITHDRAWN])(
      'shows no session for a %s appeal',
      (appealState) => {
        const cell = caseTableCellGenerators.verdictAppealCourtSession.generate(
          row({
            appeal: {
              appealState,
              courtSessions: [
                {
                  sessionType: AppealCourtSessionType.MAIN_HEARING,
                  sessionDate: daysFromNow(3),
                },
              ],
            },
          }),
          user,
        )

        expect(cell.value).toBeUndefined()
      },
    )

    // There is no status yet that a past session would explain, so the cell
    // empties once the last session called has been held.
    it('shows no session once every one has been held', () => {
      const cell = caseTableCellGenerators.verdictAppealCourtSession.generate(
        row({
          appeal: {
            courtSessions: [
              {
                sessionType: AppealCourtSessionType.MAIN_HEARING,
                sessionDate: daysFromNow(-3),
              },
            ],
          },
        }),
        user,
      )

      expect(cell.value).toBeUndefined()
    })
  })
})
