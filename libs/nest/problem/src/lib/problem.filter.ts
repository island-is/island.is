import { Catch } from '@nestjs/common'

import { BaseProblemFilter } from './base-problem.filter'
import { ProblemError } from './ProblemError'

@Catch(ProblemError)
export class ProblemFilter extends BaseProblemFilter {
  getProblem(error: ProblemError) {
    return error.problem
  }
}
