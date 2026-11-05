import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'

import { Case } from '../../repository'
import { CaseLoadInclude, traceCaseLoad } from './traceCaseLoad'

/**
 * Reads the case named by the route and puts it on the request, where
 * `@CurrentCase()` and the guards that run after it pick it up. Subclasses
 * decide how the case is read - see `CaseExistsGuard` and
 * `CaseExistsForUpdateGuard` - and name the include profile they read it
 * with, which is what the load is traced under.
 */
export abstract class BaseCaseExistsGuard implements CanActivate {
  protected abstract readonly include: CaseLoadInclude

  protected abstract loadCase(caseId: string): Promise<Case>

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    request.case = await traceCaseLoad(
      this.constructor.name,
      this.include,
      request,
      () => this.loadCase(caseId),
    )

    return true
  }
}
