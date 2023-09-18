import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'
import { GqlExecutionContext } from '@nestjs/graphql'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@Injectable()
export class DrivingInstructorGuard implements CanActivate {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user
    const teachingRights = await this.drivingLicenseService.getTeachingRights({
      nationalId: user.nationalId,
      token: user.authorization,
    })
    this.logger.debug(
      `DrivingInstructorGuard: Has teaching rights ${teachingRights.hasTeachingRights}`,
    )
    return teachingRights.hasTeachingRights
  }
}
