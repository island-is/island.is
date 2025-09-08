import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common'

import { Case } from '../../repository'
import { InternalCaseService } from '../internalCase.service'

@Injectable()
export class CaseOriginalAncestorInterceptor implements NestInterceptor {
  constructor(private readonly internalCaseService: InternalCaseService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    request.case = await this.internalCaseService.findOriginalAncestor(theCase)

    return next.handle()
  }
}
