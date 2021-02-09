import { Args, Query, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { EducationService } from '../education.service'
import { TeachingLicense } from './teachingLicense.model'
import { SendTeachingLicense } from './sendTeachingLicense.model'
import { SendTeachingLicenseInput } from './sendTeachingLicense.input'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => [TeachingLicense])
  educationTeachingLicense(@CurrentUser() user: User) {
    return this.educationService.getTeachingLicenses(user.nationalId)
  }

  @Mutation(() => SendTeachingLicense, { nullable: true })
  educationSendTeachingLicense(
    @CurrentUser() user: User,
    @Args('input', { type: () => SendTeachingLicenseInput })
    input: SendTeachingLicenseInput,
  ) {
    return this.educationService.sendTeachingLicense(
      user.nationalId,
      input.email,
      input.teachingLicenseId,
    )
  }
}
