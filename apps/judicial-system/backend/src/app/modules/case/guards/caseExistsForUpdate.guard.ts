import { Sequelize } from 'sequelize-typescript'

import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import { getOrCreateTransaction } from '../../../middleware'
import { Case } from '../../repository'
import { CaseService } from '../case.service'
import { BaseCaseExistsGuard } from './baseCaseExists.guard'

/**
 * The locking sibling of `CaseExistsGuard`: it opens the request's transaction
 * and reads the case under `FOR UPDATE`, so that the handler decides its
 * mutation against a case row no one else can change. The transaction is
 * committed by `TransactionCommitInterceptor` before the response is
 * serialized, and rolled back by `TransactionContextMiddleware` if the request
 * ends without committing.
 *
 * Two rules apply to every route that uses this guard:
 *
 * - The handler must not open a transaction of its own. A second transaction
 *   would block on this one's row lock while this one waits for the handler to
 *   return - a deterministic self-deadlock, not a race. Flagging a route and
 *   converting its handler off opening one of its own is a single change.
 * - `RolesGuard` must come first, so an authenticated but unauthorized caller
 *   cannot take a write lock on a case row and hold it until it is rejected.
 */
@Injectable()
export class CaseExistsForUpdateGuard extends BaseCaseExistsGuard {
  constructor(
    @Inject(forwardRef(() => CaseService))
    private readonly caseService: CaseService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {
    super()
  }

  protected async loadCase(caseId: string): Promise<Case> {
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.caseService.findByIdForUpdate(caseId, transaction)
  }
}
