import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { EducationServiceV3 } from './educationV3.service'
import { StudentCareer } from './models/studentCareer.model'
import { PrimarySchoolCareerInput } from './dtos/studentCareer.input'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@CodeOwner(CodeOwners.Hugsmidjan)
@Audit({ namespace: '@island.is/api/education-v3' })
@Resolver()
export class EducationV3Resolver {
  constructor(private readonly educationService: EducationServiceV3) {}

  @Query(() => StudentCareer, {
    name: 'educationV3StudentCareer',
    nullable: true,
  })
  @Scopes(ApiScope.education)
  @Audit()
  studentCareer(
    @CurrentUser() user: User,
    @Args('input', { type: () => PrimarySchoolCareerInput, nullable: true })
    input?: PrimarySchoolCareerInput,
  ): Promise<StudentCareer | null> {
    return this.educationService.getStudentCareer(user, input?.studentId)
  }
}
