import {
  Args,
  Query,
  Resolver,
  ResolveField,
  Parent,
  Directive,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { DrivingLicenseService } from './driving-license.service'
import { DrivingLicense } from './driving-license.model'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class DrivingLicenseResolver {
  constructor(private readonly drivingLicenseService: DrivingLicenseService) {}

  @Query(() => [DrivingLicense])
  drivingLicenses(@CurrentUser() user: User) {
    return this.drivingLicenseService.getDrivingLicenses(user.nationalId)
  }
}
