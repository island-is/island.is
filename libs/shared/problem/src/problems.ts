import { StaticText } from '@island.is/shared/types'
import { BaseProblem } from './BaseProblem'
import { ProblemType } from './ProblemType'

export interface HttpProblem extends BaseProblem {
  type:
    | ProblemType.HTTP_NO_CONTENT
    | ProblemType.HTTP_BAD_REQUEST
    | ProblemType.HTTP_UNAUTHORIZED
    | ProblemType.HTTP_FORBIDDEN
    | ProblemType.HTTP_NOT_FOUND
}

export interface HttpInternalServerErrorProblem extends BaseProblem {
  type: ProblemType.HTTP_INTERNAL_SERVER_ERROR
  stack?: string
  organizationSlug?: string
}

export type ValidationFailedFields = {
  [key: string]: string | ValidationFailedFields
}
export interface ValidationFailedProblem extends BaseProblem {
  type: ProblemType.VALIDATION_FAILED
  fields: ValidationFailedFields
}

export type AlternativeSubject = {
  nationalId: string
}
export interface BadSubjectProblem extends BaseProblem {
  type: ProblemType.BAD_SUBJECT
  alternativeSubjects?: AlternativeSubject[]
}
export interface BadSessionProblem extends BaseProblem {
  type: ProblemType.BAD_SESSION
}

export interface AttemptFailedProblem extends BaseProblem {
  type: ProblemType.ATTEMPT_FAILED
  remainingAttempts: number
  fields?: ValidationFailedFields
}

export interface ProviderErrorReason {
  title: StaticText
  summary: StaticText
}

export interface TemplateApiErrorProblem extends BaseProblem {
  type: ProblemType.TEMPLATE_API_ERROR
  errorReason: ProviderErrorReason | StaticText | ProviderErrorReason[]
}

// Should be avoided whenever possible in favour of typed problems.
export interface UnknownProblem extends BaseProblem {
  [key: string]: unknown
}
