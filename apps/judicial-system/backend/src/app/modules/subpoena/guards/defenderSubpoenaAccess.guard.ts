import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { isDefenceUser } from '@island.is/judicial-system/types'

import { isConfirmedDefenderOfSpecificDefendant } from '../../file'
import { Case, Defendant } from '../../repository'

@Injectable()
export class DefenderSubpoenaAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user?.currentUser
    const theCase: Case = request.case
    const defendant: Defendant = request.defendant

    if (!user || !theCase || !defendant) {
      throw new ForbiddenException()
    }

    if (!isDefenceUser(user)) {
      return true
    }

    const allDefendants = [
      ...(theCase.defendants ?? []),
      ...(theCase.splitCases?.flatMap((c) => c.defendants ?? []) ?? []),
    ]

    if (
      !isConfirmedDefenderOfSpecificDefendant(
        user.nationalId,
        defendant.id,
        allDefendants,
      )
    ) {
      throw new ForbiddenException(
        `Defender is not confirmed for defendant ${defendant.id}`,
      )
    }

    return true
  }
}
