import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { getRequest } from '@island.is/auth-nest-tools'
import { Features } from '@island.is/feature-flags'

import { FeatureFlagService } from './feature-flag.service'
import { FEATURE_FLAG_KEY } from './feature-flag.decorator'

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const featureFlag = this.reflector.getAllAndOverride<Features | undefined>(
      FEATURE_FLAG_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!featureFlag) {
      return true
    }

    const request = getRequest(context)
    const value = await this.featureFlagService.getValue(
      featureFlag,
      false,
      request.user,
    )
    return !!value
  }
}
