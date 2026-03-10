import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { PrimarySchoolAssessmentSubject } from '../models/primarySchool/primarySchoolAssessmentSubject.model'
import { PrimarySchoolStudent } from '../models/primarySchool/primarySchoolStudent.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class PrimarySchoolResolver {
  constructor(
    private readonly primarySchoolService: PrimarySchoolClientService,
  ) {}

  @Query(() => [PrimarySchoolStudent], { nullable: true })
  @Scopes(ApiScope.education)
  primarySchoolStudents(@CurrentUser() user: User) {
    return this.primarySchoolService.getStudents(user)
  }

  @Query(() => [PrimarySchoolAssessmentSubject], { nullable: true })
  @Scopes(ApiScope.education)
  primarySchoolAssessmentSubjects(
    @CurrentUser() user: User,
    @Args('studentId') studentId: string,
  ) {
    return this.primarySchoolService.getAssessmentSubjects(user, studentId)
  }
}
