import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { GqlExecutionContext } from '@nestjs/graphql'

import { environment } from '../../environments'

@Injectable()
export class NationalIdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userNationalId = this.getUserNationalId(context)

    const ids = environment.allowedNationalIds.split(',')

    if (!ids.includes(userNationalId)) {
      return false
    }

    return true
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
