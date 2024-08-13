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
import { EducationServiceV2 } from '../educationV2.service'
import { FamilyCompulsorySchoolCareer } from '../models/familyCareer.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/education/grade' })
@Resolver()
export class GradesResolver {
  constructor(private readonly educationService: EducationServiceV2) {}

  @Query(() => FamilyCompulsorySchoolCareer)
  @Scopes(ApiScope.education)
  @Audit()
  userFamilyExamResults(
    @CurrentUser() user: User,
  ): Promise<FamilyCompulsorySchoolCareer | null> {
    return this.educationService.familyCareers(user)
  }
}
