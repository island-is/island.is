import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { DrivingLicenseBookService } from '../drivingLicenseBook.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@Injectable()
export class DrivingSchoolEmployeeGuard implements CanActivate {
  constructor(
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user
    const isStaff = await this.drivingLicenseBookService.isSchoolStaff(user)
    this.logger.debug(`DrivingSchoolEmployeeGuard: Is staff ${isStaff}`)
    return isStaff
  }
}
