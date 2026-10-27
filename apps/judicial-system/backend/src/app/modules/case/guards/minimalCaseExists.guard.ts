import { forwardRef, Inject, Injectable } from '@nestjs/common'

import { CaseService } from '../case.service'
import { MinimalCase } from '../models/case.types'
import { BaseMinimalCaseExistsGuard } from './baseMinimalCaseExists.guard'

@Injectable()
export class MinimalCaseExistsGuard extends BaseMinimalCaseExistsGuard {
  constructor(
    @Inject(forwardRef(() => CaseService))
    private readonly caseService: CaseService,
  ) {
    super()
  }

  protected loadCase(caseId: string): Promise<MinimalCase> {
    return this.caseService.findMinimalById(caseId)
  }
}
