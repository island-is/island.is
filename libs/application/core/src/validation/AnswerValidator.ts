import { Application } from '../types/Application'

export type AnswerValidationError =
  | { message: string; path: string }
  | undefined

export type AnswerValidator = (
  newAnswer: unknown,
  application: Application,
) =>
  | Promise<AnswerValidationError | undefined>
  | AnswerValidationError
  | undefined
