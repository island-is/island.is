import { WhereOptions } from 'sequelize'
import { ModelStatic } from 'sequelize-typescript'

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
  appealJudge1: ModelDef<typeof User>
  dateLogs: ModelDef<typeof DateLog>
  defendants: ModelDef<typeof Defendant>
  court: ModelDef<typeof Institution>
  eventLogs: ModelDef<typeof EventLog>
  indictmentReviewer: ModelDef<typeof User>
  prosecutor: ModelDef<typeof User>
} = {
  appealJudge1: { model: User, separate: false },
  dateLogs: { model: DateLog, separate: true, order: [['created', 'DESC']] },
  defendants: {
    model: Defendant,
    separate: false,
    order: [['created', 'ASC']],
  },
  court: { model: Institution, separate: false },
  eventLogs: { model: EventLog, separate: true },
  indictmentReviewer: { model: User, separate: false },
  prosecutor: { model: User, separate: false },
}

export const subModelMap: {
  eventLogs: ModelDef<typeof DefendantEventLog>
  subpoenas: ModelDef<typeof Subpoena>
  verdicts: ModelDef<typeof Verdict>
} = {
  eventLogs: { model: DefendantEventLog, separate: true },
  subpoenas: { model: Subpoena, separate: false, order: [['created', 'DESC']] },
  verdicts: { model: Verdict, separate: false, order: [['created', 'DESC']] },
}

export type CaseWhereOptions = {
  includes?: CaseIncludes
  where: WhereOptions
}
