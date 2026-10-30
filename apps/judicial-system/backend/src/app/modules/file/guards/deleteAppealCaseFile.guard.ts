import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { isAppealFileDeletionLocked } from '@island.is/judicial-system/types'

import { findAppealCaseOfCaseFile } from '../../appeal-case'
import { Case, CaseFile } from '../../repository'

// Appeal files submitted by the parties are delivered to the court of appeals
// as soon as it registers its case number, so from that point on they can no
// longer be deleted. The court of appeals' own documents are not affected.
@Injectable()
export class DeleteAppealCaseFileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const caseFile: CaseFile = request.caseFile

    if (!caseFile) {
      throw new InternalServerErrorException('Missing case file')
    }

    if (
      isAppealFileDeletionLocked(
        caseFile.category,
        findAppealCaseOfCaseFile(theCase, caseFile),
      )
    ) {
      throw new ForbiddenException(
        'Forbidden when the court of appeals has registered its case number',
      )
    }

    return true
  }
}
