import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseFileCategory, User } from '@island.is/judicial-system/types'

import { Case } from '../../case'

@Injectable()
export class WriteCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const user: User = request.user
    const theCase: Case = request.case
    const defendant = request.defendant
    const civilClaimant = request.civilClaimant

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!user) {
      throw new InternalServerErrorException('Missing user')
    }

    // The case file category is either in the request body (creating case file)
    // or in the case file (deleting case file)
    const caseFileCategory: CaseFileCategory =
      request.body?.category ?? request.caseFile?.category

    if (!caseFileCategory) {
      throw new InternalServerErrorException('Missing case file category')
    }

    if (
      caseFileCategory === CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE &&
      !defendant
    ) {
      throw new BadRequestException('Missing defendant for case file category')
    }

    if (caseFileCategory === CaseFileCategory.CIVIL_CLAIM && !civilClaimant) {
      throw new BadRequestException(
        'Missing civil claimant for case file category',
      )
    }

    return true
  }
}
