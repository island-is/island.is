import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { getTransitionRule } from './caseTransitionRules'

@Injectable()
// Used for more complex cases than just whether a role can perform a
// transition overall, which is handled in the transition roles rules
export class CaseTransitionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const { transition } = request.body
    const theCase = request.case
    const user: User = request.user?.currentUser

    // This shouldn't happen
    if (!theCase || !user) {
      throw new InternalServerErrorException('Missing case or user')
    }

    const transitionRule = getTransitionRule(transition)

    if (!transitionRule(theCase, user)) {
      throw new ForbiddenException('Forbidden transition')
    }

    return true
  }
}
