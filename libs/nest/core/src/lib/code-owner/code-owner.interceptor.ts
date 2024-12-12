import { withCodeOwner } from '@island.is/infra-tracing'
import { CodeOwners } from '@island.is/shared/constants'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { CODE_OWNER_KEY } from './code-owner.decorator'

@Injectable()
export class CodeOwnerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const codeOwner = this.reflector.getAllAndOverride<CodeOwners>(
      CODE_OWNER_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (codeOwner) {
      return withCodeOwner(codeOwner, () => next.handle())
    }
    return next.handle()
  }
}
