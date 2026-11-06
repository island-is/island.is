import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import { getOrCreateTransaction } from '../../../middleware'
import { LimitedAccessCaseService } from '../limitedAccessCase.service'
import { traceCaseLoad } from './traceCaseLoad'

/**
 * The locking sibling of `LimitedAccessCaseExistsGuard`, as
 * `CaseExistsForUpdateGuard` is of `CaseExistsGuard`: it opens the request's
 * transaction and reads the case row under `FOR UPDATE` before the limited
 * access read, so that the handler decides its mutation against a case no one
 * else can change. The read is narrowed to the caller exactly as the plain
 * guard narrows it. The transaction is committed by
 * `TransactionCommitInterceptor` before the response is serialized, and
 * rolled back by `TransactionContextMiddleware` if the request ends without
 * committing.
 *
 * The rules `CaseExistsForUpdateGuard` states apply here unchanged: the
 * handler must not open a transaction of its own, and `RolesGuard` goes first
 * where no roles rule on the route reads `request.case`, so that an
 * unauthorized caller is turned away before a write lock is taken on its
 * behalf. Only a spec that runs the chain can tell that the order is right.
 *
 * `canActivate` mirrors the plain guard's rather than sharing a base with it,
 * so that adopting this guard on a route changes nothing about the routes
 * that keep the other.
 */
@Injectable()
export class LimitedAccessCaseExistsForUpdateGuard implements CanActivate {
  constructor(
    private readonly limitedAccessCaseService: LimitedAccessCaseService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId: string = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    request.case = await traceCaseLoad(
      LimitedAccessCaseExistsForUpdateGuard.name,
      'limitedAccess',
      request,
      async () => {
        const transaction = await getOrCreateTransaction(this.sequelize)

        return this.limitedAccessCaseService.findByIdForUpdate(
          caseId,
          transaction,
          request.user?.currentUser,
        )
      },
    )

    return true
  }
}
