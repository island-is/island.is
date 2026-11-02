import { forwardRef, Inject, Injectable } from '@nestjs/common'

import { Case } from '../../repository'
import { CaseService } from '../case.service'
import { BaseCaseExistsGuard } from './baseCaseExists.guard'
import { CaseLoadInclude } from './traceCaseLoad'

@Injectable()
export class CaseExistsGuard extends BaseCaseExistsGuard {
  protected readonly include: CaseLoadInclude = 'case'

  constructor(
    @Inject(forwardRef(() => CaseService))
    private readonly caseService: CaseService,
  ) {
    super()
  }

  protected loadCase(caseId: string): Promise<Case> {
    return this.caseService.findById(caseId)
  }
}
