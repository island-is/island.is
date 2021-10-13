import {
  HttpInternalServerErrorProblem,
  HttpProblem,
  ValidationProblem,
} from './problems'

export type Problem =
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationProblem
