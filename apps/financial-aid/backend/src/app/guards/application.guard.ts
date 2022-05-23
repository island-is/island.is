import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { ApplicationService } from '../modules/application'
import { StaffService } from '../modules/staff'

@Injectable()
export class ApplicationGuard implements CanActivate {
  constructor(
    private applicationService: ApplicationService,
    private staffService: StaffService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      return false
    }

    const application = await this.applicationService.findById(
      request.params.id || request.body.applicationId,
      user.scope.includes(MunicipalitiesFinancialAidScope.employee),
    )

    if (user.scope.includes(MunicipalitiesFinancialAidScope.employee)) {
      const staff = await this.staffService.findByNationalId(user.nationalId)
      if (!staff.municipalityIds.includes(application.municipalityCode)) {
        return false
      }
    } else if (user.scope.includes(MunicipalitiesFinancialAidScope.applicant)) {
      if (
        application.nationalId !== user.nationalId &&
        user.nationalId !== application.spouseNationalId
      ) {
        return false
      }
    } else {
      return false
    }

    request.application = application

    return true
  }
}
