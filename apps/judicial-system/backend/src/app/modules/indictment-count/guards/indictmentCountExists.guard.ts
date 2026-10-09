import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import { getOrCreateTransaction } from '../../../middleware'
import { Case } from '../../repository'
import { IndictmentCountService } from '../indictmentCount.service'

// Runs after MinimalCaseExistsForUpdateGuard, which has opened the request's
// transaction and locked the case row in it, so the count is read in that
// same transaction: it then sees the state the lock protects, and the request
// does not hold a second pooled connection while it waits for the first.
@Injectable()
export class IndictmentCountExistsGuard implements CanActivate {
  constructor(
    private readonly indictmentCountService: IndictmentCountService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const indictmentCountId = request.params.indictmentCountId

    if (!indictmentCountId) {
      throw new BadRequestException('Missing indictment count id')
    }

    const transaction = await getOrCreateTransaction(this.sequelize)

    const indictmentCount = await this.indictmentCountService.findById(
      indictmentCountId,
      { transaction },
    )

    if (!indictmentCount || indictmentCount.caseId !== theCase.id) {
      throw new NotFoundException(
        `Indictment count ${indictmentCountId} of case ${theCase.id} does not exist`,
      )
    }

    request.indictmentCount = indictmentCount

    return true
  }
}
