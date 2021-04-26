import { Application } from '../types/Application'
import { RecordObject } from '../types/Fields'
import { StaticText } from '../types/Form'

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
