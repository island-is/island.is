import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

export const DOCUMENT_PROVIDER_ADMINS = 'DOCUMENT_PROVIDER_ADMINS'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const user = request.user
    const admins =
      process.env.DOCUMENT_PROVIDER_ADMINS === undefined
        ? []
        : process.env.DOCUMENT_PROVIDER_ADMINS.split(',')

    return admins.includes(user.nationalId)
  }
}
