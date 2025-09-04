import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { VictimService } from '../victim.service'

@Injectable()
export class ValidateVictimGuard implements CanActivate {
  constructor(private readonly victimService: VictimService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const victimId = request.params.victimId

    // If the victimId is not provided, we don't need to validate it
    if (!victimId) {
      return true
    }

    request.victim = await this.victimService.findById(victimId)

    const theCase = request.case

    // We don't want to allow the user to access a victim without the case being specified first
    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    if (theCase.id !== request.victim.caseId) {
      throw new BadRequestException('Victim does not belong to case')
    }

    return true
  }
}
