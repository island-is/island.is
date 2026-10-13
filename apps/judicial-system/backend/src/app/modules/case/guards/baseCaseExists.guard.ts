import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'

import { Case } from '../../repository'

/**
 * Reads the case named by the route and puts it on the request, where
 * `@CurrentCase()` and the guards that run after it pick it up. Subclasses
 * decide how the case is read - see `CaseExistsGuard` and
 * `CaseExistsForUpdateGuard`.
 */
export abstract class BaseCaseExistsGuard implements CanActivate {
  protected abstract loadCase(caseId: string): Promise<Case>

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    request.case = await this.loadCase(caseId)

    return true
  }
}
