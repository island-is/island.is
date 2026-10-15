import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'

import { isDefenceUser } from '@island.is/judicial-system/types'

import { CivilClaimant, Defendant } from '../../repository'

/**
 * Lets a defence user at a party's document only when they act for that
 * party.
 *
 * The case read guard before this one has already established that the user
 * is a confirmed defender or spokesperson somewhere on the case; this guard
 * narrows that to the party named in the route, which the party guard before
 * it has put on the request. A defender of one of the accused is not party to
 * what the court sends the other's defender.
 *
 * Who acts for a party is decided the way it is everywhere else on the case:
 * the advocate the district court confirmed. The court of appeals' own
 * appointment grants no access of its own yet.
 *
 * Anyone who is not a defence user passes - which of them the route admits is
 * the role rules' business.
 */
@Injectable()
export class DefenceAdvocateOfPartyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user?.currentUser
    const defendant: Defendant | undefined = request.defendant
    const civilClaimant: CivilClaimant | undefined = request.civilClaimant

    if (!user || (!defendant && !civilClaimant)) {
      throw new ForbiddenException()
    }

    if (!isDefenceUser(user)) {
      return true
    }

    if (defendant) {
      if (
        !Defendant.isConfirmedDefenderOfDefendant(user.nationalId, [defendant])
      ) {
        throw new ForbiddenException(
          `Defender is not confirmed for defendant ${defendant.id}`,
        )
      }

      return true
    }

    if (
      civilClaimant &&
      !CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(user.nationalId, [
        civilClaimant,
      ])
    ) {
      throw new ForbiddenException(
        `Spokesperson is not confirmed for civil claimant ${civilClaimant.id}`,
      )
    }

    return true
  }
}
