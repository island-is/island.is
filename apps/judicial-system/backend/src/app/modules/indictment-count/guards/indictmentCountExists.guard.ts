import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'
import { IndictmentCountService } from '../indictmentCount.service'

@Injectable()
export class IndictmentCountExistsGuard implements CanActivate {
  constructor(
    private readonly indictmentCountService: IndictmentCountService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const indictmentCountId = request.params.indictmentCountId

    if (!indictmentCountId) {
      throw new BadRequestException('Missing indictment count id')
    }

    const indictmentCount = await this.indictmentCountService.findById(
      indictmentCountId,
    )

    if (!indictmentCount || indictmentCount.caseId !== theCase.id) {
      throw new NotFoundException(
        `Indictment count ${indictmentCountId} of case ${theCase.id} does not exist`,
      )
    }

    request.indictmentCount = indictmentCount

    return true
  }
}
