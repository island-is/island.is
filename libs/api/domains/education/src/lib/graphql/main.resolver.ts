import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { EducationService } from '../education.service'
import { License } from './license.model'
import { SendLicense } from './sendLicense.model'
import { SendLicenseInput } from './sendLicense.input'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => [License])
  educationLicense(@CurrentUser() user: User) {
    return this.educationService.getLicenses(user.nationalId)
  }

  @Mutation(() => SendLicense, { nullable: true })
  sendEducationLicense(
    @CurrentUser() user: User,
    @Args('input', { type: () => SendLicenseInput })
    input: SendLicenseInput,
  ) {
    return this.educationService.sendLicense(
      user.nationalId,
      input.email,
      input.licenseId,
    )
  }
}
