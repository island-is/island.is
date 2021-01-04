import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AccessService } from '@island.is/auth-api-lib'

@Injectable()
export class NationalIdGuard implements CanActivate {
  constructor(private readonly accessService: AccessService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userNationalId = this.getUserNationalId(context)

    return this.accessService.hasAccess(userNationalId)
  }

  private getUserNationalId(context: ExecutionContext): string {
    const request = context.getArgs()[0]

    if (request) {
      return request.user.nationalId
    } else {
      const ctx = GqlExecutionContext.create(context)
      return ctx.getContext().req.user.nationalId
    }
  }
}
