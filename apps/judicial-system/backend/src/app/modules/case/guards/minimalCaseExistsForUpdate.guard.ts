import { Sequelize } from 'sequelize-typescript'

import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import { getOrCreateTransaction } from '../../../middleware'
import { CaseService } from '../case.service'
import { MinimalCase } from '../models/case.types'
import { BaseMinimalCaseExistsGuard } from './baseMinimalCaseExists.guard'

/**
 * The locking sibling of `MinimalCaseExistsGuard`, as `CaseExistsForUpdateGuard`
 * is of `CaseExistsGuard`: it opens the request's transaction and reads the
 * case row under `FOR UPDATE`, so that the handler decides its mutation
 * against a case no one else can change. The transaction is committed by
 * `TransactionCommitInterceptor` before the response is serialized, and
 * rolled back by `TransactionContextMiddleware` if the request ends without
 * committing.
 *
 * The rules `CaseExistsForUpdateGuard` states apply here unchanged: the
 * handler must not open a transaction of its own, and `RolesGuard` goes first
 * where no roles rule on the route reads `request.case`, so that an
 * unauthorized caller is turned away before a write lock is taken on its
 * behalf. Only a spec that runs the chain can tell that the order is right.
 */
@Injectable()
export class MinimalCaseExistsForUpdateGuard extends BaseMinimalCaseExistsGuard {
  constructor(
    @Inject(forwardRef(() => CaseService))
    private readonly caseService: CaseService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {
    super()
  }

  protected async loadCase(caseId: string): Promise<MinimalCase> {
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.caseService.findMinimalByIdForUpdate(caseId, transaction)
  }
}
