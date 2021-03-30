import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

export const DOCUMENT_PROVIDER_ADMINS = 'DOCUMENT_PROVIDER_ADMINS'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(DOCUMENT_PROVIDER_ADMINS)
    private admins: string,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const user = request.user

    return this.admins.includes(user.nationalId)
  }
}
