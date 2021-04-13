import { Application } from '../types/Application'
import { StaticText } from '../types/Form'

export type AnswerValidationError =
  | { message: StaticText; path: string }
  | undefined

export type AnswerValidator = (
  newAnswer: unknown,
  application: Application,
) =>
  | Promise<AnswerValidationError | undefined>
  | AnswerValidationError
  | undefined
