import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { AppealSummonsServiceRecipient, Case } from '../../repository'

/**
 * Replaces the service recipient on the request with the copy carried by the
 * locked case. The external-police lookup that supplies the case id runs
 * before CaseExistsForUpdateGuard, so its fields may be stale; only the ids
 * are trustworthy until this swap.
 */
@Injectable()
export class AppealSummonsServiceOnCaseGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const service: AppealSummonsServiceRecipient = request.appealSummonsService

    if (!service) {
      throw new InternalServerErrorException('Missing appeal summons service')
    }

    const serviceOnCase = theCase.verdictAppealCase?.appealSummonses
      ?.flatMap((summons) => summons.services ?? [])
      .find((candidate) => candidate.id === service.id)

    if (!serviceOnCase) {
      throw new NotFoundException(
        `Appeal summons service ${service.id} is not on case ${theCase.id}`,
      )
    }

    request.appealSummonsService = serviceOnCase

    return true
  }
}
