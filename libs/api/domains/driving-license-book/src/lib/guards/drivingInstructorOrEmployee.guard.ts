import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'
import { GqlExecutionContext } from '@nestjs/graphql'
import { DrivingLicenseBookService } from '../drivingLicenseBook.service'

@Injectable()
export class DrivingInstructorOrEmployeeGuard implements CanActivate {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly drivingLicenseBookService: DrivingLicenseBookService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const user = ctx.getContext().req.user
    const teachingRights = await this.drivingLicenseService.getTeachingRights({
      nationalId: user.nationalId,
      token: user.authorization,
    })
    const staff = await this.drivingLicenseBookService.isSchoolStaff(user)
    const rights = teachingRights.hasTeachingRights || staff
    return rights
  }
}
