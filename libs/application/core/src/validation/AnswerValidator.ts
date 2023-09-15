import {
  StaticText,
  RecordObject,
  Application,
} from '@island.is/application/types'

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
