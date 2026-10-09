import { validate as isUuid } from 'uuid'

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'

import { MinimalCase } from '../models/case.types'

/**
 * Reads the case row named by the route - the case's own columns, none of
 * its associations - and puts it on the request, where `@MinimalCurrentCase()`
 * and the guards that run after it pick it up. Subclasses decide how the row
 * is read - see `MinimalCaseExistsGuard` and `MinimalCaseExistsForUpdateGuard`.
 */
export abstract class BaseMinimalCaseExistsGuard implements CanActivate {
  protected abstract loadCase(caseId: string): Promise<MinimalCase>

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    if (!isUuid(caseId)) {
      throw new BadRequestException('Invalid case id format')
    }

    request.case = await this.loadCase(caseId)

    return true
  }
}
