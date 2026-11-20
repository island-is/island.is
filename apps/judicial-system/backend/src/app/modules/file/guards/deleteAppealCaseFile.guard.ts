import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  AppealCaseState,
  CaseFileCategory,
  isAppealFileDeletionLocked,
} from '@island.is/judicial-system/types'

import { findAppealCaseOfCaseFile } from '../../appeal-case'
import { Case, CaseFile } from '../../repository'
import { canUserAccessCaseFileCategory } from './caseFileCategory'

// Appeal files submitted by the parties are delivered to the court of appeals
// as soon as it registers its case number, so from that point on they can no
// longer be deleted. The court of appeals' own documents are not affected,
// but its judgment or ruling on a verdict appeal is its own to delete, until
// it concludes the appeal.
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

    // The document of a concluded verdict appeal is what its confirmation
    // stamp vouches for.
    if (
      caseFile.category === CaseFileCategory.VERDICT_APPEAL_RULING &&
      theCase.verdictAppealCase?.appealState === AppealCaseState.COMPLETED
    ) {
      throw new ForbiddenException(
        'Forbidden when the verdict appeal has been completed',
      )
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
