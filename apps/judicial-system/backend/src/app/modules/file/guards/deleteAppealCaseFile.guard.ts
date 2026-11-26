import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { getAppealFileDeletionLockReason } from '@island.is/judicial-system/types'

import { findAppealCaseOfCaseFile } from '../../appeal-case'
import { Case, CaseFile } from '../../repository'
import { canUserAccessCaseFileCategory } from './caseFileCategory'

// Appeal files submitted by the parties are delivered to the court of appeals
// as soon as it registers its case number, so from that point on they can no
// longer be deleted. A verdict-appeal greinargerð also locks once that party
// has recorded APPEAL_STATEMENT_SENT. The court of appeals' own documents are
// not affected, but its judgment or ruling on a verdict appeal is its own to
// delete.
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
      !canUserAccessCaseFileCategory(
        request.user?.currentUser,
        caseFile.category,
      )
    ) {
      throw new ForbiddenException(
        'Only court of appeals users can delete this file',
      )
    }

    const appealCase = findAppealCaseOfCaseFile(theCase, caseFile)
    const party = {
      defendantId: caseFile.defendantId,
      civilClaimantId: caseFile.civilClaimantId,
    }

    const lockReason = getAppealFileDeletionLockReason(
      caseFile.category,
      appealCase,
      party,
    )

    if (lockReason === 'statement_filed') {
      throw new ForbiddenException(
        'Forbidden when the appeal statement has already been filed',
      )
    }

    if (lockReason) {
      throw new ForbiddenException(
        'Forbidden when the court of appeals has registered its case number',
      )
    }

    return true
  }
}
