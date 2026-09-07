import {
  HttpInternalServerErrorProblem,
  HttpProblem,
  ValidationFailedProblem,
  BadSubjectProblem,
  TemplateApiErrorProblem,
  AttemptFailedProblem,
  BadSessionProblem,
  GatewayTimeoutProblem,
} from './problems'

export type Problem =
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationFailedProblem
  | BadSubjectProblem
  | TemplateApiErrorProblem
  | AttemptFailedProblem
  | BadSessionProblem
  | GatewayTimeoutProblem
