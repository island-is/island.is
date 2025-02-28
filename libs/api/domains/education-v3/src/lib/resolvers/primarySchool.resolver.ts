import { ApiScope } from '@island.is/auth/scopes'
import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { PrimarySchoolCareer } from '../models/primarySchoolCareer.model'
import { EducationServiceV3 } from '../educationV3.service'
import { StudentCareer } from '../models/studentCareer.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/education/primary-school' })
@Resolver()
export class PrimarySchoolResolver {
  constructor(private readonly educationService: EducationServiceV3) {}

  @Query(() => StudentCareer)
  @Scopes(ApiScope.education)
  @Audit()
  studentCareer(
    @CurrentUser() user: User,
  ): Promise<PrimarySchoolCareer | null> {
    return this.educationService.familyCareers(user)
  }
}
