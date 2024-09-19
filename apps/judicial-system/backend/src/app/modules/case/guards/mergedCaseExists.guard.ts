import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseService } from '../case.service'
import { Case } from '../models/case.model'

@Injectable()
export class MergedCaseExistsGuard implements CanActivate {
  constructor(private readonly caseService: CaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    const mergedCaseId = request.params.mergedCaseId
    console.log('mergedCaseId', mergedCaseId)

    if (!mergedCaseId) {
      return true
    }

    const mergedCase = theCase.mergedCases?.find(
      (mergedCase) => mergedCase.id === mergedCaseId,
    )

    if (!mergedCase) {
      throw new BadRequestException('Merged case not found')
    }

    request.params.caseId = mergedCaseId
    request.case = mergedCase

    return true
  }
}
