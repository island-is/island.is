import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { Case } from '../../repository'
import { CaseService } from '../case.service'

@Injectable()
export class MergedCaseExistsGuard implements CanActivate {
  constructor(private readonly caseService: CaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const mergedCaseId = request.params.mergedCaseId

    // If the user is not accessing a merged case, we don't need to do anything
    if (!mergedCaseId) {
      return true
    }

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const mergedCase = theCase.mergedCases?.find(
      (mergedCase) => mergedCase.id === mergedCaseId,
    )

    if (!mergedCase) {
      throw new BadRequestException(`Merged case ${mergedCaseId} not found`)
    }

    request.mergedCaseParent = theCase
    request.params.caseId = mergedCaseId
    request.case = mergedCase

    return true
  }
}
