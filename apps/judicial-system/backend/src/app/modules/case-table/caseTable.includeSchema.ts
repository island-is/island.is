import { Model, ModelStatic } from 'sequelize-typescript'

import {
  Case,
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
type ObjectKeys<T> = Extract<
  {
    [K in keyof T]: DefinedObject<T[K]> extends object ? K : never
  }[keyof T],
  string
>

type NestedSchemaEntry<T> = {
  model: DefinedObject<T> extends Model ? ModelStatic<DefinedObject<T>> : never
  order?: [[keyof DefinedObject<T>, 'ASC' | 'DESC']]
  separate?: boolean
}

type TopLevelSchemaEntry<T> = NestedSchemaEntry<T> & {
  includes?: Partial<{
    [K in ObjectKeys<DefinedObject<T>>]: NestedSchemaEntry<DefinedObject<T>[K]>
  }>
}

export type CaseIncludes = {
  [K in ObjectKeys<Case>]: {
    attributes?: (keyof DefinedObject<Case[K]>)[]
    where?: {
      [K2 in keyof DefinedObject<Case[K]>]?: unknown
    }
    includes?: Partial<{
      [K2 in ObjectKeys<DefinedObject<Case[K]>>]: {
        attributes?: (keyof DefinedObject<DefinedObject<Case[K]>[K2]>)[]
        where?: {
          [K3 in keyof DefinedObject<DefinedObject<Case[K]>[K2]>]?: unknown
        }
      }
    }>
  }
}

export type CaseIncludeSchema = Partial<{
  [K in ObjectKeys<Case>]: TopLevelSchemaEntry<Case[K]>
}>

// Defines the structural properties (model, order, separate) for each
// association that case table cell generators may include. Cell generators
// declare only what data they need (attributes, where); this schema supplies
// how to query it.
export const caseIncludeSchema: CaseIncludeSchema = {
  court: { model: Institution },
  prosecutor: { model: User },
  indictmentReviewer: { model: User },
  appealJudge1: { model: User },
  defendants: {
    model: Defendant,
    order: [['created', 'ASC']],
    separate: true,
    includes: {
      verdicts: {
        model: Verdict,
        order: [['created', 'DESC']],
        separate: true,
      },
      subpoenas: {
        model: Subpoena,
        order: [['created', 'DESC']],
        separate: true,
      },
      eventLogs: { model: DefendantEventLog, separate: true },
    },
  },
  dateLogs: {
    model: DateLog,
    order: [['created', 'DESC']],
    separate: true,
  },
  eventLogs: {
    model: EventLog,
    separate: true,
  },
}
