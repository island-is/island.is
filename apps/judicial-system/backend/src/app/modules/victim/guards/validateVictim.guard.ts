import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import { getOrCreateTransaction } from '../../../middleware'
import { VictimService } from '../victim.service'

// Runs after MinimalCaseExistsForUpdateGuard, which has opened the request's
// transaction and locked the case row in it, so the victim is read in that
// same transaction: it then sees the state the lock protects, and the request
// does not hold a second pooled connection while it waits for the first.
@Injectable()
export class ValidateVictimGuard implements CanActivate {
  constructor(
    private readonly victimService: VictimService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const victimId = request.params.victimId

    // If the victimId is not provided, we don't need to validate it
    if (!victimId) {
      return true
    }

    const theCase = request.case

    // We don't want to allow the user to access a victim without the case being specified first
    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const transaction = await getOrCreateTransaction(this.sequelize)

    request.victim = await this.victimService.findById(victimId, {
      transaction,
    })

    if (theCase.id !== request.victim.caseId) {
      throw new BadRequestException('Victim does not belong to case')
    }

    return true
  }
}
