import { ApiScope } from '@island.is/auth/scopes'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { isDefined } from '@island.is/shared/utils'
import { PrimarySchoolStudent } from '../models/primarySchool/primarySchoolStudent.model'
import { PrimarySchoolAssessment } from '../models/primarySchool/primarySchoolAssessment.model'
import { mapAssessment } from '../models/primarySchool/primarySchool.mapper'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => PrimarySchoolStudent)
export class PrimarySchoolResolver {
  constructor(
    private readonly primarySchoolService: PrimarySchoolClientService,
  ) {}

  @Query(() => [PrimarySchoolStudent], { nullable: true })
  @Scopes(ApiScope.education)
  async primarySchoolStudents(@CurrentUser() user: User) {
    const students = await this.primarySchoolService.getStudents(user)
    return students
      ?.filter((s) => isDefined(s.id))
      .map((s) => ({ ...s, contactType: s.relationType }))
  }

  @Query(() => PrimarySchoolStudent, { nullable: true })
  @Scopes(ApiScope.education)
  async primarySchoolStudent(
    @CurrentUser() user: User,
    @Args('studentId') studentId: string,
  ) {
    const students = await this.primarySchoolService.getStudents(user)
    const student = students?.find((s) => s.id === studentId)
    if (!student?.id) return null
    return { ...student, contactType: student.relationType }
  }

  @ResolveField(() => [PrimarySchoolAssessment], { nullable: true })
  @Scopes(ApiScope.education)
  async assessmentHistory(
    @CurrentUser() user: User,
    @Parent() student: PrimarySchoolStudent,
  ) {
    const subjects = await this.primarySchoolService.getAssessmentSubjects(
      user,
      student.id,
    )
    return subjects
      ?.flatMap((s) => s.assessmentTypes ?? [])
      .map((t) => mapAssessment(t, student.id))
      .filter(isDefined)
  }
}
