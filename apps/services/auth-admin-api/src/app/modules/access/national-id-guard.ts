import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class NationalIdGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userNationalId = this.getUserNationalId(context)

    return this.allowedNationalIds.includes(userNationalId)
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

  // Hardcoded list of nationalIds with access to the admin backend
  private allowedNationalIds: string[] = [
    '0907704039',
    '3004764579',
    '2809923489',
  ]
}
