import {
  HttpInternalServerErrorProblem,
  HttpProblem,
  ValidationFailedProblem,
  BadSubjectProblem,
  TemplateApiErrorProblem,
  AttemptFailedProblem,
  BadSessionProblem,
  RequestTimeoutProblem,
} from './problems'

export type Problem =
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationFailedProblem
  | BadSubjectProblem
  | TemplateApiErrorProblem
  | AttemptFailedProblem
  | BadSessionProblem
  | RequestTimeoutProblem
