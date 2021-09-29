import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

import {
  User,
  RolesRule,
  getUserFromContext,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationService } from '../modules/application'

@Injectable()
export class ApplicationGuard implements CanActivate {
  constructor(private applicationService: ApplicationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = getUserFromContext(context)
    const request = context.switchToHttp().getRequest()

    // Deny if no user
    if (!user) {
      return false
    }

    if (user.service === RolesRule.VEITA) {
      return true
    }

    const hasUserAccess = await this.applicationService.hasAccessToApplication(
      user.nationalId,
      request.params.id,
    )

    return hasUserAccess
  }
}
