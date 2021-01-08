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

import { DrivingLicenseService } from '../drivingLicense.service'
import { DrivingLicense } from './drivingLicense.model'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver(() => DrivingLicense)
export class DrivingLicenseResolver {
  constructor(private readonly drivingLicenseService: DrivingLicenseService) {}

  @Query(() => DrivingLicense)
  drivingLicense(@CurrentUser() user: User) {
    return this.drivingLicenseService.getDrivingLicense(user.nationalId)
  }
}
