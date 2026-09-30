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

/**
 * A case as a case table row sees it.
 *
 * One appeal, named for what it is: the appeal this row is about. Which appeal
 * that is belongs to the list, not to whatever reads the row - most rows are
 * about the case-level appeal, a ruling order list fans one case out into a
 * row per appeal, and a verdict list substitutes the verdict appeal.
 *
 * The three associations are gone from the row on purpose. While `appealCase`
 * was both "the case-level ruling appeal" and "the appeal this row is about",
 * every reader had to know which lists rewrote it, and nothing said so; the
 * shape is now the same whichever list built it.
 *
 * What it still claims and should not: `Omit` keeps the model's methods, while
 * a row is the plain object `toJSON` returns. Nothing reads them - the
 * generators and the row helpers were checked - so this is the old fiction
 * left in place rather than a new one.
 */
export type CaseTableRowCase = Omit<
  Case,
  'appealCase' | 'rulingOrderAppealCases' | 'verdictAppealCase'
> & {
  appeal?: AppealCase | null
}

export type CaseWhereOptions = {
  includes?: CaseIncludes
  where: WhereOptions
  displayCases?: (cases: Case[]) => CaseTableRowCase[]
}

// Every row goes through one of these, so there is no such thing as a row that
// skipped normalisation. A list that says nothing is about the case-level
// appeal, which is what all of them meant before any of this existed.
const toRow = (c: Case): CaseTableRowCase => {
  const {
    appealCase,
    rulingOrderAppealCases: _rulingOrderAppealCases,
    verdictAppealCase: _verdictAppealCase,
    ...rest
  } = c.toJSON()

  return { ...rest, appeal: appealCase } as CaseTableRowCase
}

export const toRowsWithCaseLevelAppeal = (cs: Case[]): CaseTableRowCase[] =>
  cs.map(toRow)

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
    if (merged[key]) {
      continue
    }

    copyIncludeInto(merged, accessIncludes, key)
  }

  return merged
}

/**
 * Copied rather than shared, all the way down.
 *
 * Both the access options and the cell generators are module level constants,
 * and the include machinery merges into whatever object it is handed rather
 * than building a new one. Alias a constant into a query's include tree and the
 * next merge writes another list's attributes and joins into the constant,
 * where they stay for the lifetime of the process - so what one list fetches
 * comes to depend on which lists were requested before it.
 *
 * The nested level is copied too. An access include carries no nested includes
 * today, but a generator include does, and both go through the same merge.
 *
 * `where` is shared, not copied. Nothing merges into it - it is read straight
 * through to Sequelize - and copying it would mean walking the operator symbols
 * a where clause is built from.
 */
export const copyIncludeInto = <K extends keyof CaseIncludes>(
  target: CaseIncludes,
  source: CaseIncludes,
  key: K,
) => {
  const value = source[key]

  if (!value) {
    return
  }

  const copy = { ...value, attributes: [...value.attributes] }

  if (copy.includes) {
    const nested = { ...copy.includes }

    for (const nestedKey of Object.keys(nested) as Array<keyof typeof nested>) {
      const nestedValue = nested[nestedKey]

      if (!nestedValue) {
        continue
      }

      nested[nestedKey] = {
        ...nestedValue,
        attributes: [...nestedValue.attributes],
      }
    }

    copy.includes = nested
  }

  target[key] = copy
}

export const expandCasesWithDefendants = (cs: Case[]): CaseTableRowCase[] =>
  cs.flatMap((c) => {
    const jsonCase = toRow(c)

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

/**
 * Presents the verdict appeal as the case's appeal.
 *
 * A row is about one appeal, and everything downstream asks `appealCase` which
 * one - the id on the row, the context menu, the page the row opens. On a
 * verdict appeal list that appeal is the verdict appeal, so it is put where
 * the rest of the machinery looks rather than teaching each reader which lists
 * are verdict lists. `expandCasesWithAppeals` does the same for ruling order
 * appeals.
 *
 * `verdictAppealCase` is dropped once it has been slotted in, as
 * `expandCasesWithAppeals` drops the ruling order appeals for the same reason:
 * one name for the appeal a row is about, so nothing downstream has to know
 * which list it came from. The columns still ask for the association by name -
 * that is what decides the join - and read it back off `appealCase`, exactly
 * as the ruling order columns do.
 */
export const presentVerdictAppealAsRowAppeal = (
  cs: Case[],
): CaseTableRowCase[] =>
  cs.map((c) => ({ ...toRow(c), appeal: c.verdictAppealCase }))

// Emits one synthetic case per qualifying appeal — the case-level appeal in
// `appealCase` (when present) and each entry in `rulingOrderAppealCases`. Each
// emitted case has the relevant appeal slotted into `appealCase`, so cell
// generators reading `c.appealCase.X` work without modification. The
// `rulingOrderAppealCases` array is dropped to prevent re-iteration downstream.
export const expandCasesWithAppeals = (cs: Case[]): CaseTableRowCase[] =>
  cs.flatMap((c) => {
    const row = toRow(c)
    const rulingOrderRows = (c.rulingOrderAppealCases ?? []).map(
      (rulingOrderAppeal: AppealCase) => ({
        ...row,
        appeal: rulingOrderAppeal,
      }),
    )

    return row.appeal ? [row, ...rulingOrderRows] : rulingOrderRows
  })
