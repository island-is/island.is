import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { EducationService } from '../educationV2.service'
import { FamilyCompulsorySchoolCareer } from '../models/familyCareer.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/education/grade' })
@Resolver()
export class GradesResolver {
  constructor(private readonly educationService: EducationService) {}

  @Query(() => FamilyCompulsorySchoolCareer)
  @Scopes(ApiScope.education)
  @Audit()
  userFamilyExamResults(
    @CurrentUser() user: User,
  ): Promise<FamilyCompulsorySchoolCareer | null> {
    return this.educationService.familyCareers(user)
  }
}
