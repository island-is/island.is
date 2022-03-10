import { Observable } from 'rxjs'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common'

import { CaseService } from '../case.service'

@Injectable()
export class CaseOriginalAncestorInterceptor implements NestInterceptor {
  constructor(private readonly caseService: CaseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()

    if (!request.case) {
      throw new InternalServerErrorException('Missing case')
    }

    request.case = await this.caseService.findOriginalAncestor(request.case)

    return next.handle()
  }
}
