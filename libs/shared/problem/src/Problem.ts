import {
  HttpInternalServerErrorProblem,
  HttpProblem,
  ValidationFailedProblem,
  BadSubjectProblem,
} from './problems'

export type Problem =
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationFailedProblem
  | BadSubjectProblem
