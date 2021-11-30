import { Catch } from '@nestjs/common'
import { ProblemError } from './ProblemError'
import { BaseProblemFilter } from './base-problem.filter'

@Catch(ProblemError)
export class ProblemFilter extends BaseProblemFilter {
  getProblem(error: ProblemError) {
    return error.problem
  }
}
