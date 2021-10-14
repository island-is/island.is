import {
  HttpInternalServerErrorProblem,
  HttpProblem,
  ValidationFailedProblem,
} from './problems'

export type Problem =
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationFailedProblem
