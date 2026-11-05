import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common'

import { getRequestTransaction } from '../../../middleware'
import { Case, CaseRepositoryService } from '../../repository'

@Injectable()
export class CaseOriginalAncestorInterceptor implements NestInterceptor {
  constructor(private readonly caseRepositoryService: CaseRepositoryService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new InternalServerErrorException('Missing case')
    }

    // Joins the request's transaction where a guard opened one, so that the
    // read does not need a pool connection of its own while that transaction
    // holds the case row's lock. Undefined on a route without one.
    const transaction = await getRequestTransaction()

    request.case = await this.caseRepositoryService.findOriginalAncestor(
      theCase,
      { transaction },
    )

    return next.handle()
  }
}
