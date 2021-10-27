import { RolesRule } from '@island.is/financial-aid/shared/lib'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { getUserFromContext } from '../lib'
import { ApplicationService } from '../modules/application'
import { StaffService } from '../modules/staff'

@Injectable()
export class ApplicationGuard implements CanActivate {
  constructor(
    private applicationService: ApplicationService,
    private staffService: StaffService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = getUserFromContext(context)
    const request = context.switchToHttp().getRequest()

    if (!user) {
      return false
    }

    const application = await this.applicationService.findById(
      request.params.id,
      user.service,
    )

    if (user.service === RolesRule.VEITA) {
      const staff = await this.staffService.findByNationalId(user.nationalId)

      if (application.municipalityCode !== staff.municipalityId) {
        return false
      }
    } else if (user.service === RolesRule.OSK) {
      if (application.nationalId === user.nationalId) {
        return false
      }
    } else {
      return false
    }

    request.application = application

    return true
  }
}
