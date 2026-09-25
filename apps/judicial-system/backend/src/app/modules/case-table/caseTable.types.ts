import { WhereOptions } from 'sequelize'

import { DefendantEventType } from '@island.is/judicial-system/types'

import {
  AppealCase,
  AppealEventLog,
  Case,
  CaseFile,
  CivilClaimant,
  DateLog,
  Defendant,
  DefendantEventLog,
  EventLog,
  Institution,
  Subpoena,
  User,
  Verdict,
} from '../repository'

// gets the element type if T is an array.
type ElementType<T> = T extends (infer U)[] ? U : T

// gets the non-null, non-undefined version of ElementType<T>.
type DefinedObject<T> = NonNullable<ElementType<T>>

// extracts keys from T where the corresponding value, after non-nullable, is an object.
export type ObjectKeys<T> = Extract<
  {
    [K in keyof T]: DefinedObject<T[K]> extends object ? K : never
  }[keyof T],
  string
>

type SortDir = 'ASC' | 'DESC'

export type CaseIncludes = Partial<{
  [K in ObjectKeys<Case>]: {
    attributes: (keyof DefinedObject<Case[K]>)[]
    required?: boolean
    where?: WhereOptions
    includes?: Partial<{
      [K2 in ObjectKeys<DefinedObject<Case[K]>>]: {
        attributes: (keyof DefinedObject<DefinedObject<Case[K]>[K2]>)[]
        required?: boolean
        where?: WhereOptions
      }
    }>
  }
}>

type ModelCtor<T> = new (...args: never[]) => T

type ModelDef<M extends ModelCtor<unknown>> = {
  model: M
  separate: boolean
  order?: [[keyof DefinedObject<InstanceType<M>>, SortDir]]
}

export const modelMap: {
  dateLogs: ModelDef<typeof DateLog>
  defendants: ModelDef<typeof Defendant>
  court: ModelDef<typeof Institution>
  eventLogs: ModelDef<typeof EventLog>
  indictmentReviewer: ModelDef<typeof User>
  judge: ModelDef<typeof User>
  prosecutor: ModelDef<typeof User>
  registrar: ModelDef<typeof User>
  appealCase: ModelDef<typeof AppealCase>
  verdictAppealCase: ModelDef<typeof AppealCase>
  rulingOrderAppealCases: ModelDef<typeof AppealCase>
  civilClaimants: ModelDef<typeof CivilClaimant>
} = {
  dateLogs: { model: DateLog, separate: true, order: [['created', 'DESC']] },
  defendants: {
    model: Defendant,
    separate: false,
    order: [['created', 'ASC']],
  },
  court: { model: Institution, separate: false },
  eventLogs: { model: EventLog, separate: true },
  indictmentReviewer: { model: User, separate: false },
  judge: { model: User, separate: false },
  prosecutor: { model: User, separate: false },
  registrar: { model: User, separate: false },
  appealCase: { model: AppealCase, separate: false },
  verdictAppealCase: { model: AppealCase, separate: false },
  rulingOrderAppealCases: { model: AppealCase, separate: false },
  civilClaimants: { model: CivilClaimant, separate: true },
}

export const subModelMap: {
  appealJudge1: ModelDef<typeof User>
  appealEventLogs: ModelDef<typeof AppealEventLog>
  eventLogs: ModelDef<typeof DefendantEventLog>
  rulingFile: ModelDef<typeof CaseFile>
  subpoenas: ModelDef<typeof Subpoena>
  verdicts: ModelDef<typeof Verdict>
} = {
  appealJudge1: { model: User, separate: false },
  appealEventLogs: { model: AppealEventLog, separate: true },
  eventLogs: { model: DefendantEventLog, separate: true },
  rulingFile: { model: CaseFile, separate: false },
  subpoenas: { model: Subpoena, separate: false, order: [['created', 'DESC']] },
  verdicts: { model: Verdict, separate: false, order: [['created', 'DESC']] },
}

export type CaseWhereOptions = {
  includes?: CaseIncludes
  where: WhereOptions
  displayCases?: (cases: Case[]) => Case[]
}

