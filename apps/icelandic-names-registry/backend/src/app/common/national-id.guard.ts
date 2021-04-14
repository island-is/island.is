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

    if (!userNationalId) {
      return false
    }

    const ids = environment.allowedNationalIds.split(',')

    return ids.includes(userNationalId)
  }

  private getUserNationalId(context: ExecutionContext): string | void {
    const request = context.getArgs()[0]

    if (request) {
      return request.user.nationalId
    }
  }
}
