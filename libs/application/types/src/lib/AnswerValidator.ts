import { Application } from './Application'
import { RecordObject } from './Fields'
import { StaticText } from './Form'

export type AnswerValidationError =
  | { message: StaticText; path: string; values?: RecordObject<any> }
  | undefined

export type AnswerValidator = (
  newAnswer: unknown,
  application: Application,
) =>
  | Promise<AnswerValidationError | undefined>
  | AnswerValidationError
  | undefined
