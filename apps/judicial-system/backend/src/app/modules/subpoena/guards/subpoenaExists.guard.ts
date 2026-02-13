import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { Case, Defendant } from '../../repository'

@Injectable()
export class SubpoenaExistsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const defendant: Defendant = request.defendant

    if (!defendant) {
      throw new InternalServerErrorException('Missing defendant')
    }

    const subpoenaId = request.params.subpoenaId

    if (!subpoenaId) {
      throw new BadRequestException('Missing subpoena id')
    }

    const subpoena = defendant.subpoenas?.find(
      (subpoena) => subpoena.id === subpoenaId,
    )

    if (!subpoena) {
      throw new BadRequestException(
        `Subpoena ${subpoenaId} of defendant ${defendant.id} does not exist`,
      )
    }

    if (defendant.caseId !== theCase.id) {
      const splitCase = theCase.splitCases?.find(
        (c) => c.id === defendant.caseId,
      )

      if (!splitCase) {
        // This should never happen because of the SplitDefendantExistsGuard
        throw new InternalServerErrorException(
          `Defendant ${defendant.id} is linked to case ${defendant.caseId} which is not a split case of case ${theCase.id}`,
        )
      }

      if (subpoena.created > splitCase.created) {
        // Subpoena was created after the split case was created, so it cannot be access from the parent case
        return false
      }
    }

    request.subpoena = subpoena

    return true
  }
}

@Injectable()
export class SubpoenaExistsOptionalGuard extends SubpoenaExistsGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const subpoenaId = request.params.subpoenaId

    if (subpoenaId) {
      return super.canActivate(context)
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const defendant: Defendant = request.defendant

    if (!defendant) {
      throw new InternalServerErrorException('Missing defendant')
    }

    if (defendant.caseId !== theCase.id) {
      throw new BadRequestException(
        `Subpoena id cannot be optional for split case defendants`,
      )
    }

    return true
  }
}
