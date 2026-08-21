import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseTransition, User } from '@island.is/judicial-system/types'

import { getTransitionRule } from './caseTransitionRules'

// TODO: Consider moving this logic to the district court transition rules
// rather than maintaining two distinct role/user based guards
// A similar case is handled in districtCourtJudgeSignRulingRule
@Injectable()
// Used for more complex cases than just whether a role can perform a
// transition overall, which is handled in the transition roles rules
export class CaseTransitionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const { transition, indictmentDecision, indictmentRulingDecision } =
      request.body
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

    // Guard against completing a case against stale decisions: the completing
    // user must confirm completion against the decisions that are actually
    // persisted on the case. If another user changed them in the meantime, the
    // values sent by the client will no longer match and we reject the
    // completion to avoid leaving the case in an inconsistent state.
    if (transition === CaseTransition.COMPLETE) {
      const decisionMismatch =
        (indictmentDecision !== undefined &&
          indictmentDecision !== theCase.indictmentDecision) ||
        (indictmentRulingDecision !== undefined &&
          indictmentRulingDecision !== theCase.indictmentRulingDecision)

      if (decisionMismatch) {
        throw new ConflictException(
          'The case decision has changed since it was selected. Reload the case and try again.',
        )
      }
    }

    return true
  }
}
