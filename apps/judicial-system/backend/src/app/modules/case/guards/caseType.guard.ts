import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { CaseType } from '@island.is/judicial-system/types'

import { Case } from '../../repository'

@Injectable()
export class CaseTypeGuard implements CanActivate {
  constructor(readonly allowedCaseTypes: CaseType[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    if (!this.allowedCaseTypes.includes(theCase.type)) {
      throw new ForbiddenException(`Forbidden for ${theCase.type} cases`)
    }

    return true
  }
}