/**
 * What a user may reach at all, as opposed to which of those cases belong in a
 * given list.
 *
 * Access options name the associations they read - `$appealCase.appeal_state$`
 * and the like - so they carry the includes those references need. Sequelize
 * emits an alias reference whether or not the query joined it, and Postgres
 * then rejects the whole query, so an access rule that cannot ask for its own
 * join is an assumption every caller has to remember.
 *
 * Only the combined rules - the `*CasesAccessWhereOptions` a list or a search
 * actually calls - carry includes. The narrower rules they are built from stay
 * plain where clauses, because nothing outside the access module calls one.
 * Point a list at one of those directly and the joins would not follow it; the
 * spec that checks every case table query joins every alias it names is what
 * catches that, rather than the type.
 *
 * One invariant a rule must keep: a predicate on a joined alias has to be a
 * positive test - `IN`, `IS NOT NULL` and the like. A list may join the same
 * association with a filter of its own, and the rule is then evaluated against
 * that narrowed row, so a positive test can only ever admit fewer cases. A
 * negative test - `IS NULL`, `Op.not`, `Op.notIn` - would instead be satisfied
 * by the very rows the list filtered away, and the list's filter would start
 * widening access rather than narrowing it.
 */
export type CaseAccessOptions = {
  includes?: CaseIncludes
  where: WhereOptions
}

// An access include is a bare request for a join. Where a list joins the same
// association itself, the list's version wins outright - it is the narrower
// one, and its attributes and filters are what the columns need.
export const mergeAccessIncludes = (
  accessIncludes?: CaseIncludes,
  tableIncludes?: CaseIncludes,
): CaseIncludes | undefined => {
  if (!accessIncludes) {
    return tableIncludes
  }

  const merged: CaseIncludes = { ...tableIncludes }

  for (const key of Object.keys(accessIncludes) as Array<keyof CaseIncludes>) {
    copyAccessInclude(merged, accessIncludes, key)
  }

  return merged
}

// Copied rather than shared. Access options are often module level constants,
// and the include machinery merges attributes into whatever object it is
// handed - sharing one would let a list's columns leak into every other query
// built from the same rule.
//
// Shallow in `where` and in nested `includes`, which is enough because an
// access include carries neither. One that grew nested includes would be spliced
// into by setInclude's nested merge and would need a deeper copy.
const copyAccessInclude = <K extends keyof CaseIncludes>(
  target: CaseIncludes,
  source: CaseIncludes,
  key: K,
) => {
  if (target[key]) {
    return
  }

  const value = source[key]

  if (!value) {
    return
  }

  target[key] = { ...value, attributes: [...value.attributes] }
}

export const expandCasesWithDefendants = (cs: Case[]) =>
  cs.flatMap((c) => {
    const jsonCase = c.toJSON()

    return (c.defendants ?? [])
      .filter(
        // Defendants whose indictment was cancelled or dismissed (completed for
        // some) do not receive a verdict or a review decision, so they should
        // not get their own row in these per-defendant case tables.
        (d) =>
          !DefendantEventLog.getEventLogByEventType(
            [
              DefendantEventType.INDICTMENT_CANCELLED,
              DefendantEventType.INDICTMENT_DISMISSED,
            ],
            d.eventLogs,
          ),
      )
      .map((d) => ({ ...jsonCase, defendants: [d] }))
  })

// Emits one synthetic case per qualifying appeal — the case-level appeal in
// `appealCase` (when present) and each entry in `rulingOrderAppealCases`. Each
// emitted case has the relevant appeal slotted into `appealCase`, so cell
// generators reading `c.appealCase.X` work without modification. The
// `rulingOrderAppealCases` array is dropped to prevent re-iteration downstream.
export const expandCasesWithAppeals = (cs: Case[]) =>
  cs.flatMap((c) => {
    const jsonCase = c.toJSON()
    const { rulingOrderAppealCases: _drop, ...rest } = jsonCase
    const rulingOrderRows = (c.rulingOrderAppealCases ?? []).map(
      (roa: AppealCase) => ({ ...rest, appealCase: roa }),
    )

    return rest.appealCase ? [rest, ...rulingOrderRows] : rulingOrderRows
  })
