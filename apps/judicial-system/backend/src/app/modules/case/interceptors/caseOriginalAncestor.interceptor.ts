import { Observable } from 'rxjs'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common'

import { InternalCaseService } from '../internalCase.service'

@Injectable()
export class CaseOriginalAncestorInterceptor implements NestInterceptor {
  constructor(private readonly internalCaseService: InternalCaseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()

    if (!request.case) {
      throw new InternalServerErrorException('Missing case')
    }

    request.case = await this.internalCaseService.findOriginalAncestor(
      request.case,
    )

    return next.handle()
  }
}
