import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { StaffService } from '../modules/staff'

@Injectable()
export class StaffGuard implements CanActivate {
  constructor(
    private staffService: StaffService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (
      !user ||
      !user.scope.includes(MunicipalitiesFinancialAidScope.employee)
    ) {
      return false
    }

    const staff = await this.staffService.findByNationalId(user.nationalId)

    if (!staff || staff.active === false) {
      return false
    }

    const staffRolesRule =
      this.reflector.get<StaffRole[]>(
        'staff-roles-rules',
        context.getHandler(),
      ) ?? []

    const rule = staffRolesRule.some((r) => staff.roles.includes(r))

    if (rule === false && staffRolesRule.length > 0) {
      return false
    }

    request.staff = staff

    return true
  }
}
