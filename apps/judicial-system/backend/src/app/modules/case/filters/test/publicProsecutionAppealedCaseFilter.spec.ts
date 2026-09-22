import { v4 as uuid } from 'uuid'

import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  EventType,
  IndictmentCaseReviewDecision,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { verifyNoAccess, verifyReadAccess } from './verify'

// A prosecutor at the public prosecutor's office reads every appealed verdict,
// including the cases they never reviewed. Everything here is about that one
// widening: the case is owned by another office and reviewed by someone else,
// so the ordinary prosecution rule denies it and only the appeal can grant it.
describe('public prosecution user - appealed verdicts', () => {
  const user = {
    id: uuid(),
    role: UserRole.PROSECUTOR,
    institution: {
      id: uuid(),
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User

  const anotherOfficeCase = (defendant: unknown, overrides = {}): Case =>
    ({
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      // Neither the user's office nor the user's review - the two routes the
      // ordinary prosecution rule would otherwise let through.
      prosecutorsOfficeId: uuid(),
      indictmentReviewerId: uuid(),
      eventLogs: [
        { eventType: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR },
      ],
      defendants: [defendant],
      ...overrides,
    } as Case)

  describe('the defence appealed - an appeal date on the latest verdict', () => {
    verifyReadAccess(
      anotherOfficeCase({ verdicts: [{ appealDate: new Date() }] }),
      user,
    )
  })

  describe('the prosecution appealed - the reviewer decided to', () => {
    verifyReadAccess(
      anotherOfficeCase({
        indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
        verdicts: [{}],
      }),
      user,
    )
  })

  describe('one of several defendants appealed', () => {
    const theCase = anotherOfficeCase({ verdicts: [{}] })
    theCase.defendants = [
      ...(theCase.defendants ?? []),
      { verdicts: [{ appealDate: new Date() }] },
    ] as Case['defendants']

    verifyReadAccess(theCase, user)
  })

  describe('nobody appealed', () => {
    verifyNoAccess(anotherOfficeCase({ verdicts: [{}] }), user)
  })

  describe('no verdict at all', () => {
    verifyNoAccess(anotherOfficeCase({}), user)
  })

  // Only the latest verdict counts. A defendant given a new verdict is back
  // where they started, whatever happened to the one before it - the verdicts
  // come newest first from the case include graph.
  describe('an older verdict was appealed but the latest was not', () => {
    verifyNoAccess(
      anotherOfficeCase({
        verdicts: [{}, { appealDate: new Date() }],
      }),
      user,
    )
  })

  // Closing without enforcement writes a defendant event and nothing else - it
  // never withdraws the appeal. An appeal can therefore be standing at the
  // court of appeals against a judgment the office has decided not to enforce,
  // and whoever argues it still needs the case.
  describe('the appealing defendant was closed without enforcement', () => {
    verifyReadAccess(
      anotherOfficeCase({
        isClosedWithoutEnforcement: true,
        verdicts: [{ appealDate: new Date() }],
      }),
      user,
    )
  })

  // A fine is appealed by ruling appeal, not verdict appeal, so a review
  // decision of APPEAL against one does not belong in this list.
  describe('a fine was appealed', () => {
    verifyNoAccess(
      anotherOfficeCase(
        { indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL },
        { indictmentRulingDecision: CaseIndictmentRulingDecision.FINE },
      ),
      user,
    )
  })

  // The office predicate still has to hold - an appeal cannot conjure access
  // to a case that never reached the public prosecutor.
  describe('the indictment never reached the public prosecutor', () => {
    verifyNoAccess(
      anotherOfficeCase(
        { verdicts: [{ appealDate: new Date() }] },
        { eventLogs: [] },
      ),
      user,
    )
  })

  describe('the case is not completed', () => {
    verifyNoAccess(
      anotherOfficeCase(
        { verdicts: [{ appealDate: new Date() }] },
        { state: CaseState.RECEIVED },
      ),
      user,
    )
  })

  // The widening reaches PROSECUTOR at this office and no other role there.
  // isPublicProsecutionUser is the only thing saying so, and nothing else in
  // the branch would notice if that changed.
  describe('a representative at the same office', () => {
    const representative = {
      id: uuid(),
      role: UserRole.PROSECUTOR_REPRESENTATIVE,
      institution: {
        id: uuid(),
        type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      },
    } as User

    verifyNoAccess(
      anotherOfficeCase({ verdicts: [{ appealDate: new Date() }] }),
      representative,
    )
  })

  // The widening is for this office only. An appealed verdict at a district
  // prosecutor's office is still none of their prosecutors' business unless
  // the ordinary rule says so.
  describe('a prosecutor at another office', () => {
    const districtProsecutor = {
      id: uuid(),
      role: UserRole.PROSECUTOR,
      institution: {
        id: uuid(),
        type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE,
      },
    } as User

    verifyNoAccess(
      anotherOfficeCase({ verdicts: [{ appealDate: new Date() }] }),
      districtProsecutor,
    )
  })
})
