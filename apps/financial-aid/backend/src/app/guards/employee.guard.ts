import { RolesRule, StaffRole } from '@island.is/financial-aid/shared/lib'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { getUserFromContext } from '../lib'
import { StaffService } from '../modules/staff'

@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(private staffService: StaffService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = getUserFromContext(context)
    const request = context.switchToHttp().getRequest()

    if (!user || user.service !== RolesRule.VEITA) {
      return false
    }

    const staff = await this.staffService.findByNationalId(user.nationalId)

    if (staff.roles.includes(StaffRole.EMPLOYEE) || staff.active === false) {
      return false
    }

    request.staff = staff

    return true
  }
}
