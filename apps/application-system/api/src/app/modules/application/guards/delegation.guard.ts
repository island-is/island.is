import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

@Injectable()
export class DelegationGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const request = context.switchToHttp().getRequest()
    // const user = ctx.getContext().req.user
    console.log("CONTEXT",request.params)

    // If user does not have actor return true

    // If user has actor get template for application and see if it has allowed delegations equals user.acctor.delegationtype
    return true
  }
}
