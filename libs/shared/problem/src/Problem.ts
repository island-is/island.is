import {
  HttpInternalServerErrorProblem,
  HttpProblem,
  ValidationFailedProblem,
  BadSubjectProblem,
  TemplateApiErrorProblem,
} from './problems'

export type Problem =
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationFailedProblem
  | BadSubjectProblem
  | TemplateApiErrorProblem
