import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { EducationService } from '../education.service'
import { TeachingLicense } from './teachingLicense.model'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => [TeachingLicense])
  educationTeachingLicense(@CurrentUser() user: User) {
    return this.educationService.getTeachingLicenses(user.nationalId)
  }
}
